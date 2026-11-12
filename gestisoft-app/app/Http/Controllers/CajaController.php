<?php

namespace App\Http\Controllers;

use App\Models\TurnoCaja;
use App\Models\User;
use App\Models\Venta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CajaController extends Controller
{
    /**
     * Consulta el estado de la caja para el usuario actual en el negocio.
     */
    public function estado()
    {
        $turno = TurnoCaja::abierto()
            ->where('user_id', Auth::id())
            ->first();

        if (!$turno) {
            return response()->json([
                'abierto' => false,
                'turno' => null,
            ]);
        }

        return response()->json([
            'abierto' => true,
            'turno' => [
                'id' => $turno->id,
                'monto_inicial' => $turno->monto_inicial,
                'fecha_apertura' => $turno->fecha_apertura->format('H:i d/m/Y'),
                'ventas_efectivo' => $turno->monto_ventas_efectivo,
                'ventas_debito' => $turno->monto_ventas_debito,
                'ventas_credito' => $turno->monto_ventas_credito,
                'ventas_tarjeta' => $turno->monto_ventas_tarjeta,
                'ventas_transferencia' => $turno->monto_ventas_transferencia,
            ],
        ]);
    }

    /**
     * Apertura de un nuevo turno de caja con fondo inicial.
     */
    public function abrir(Request $request)
    {
        $validated = $request->validate([
            'monto_inicial' => 'required|integer|min:0',
        ], [
            'monto_inicial.required' => 'Debe ingresar un monto inicial para abrir la caja.',
            'monto_inicial.integer' => 'El monto inicial debe ser un número entero.',
            'monto_inicial.min' => 'El monto inicial no puede ser negativo.',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            // Bloqueo pesimista para evitar que dos peticiones simultáneas abran dos turnos
            $turnoExistente = TurnoCaja::abierto()
                ->where('user_id', Auth::id())
                ->lockForUpdate()
                ->first();

            if ($turnoExistente) {
                if ($request->wantsJson()) {
                    return response()->json(['error' => 'Ya existe un turno de caja abierto para este usuario.'], 422);
                }
                return back()->withErrors(['caja' => 'Ya existe un turno de caja abierto para este usuario.']);
            }

            $montoInicial = (int) $validated['monto_inicial'];

            $turno = TurnoCaja::create([
                'user_id' => Auth::id(),
                'monto_inicial' => $montoInicial,
                'total_esperado' => $montoInicial,
                'estado' => 'abierto',
                'fecha_apertura' => now(),
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Turno de caja abierto exitosamente.',
                    'turno' => $turno,
                ]);
            }

            return redirect()->route('pos.index')->with('success', 'Turno de caja abierto exitosamente con fondo inicial de $' . number_format($montoInicial, 0, ',', '.'));
        });
    }

    /**
     * Cierre de turno mediante arqueo ciego (declaración física de efectivo).
     */
    public function cerrar(Request $request)
    {
        $validated = $request->validate([
            'monto_declarado' => 'required|integer|min:0',
            'observaciones' => 'nullable|string|max:500',
        ], [
            'monto_declarado.required' => 'Debe ingresar el dinero físico total contado en gaveta.',
            'monto_declarado.integer' => 'El monto declarado debe ser un número entero.',
            'monto_declarado.min' => 'El monto declarado no puede ser negativo.',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $turno = TurnoCaja::abierto()
                ->where('user_id', Auth::id())
                ->lockForUpdate()
                ->first();

            if (!$turno) {
                if ($request->wantsJson()) {
                    return response()->json(['error' => 'No hay ningún turno de caja abierto para cerrar.'], 422);
                }
                return back()->withErrors(['caja' => 'No hay ningún turno de caja abierto para cerrar.']);
            }

            // Sincronizar totales para asegurar que todas las ventas registradas estén consolidadas
            $turno->sincronizarTotales();
            $turno->refresh();

            $montoDeclarado = (int) $validated['monto_declarado'];
            $totalEsperado = (int) $turno->total_esperado;
            $diferencia = $montoDeclarado - $totalEsperado;

            $turno->update([
                'monto_declarado' => $montoDeclarado,
                'diferencia' => $diferencia,
                'observaciones' => $validated['observaciones'] ?? null,
                'fecha_cierre' => now(),
                'estado' => 'cerrado',
            ]);

            $resumenCierre = [
                'id' => $turno->id,
                'monto_inicial' => $turno->monto_inicial,
                'ventas_efectivo' => $turno->monto_ventas_efectivo,
                'ventas_debito' => $turno->monto_ventas_debito,
                'ventas_credito' => $turno->monto_ventas_credito,
                'ventas_tarjeta' => $turno->monto_ventas_tarjeta,
                'ventas_transferencia' => $turno->monto_ventas_transferencia,
                'total_esperado' => $totalEsperado,
                'monto_declarado' => $montoDeclarado,
                'diferencia' => $diferencia,
                'fecha_apertura' => $turno->fecha_apertura->format('H:i d/m/Y'),
                'fecha_cierre' => $turno->fecha_cierre->format('H:i d/m/Y'),
                'observaciones' => $turno->observaciones,
            ];

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Turno de caja cerrado exitosamente.',
                    'resumen' => $resumenCierre,
                ]);
            }

            return redirect()->route('pos.index')->with([
                'success' => 'Cierre de caja realizado exitosamente.',
                'resumenCierre' => $resumenCierre,
            ]);
        });
    }

    /**
     * Listado administrativo de turnos de caja con filtros y métricas.
     */
    public function index(Request $request)
    {
        $fecha = $request->input('fecha');
        $estado = $request->input('estado');
        $userId = $request->input('user_id');

        $query = TurnoCaja::with('user')
            ->latest('created_at');

        if ($fecha) {
            $query->whereDate('fecha_apertura', $fecha);
        }

        if ($estado && in_array($estado, ['abierto', 'cerrado'])) {
            $query->where('estado', $estado);
        }

        if ($userId) {
            $query->where('user_id', $userId);
        }

        $turnos = $query->paginate(15)->withQueryString();

        // Lista de cajeros que han operado cajas para alimentar el filtro
        $cajeros = User::whereHas('turnosCaja')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        // Métricas calculadas sobre el alcance del filtro actual
        $metricQuery = TurnoCaja::query();
        if ($fecha) {
            $metricQuery->whereDate('fecha_apertura', $fecha);
        }
        if ($estado && in_array($estado, ['abierto', 'cerrado'])) {
            $metricQuery->where('estado', $estado);
        }
        if ($userId) {
            $metricQuery->where('user_id', $userId);
        }

        $totalTurnos = (clone $metricQuery)->count();
        $turnosAbiertosGlobal = TurnoCaja::abierto()->count();
        $turnosAbiertosFiltrados = (clone $metricQuery)->where('estado', 'abierto')->count();

        $totalRecaudadoEfectivo = (int) (clone $metricQuery)->sum('monto_ventas_efectivo');
        $totalRecaudadoDebito = (int) (clone $metricQuery)->sum('monto_ventas_debito');
        $totalRecaudadoCredito = (int) (clone $metricQuery)->sum('monto_ventas_credito');
        $totalRecaudadoTransferencia = (int) (clone $metricQuery)->sum('monto_ventas_transferencia');
        $totalRecaudadoTarjetaLegacy = (int) (clone $metricQuery)->sum('monto_ventas_tarjeta');
        $totalVentasGeneral = $totalRecaudadoEfectivo + $totalRecaudadoDebito + $totalRecaudadoCredito + $totalRecaudadoTransferencia + $totalRecaudadoTarjetaLegacy;
        $totalRecaudadoDigital = $totalRecaudadoDebito + $totalRecaudadoCredito + $totalRecaudadoTransferencia;

        return Inertia::render('Caja/Index', [
            'turnos' => $turnos,
            'cajeros' => $cajeros,
            'filters' => [
                'fecha' => $fecha ?? '',
                'estado' => $estado ?? '',
                'user_id' => $userId ? (int) $userId : '',
            ],
            'metrics' => [
                'total_turnos' => $totalTurnos,
                'total_turnos_global' => TurnoCaja::count(),
                'turnos_abiertos' => $turnosAbiertosGlobal,
                'turnos_abiertos_filtrados' => $turnosAbiertosFiltrados,
                'total_efectivo' => $totalRecaudadoEfectivo,
                'total_debito' => $totalRecaudadoDebito,
                'total_credito' => $totalRecaudadoCredito,
                'total_transferencia' => $totalRecaudadoTransferencia,
                'total_digital' => $totalRecaudadoDigital,
                'total_ventas_general' => $totalVentasGeneral,
                'is_filtered' => !empty($fecha) || !empty($estado) || !empty($userId),
            ],
        ]);
    }

    /**
     * Consulta detallada de un turno y todas sus boletas/transacciones.
     */
    public function transacciones($id)
    {
        $turno = TurnoCaja::with(['user.negocio', 'negocio'])->findOrFail($id);

        $ventas = Venta::where('turno_caja_id', $id)
            ->with(['detalles', 'user'])
            ->latest('created_at')
            ->get();

        // Calculamos los subtotales directamente desde las ventas reales para total precisión
        $ventasEfectivo = (int) $ventas->filter(function ($v) {
            $m = mb_strtolower(trim($v->payment_method ?? ''));
            return in_array($m, ['efectivo', 'cash']);
        })->sum('total');

        $ventasDebito = (int) $ventas->filter(function ($v) {
            $m = mb_strtolower(trim($v->payment_method ?? ''));
            return in_array($m, ['débito', 'debito', 'debit']);
        })->sum('total');

        $ventasCredito = (int) $ventas->filter(function ($v) {
            $m = mb_strtolower(trim($v->payment_method ?? ''));
            return in_array($m, ['crédito', 'credito', 'credit']);
        })->sum('total');

        $ventasTransferencia = (int) $ventas->filter(function ($v) {
            $m = mb_strtolower(trim($v->payment_method ?? ''));
            return in_array($m, ['transferencia', 'transfer']);
        })->sum('total');

        $ventasTarjetaLegacy = (int) $ventas->filter(function ($v) {
            $m = mb_strtolower(trim($v->payment_method ?? ''));
            return in_array($m, ['tarjeta', 'card']);
        })->sum('total');

        $ventasTarjetaTotal = $ventasDebito + $ventasCredito + $ventasTarjetaLegacy;
        $totalVentasMonto = (int) $ventas->sum('total');
        $totalEsperado = $turno->monto_inicial + $ventasEfectivo;

        $negocioNombre = $turno->negocio?->name 
            ?? $turno->user?->negocio?->name 
            ?? (Auth::user()?->negocio?->name ?? 'GestiSoft');

        return response()->json([
            'turno' => [
                'id' => $turno->id,
                'cajero' => $turno->user ? $turno->user->name : 'N/A',
                'user' => $turno->user ? ['id' => $turno->user->id, 'name' => $turno->user->name] : null,
                'negocio_nombre' => $negocioNombre,
                'estado' => $turno->estado,
                'monto_inicial' => $turno->monto_inicial,
                'monto_ventas_efectivo' => $ventasEfectivo,
                'monto_ventas_debito' => $ventasDebito,
                'monto_ventas_credito' => $ventasCredito,
                'monto_ventas_tarjeta' => $ventasTarjetaTotal,
                'monto_ventas_tarjeta_legacy' => $ventasTarjetaLegacy,
                'monto_ventas_transferencia' => $ventasTransferencia,
                'total_ventas' => $totalVentasMonto,
                'total_esperado' => $totalEsperado,
                'monto_declarado' => $turno->monto_declarado,
                'diferencia' => $turno->diferencia,
                'fecha_apertura' => $turno->fecha_apertura ? $turno->fecha_apertura->format('H:i d/m/Y') : null,
                'fecha_cierre' => $turno->fecha_cierre ? $turno->fecha_cierre->format('H:i d/m/Y') : null,
                'observaciones' => $turno->observaciones,
            ],
            'ventas' => $ventas->map(function ($v) {
                $m = mb_strtolower(trim($v->payment_method ?? ''));
                $normalizado = 'Efectivo';
                if (in_array($m, ['efectivo', 'cash'])) {
                    $normalizado = 'Efectivo';
                } elseif (in_array($m, ['débito', 'debito', 'debit'])) {
                    $normalizado = 'Débito';
                } elseif (in_array($m, ['crédito', 'credito', 'credit'])) {
                    $normalizado = 'Crédito';
                } elseif (in_array($m, ['transferencia', 'transfer'])) {
                    $normalizado = 'Transferencia';
                } elseif (in_array($m, ['tarjeta', 'card'])) {
                    $normalizado = 'Tarjeta';
                } else {
                    $normalizado = $v->payment_method ?: 'Efectivo';
                }

                return [
                    'id' => $v->id,
                    'hora' => $v->created_at->format('H:i:s d/m/Y'),
                    'payment_method' => $v->payment_method,
                    'payment_method_normalized' => $normalizado,
                    'total' => $v->total,
                    'neto' => $v->neto,
                    'iva' => $v->iva,
                    'amount_received' => $v->amount_received,
                    'change' => $v->change,
                    'cajero' => $v->user ? $v->user->name : 'N/A',
                    'detalles' => $v->detalles->map(function ($d) {
                        return [
                            'id' => $d->id,
                            'product_name' => $d->product_name,
                            'quantity' => $d->quantity,
                            'price' => $d->price,
                            'subtotal' => $d->subtotal,
                        ];
                    }),
                ];
            }),
        ]);
    }

    /**
     * Muestra el resumen y auditoría de un turno específico para el administrador.
     */
    public function resumen($id)
    {
        $turno = TurnoCaja::with(['user', 'ventas'])
            ->findOrFail($id);

        return response()->json([
            'id' => $turno->id,
            'cajero' => $turno->user ? $turno->user->name : 'N/A',
            'estado' => $turno->estado,
            'monto_inicial' => $turno->monto_inicial,
            'ventas_efectivo' => $turno->monto_ventas_efectivo,
            'ventas_debito' => $turno->monto_ventas_debito,
            'ventas_credito' => $turno->monto_ventas_credito,
            'ventas_tarjeta' => $turno->monto_ventas_tarjeta,
            'ventas_transferencia' => $turno->monto_ventas_transferencia,
            'total_esperado' => $turno->total_esperado,
            'monto_declarado' => $turno->monto_declarado,
            'diferencia' => $turno->diferencia,
            'fecha_apertura' => $turno->fecha_apertura ? $turno->fecha_apertura->format('H:i d/m/Y') : null,
            'fecha_cierre' => $turno->fecha_cierre ? $turno->fecha_cierre->format('H:i d/m/Y') : null,
            'observaciones' => $turno->observaciones,
            'total_transacciones' => $turno->ventas->count(),
        ]);
    }
}

