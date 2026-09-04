<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Venta;
use App\Models\VentaDetalle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class POSController extends Controller
{
    public function index()
    {
        return Inertia::render('POS/Index');
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
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|integer|min:0',
            'total' => 'required|integer|min:0',
            'payment_method' => 'required|string',
            'amount_received' => 'nullable|integer|min:0',
            'change' => 'nullable|integer|min:0',
        ]);

        try {
            DB::beginTransaction();

            $venta = Venta::create([
                'user_id' => auth()->id(),
                'total' => $validated['total'],
                'payment_method' => $validated['payment_method'],
                'amount_received' => $validated['amount_received'] ?? null,
                'change' => $validated['change'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                // Bloqueo pesimista para evitar condiciones de carrera en el stock
                $product = Product::where('id', $item['product_id'])->lockForUpdate()->first();

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

            DB::commit();

            return redirect()->back()->with('success', 'Venta procesada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['checkout' => $e->getMessage()]);
        }
    }
}
