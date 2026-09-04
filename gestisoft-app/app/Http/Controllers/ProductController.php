<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
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

        Product::create($validated);

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
        ], [
            'sku.unique' => 'Ya existe un producto con este SKU en tu inventario.',
        ]);

        $product->update($validated);

        return redirect()->route('inventory.index');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('inventory.index');
    }
}
