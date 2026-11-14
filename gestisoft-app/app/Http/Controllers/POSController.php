<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\TurnoCaja;
use App\Models\Venta;
use App\Models\VentaDetalle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class POSController extends Controller
{
    public function index()
    {
        $turno = TurnoCaja::abierto()
            ->where('user_id', auth()->id())
            ->first();

        return Inertia::render('POS/Index', [
            'turnoActivo' => $turno ? [
                'id' => $turno->id,
                'monto_inicial' => $turno->monto_inicial,
                'fecha_apertura' => $turno->fecha_apertura ? $turno->fecha_apertura->format('H:i d/m/Y') : null,
                'ventas_efectivo' => $turno->monto_ventas_efectivo,
                'ventas_debito' => $turno->monto_ventas_debito,
                'ventas_credito' => $turno->monto_ventas_credito,
                'ventas_tarjeta' => $turno->monto_ventas_tarjeta,
                'ventas_transferencia' => $turno->monto_ventas_transferencia,
                'total_ventas' => (int) $turno->ventas()->sum('total'),
                'total_esperado' => $turno->total_esperado,
            ] : null,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('q');

        if (!$query) {
            return response()->json([]);
        }

        // Buscar por SKU exacto o coincidencia en nombre.
        // El Trait HasNegocio filtra automáticamente por el negocio del usuario.
        $products = Product::where(function ($q) use ($query) {
                $q->where('sku', $query)
                  ->orWhere('name', 'like', '%' . $query . '%');
            })
            ->limit(10)
            ->get();

        return response()->json($products);
    }

    public function checkout(Request $request)
    {
        // 1. Validar que exista un turno de caja abierto para este cajero en este negocio
        $turnoActivo = TurnoCaja::abierto()
            ->where('user_id', auth()->id())
            ->first();

        if (!$turnoActivo) {
            return back()->withErrors(['checkout' => 'Debe abrir un turno de caja antes de registrar ventas.']);
        }

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
            'amount_received' => 'nullable|integer|min:0',
        ]);

        try {
            DB::beginTransaction();

            $totalCalculado = 0;
            $itemsDetalles = [];

            // 2. Procesar ítems bloqueando filas y calculando precios exclusivamente en servidor
            foreach ($validated['items'] as $item) {
                $product = Product::where('id', $item['product_id'])->lockForUpdate()->first();

                if (!$product) {
                    throw new \Exception("Uno de los productos seleccionados no se encuentra disponible.");
                }

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stock insuficiente para el producto: {$product->name}");
                }

                $subtotal = (int) $product->price * (int) $item['quantity'];
                $totalCalculado += $subtotal;

                $itemsDetalles[] = [
                    'product' => $product,
                    'quantity' => (int) $item['quantity'],
                    'price' => (int) $product->price,
                    'subtotal' => $subtotal,
                ];
            }

            // 3. Cálculos tributarios oficiales
            $neto = (int) round($totalCalculado / 1.19);
            $iva = $totalCalculado - $neto;

            // 4. Validación de efectivo y cálculo de vuelto en servidor
            $esEfectivo = in_array(mb_strtolower(trim($validated['payment_method'])), ['efectivo', 'cash']);
            $amountReceived = null;
            $change = null;

            if ($esEfectivo) {
                $amountReceived = (int) ($validated['amount_received'] ?? 0);
                if ($amountReceived < $totalCalculado) {
                    throw new \Exception("El monto recibido ($" . number_format($amountReceived, 0, ',', '.') . ") es insuficiente para cubrir el total ($" . number_format($totalCalculado, 0, ',', '.') . ").");
                }
                $change = $amountReceived - $totalCalculado;
            }

            // 5. Crear la venta con importes garantizados por el servidor
            $venta = Venta::create([
                'negocio_id' => auth()->user()->negocio_id,
                'user_id' => auth()->id(),
                'turno_caja_id' => $turnoActivo->id,
                'total' => $totalCalculado,
                'neto' => $neto,
                'iva' => $iva,
                'payment_method' => $validated['payment_method'],
                'amount_received' => $amountReceived,
                'change' => $change,
            ]);

            // 6. Descontar stock y registrar detalles
            foreach ($itemsDetalles as $detalle) {
                $prod = $detalle['product'];
                $prod->stock -= $detalle['quantity'];
                $prod->save();

                VentaDetalle::create([
                    'venta_id' => $venta->id,
                    'product_id' => $prod->id,
                    'product_name' => $prod->name,
                    'quantity' => $detalle['quantity'],
                    'price' => $detalle['price'],
                    'subtotal' => $detalle['subtotal'],
                ]);
            }

            // 7. Sincronizar totales del turno activo tras la venta
            $turnoActivo->sincronizarTotales();

            DB::commit();

            return redirect()->back()->with('success', 'Venta procesada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['checkout' => $e->getMessage()]);
        }
    }
}
