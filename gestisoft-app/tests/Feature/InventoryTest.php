<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Negocio;
use App\Models\Product;
use App\Models\MovimientoStock;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_al_crear_producto_se_crea_movimiento_de_stock_inicial()
    {
        $negocio = Negocio::create(['name' => 'Local 1']);
        $user = User::factory()->create(['negocio_id' => $negocio->id]);

        $this->actingAs($user);

        $response = $this->post('/inventory', [
            'sku' => '789',
            'name' => 'Clavos',
            'price' => 50,
            'stock' => 100,
        ]);

        $response->assertRedirect('/inventory');

        $this->assertDatabaseHas('products', ['sku' => '789']);
        $this->assertDatabaseHas('movimiento_stocks', [
            'motivo' => 'Inventario Inicial',
            'cantidad_nueva' => 100,
            'diferencia' => 100,
            'user_id' => $user->id
        ]);
    }

    public function test_modificar_stock_requiere_motivo_y_crea_kardex()
    {
        $negocio = Negocio::create(['name' => 'Local 1']);
        $user = User::factory()->create(['negocio_id' => $negocio->id]);
        
        $this->actingAs($user);

        $producto = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => '321',
            'name' => 'Pintura',
            'price' => 500,
            'stock' => 10,
        ]);

        $response = $this->put("/inventory/{$producto->id}", [
            'sku' => '321',
            'name' => 'Pintura',
            'price' => 500,
            'stock' => 8,
            'motivo' => 'Deterioro'
        ]);

        $response->assertRedirect('/inventory');

        $this->assertDatabaseHas('products', ['stock' => 8]);
        $this->assertDatabaseHas('movimiento_stocks', [
            'product_id' => $producto->id,
            'cantidad_anterior' => 10,
            'cantidad_nueva' => 8,
            'diferencia' => -2,
            'motivo' => 'Deterioro'
        ]);
    }
}
