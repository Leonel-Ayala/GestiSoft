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
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|integer|min:0',
            'total' => 'required|integer|min:0',
            'neto' => 'required|integer|min:0',
            'iva' => 'required|integer|min:0',
            'payment_method' => 'required|string',
            'amount_received' => 'nullable|integer|min:0',
            'change' => 'nullable|integer|min:0',
        ]);

        try {
            DB::beginTransaction();

            $venta = Venta::create([
                'negocio_id' => auth()->user()->negocio_id,
                'user_id' => auth()->id(),
                'turno_caja_id' => $turnoActivo->id,
                'total' => $validated['total'],
                'neto' => $validated['neto'],
                'iva' => $validated['iva'],
                'payment_method' => $validated['payment_method'],
                'amount_received' => $validated['amount_received'] ?? null,
                'change' => $validated['change'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                // Bloqueo pesimista para evitar condiciones de carrera en el stock
                $product = Product::where('id', $item['product_id'])->lockForUpdate()->first();

                if (!$product) {
                    $nombre = $item['name'] ?? 'solicitado';
                    throw new \Exception("El producto '{$nombre}' ya no se encuentra disponible en el inventario.");
                }

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stock insuficiente para el producto: {$product->name}");
                }

                // Descontar stock
                $product->stock -= $item['quantity'];
                $product->save();

                // Registrar detalle de venta
                VentaDetalle::create([
                    'venta_id' => $venta->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['quantity'] * $item['price'],
                ]);
            }

            // Sincronizar totales del turno activo tras la venta
            $turnoActivo->sincronizarTotales();

            DB::commit();

            return redirect()->back()->with('success', 'Venta procesada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['checkout' => $e->getMessage()]);
        }
    }
}
