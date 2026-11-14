<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index()
    {
        // ¡Gracias a nuestro Trait HasNegocio, esto solo traerá los productos del Negocio del usuario!
        $products = Product::latest()->get(); 
        
        return Inertia::render('Inventory/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        return Inertia::render('Inventory/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => [
                'required',
                'string',
                'max:255',
                // Validación para que el SKU sea único, pero solo en el negocio actual
                Rule::unique('products')->where(function ($query) {
                    return $query->where('negocio_id', auth()->user()->negocio_id);
                })
            ],
            'name' => 'required|string|max:255',
            'price' => 'required|integer|min:0',
            'stock' => 'required|integer|min:0', // Esto cumple la regla: "No permitir guardar stock negativo"
        ], [
            'sku.unique' => 'Ya existe un producto con este SKU en tu inventario.',
        ]);

        DB::transaction(function () use ($validated) {
            $product = Product::create($validated);

            \App\Models\MovimientoStock::create([
                'product_id' => $product->id,
                'user_id' => auth()->id(),
                'cantidad_anterior' => 0,
                'cantidad_nueva' => $product->stock,
                'diferencia' => $product->stock,
                'motivo' => 'Inventario Inicial',
            ]);
        });

        return redirect()->route('inventory.index');
    }
    public function edit(Product $product)
    {
        return Inertia::render('Inventory/Edit', [
            'product' => $product
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'sku' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products')->where(function ($query) {
                    return $query->where('negocio_id', auth()->user()->negocio_id);
                })->ignore($product->id)
            ],
            'name' => 'required|string|max:255',
            'price' => 'required|integer|min:0',
            'stock' => 'required|integer|min:0',
            'motivo' => [
                Rule::requiredIf(fn () => (int) $request->stock !== (int) $product->stock),
                'nullable',
                'string',
                'max:255',
            ],
        ], [
            'sku.unique' => 'Ya existe un producto con este SKU en tu inventario.',
            'motivo.required' => 'Debe justificar el motivo al modificar el stock manualmente.',
        ]);

        DB::transaction(function () use ($product, $validated, $request) {
            $locked = Product::whereKey($product->id)->lockForUpdate()->firstOrFail();
            $cantidadAnterior = $locked->stock;
            $nuevoStock = (int) $validated['stock'];

            $locked->update([
                'sku' => $validated['sku'],
                'name' => $validated['name'],
                'price' => $validated['price'],
                'stock' => $nuevoStock,
            ]);

            if ($nuevoStock !== $cantidadAnterior) {
                \App\Models\MovimientoStock::create([
                    'product_id' => $locked->id,
                    'user_id' => auth()->id(),
                    'cantidad_anterior' => $cantidadAnterior,
                    'cantidad_nueva' => $nuevoStock,
                    'diferencia' => $nuevoStock - $cantidadAnterior,
                    'motivo' => $request->motivo,
                ]);
            }
        });

        return redirect()->route('inventory.index');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('inventory.index');
    }
}
