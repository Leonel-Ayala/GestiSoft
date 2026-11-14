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

    public function test_ajuste_de_stock_sin_motivo_es_rechazado()
    {
        $negocio = Negocio::create(['name' => 'Local 1']);
        $user = User::factory()->create(['negocio_id' => $negocio->id]);

        $this->actingAs($user);

        $producto = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => 'AJUSTE-01',
            'name' => 'Tornillos',
            'price' => 200,
            'stock' => 50,
        ]);

        // Intentar modificar stock a 40 sin enviar 'motivo'
        $response = $this->put("/inventory/{$producto->id}", [
            'sku' => 'AJUSTE-01',
            'name' => 'Tornillos',
            'price' => 200,
            'stock' => 40,
            'motivo' => '',
        ]);

        $response->assertSessionHasErrors(['motivo']);

        // El stock en base de datos no debe cambiar
        $this->assertDatabaseHas('products', [
            'id' => $producto->id,
            'stock' => 50,
        ]);

        // No se debe crear ningún movimiento de stock
        $this->assertDatabaseMissing('movimiento_stocks', [
            'product_id' => $producto->id,
            'cantidad_nueva' => 40,
        ]);
    }

    public function test_cambio_de_nombre_sin_cambio_de_stock_no_exige_motivo()
    {
        $negocio = Negocio::create(['name' => 'Local 1']);
        $user = User::factory()->create(['negocio_id' => $negocio->id]);

        $this->actingAs($user);

        $producto = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => 'NOM-01',
            'name' => 'Brocha 2 pulgadas',
            'price' => 1500,
            'stock' => 15,
        ]);

        // Modificar solo nombre y precio manteniendo stock en 15, motivo vacío
        $response = $this->put("/inventory/{$producto->id}", [
            'sku' => 'NOM-01',
            'name' => 'Brocha 2 pulgadas Profesional',
            'price' => 1800,
            'stock' => 15,
            'motivo' => '',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect('/inventory');

        $this->assertDatabaseHas('products', [
            'id' => $producto->id,
            'name' => 'Brocha 2 pulgadas Profesional',
            'price' => 1800,
            'stock' => 15,
        ]);

        // No debe haberse generado ningún movimiento de kardex
        $this->assertDatabaseMissing('movimiento_stocks', [
            'product_id' => $producto->id,
        ]);
    }

    public function test_eliminar_producto_conserva_kardex()
    {
        $negocio = Negocio::create(['name' => 'Local 1']);
        $user = User::factory()->create(['negocio_id' => $negocio->id]);

        $this->actingAs($user);

        $producto = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => 'DEL-01',
            'name' => 'Lija fina',
            'price' => 300,
            'stock' => 20,
        ]);

        // Generar un movimiento de auditoría (Kardex)
        $movimiento = MovimientoStock::create([
            'product_id' => $producto->id,
            'user_id' => $user->id,
            'cantidad_anterior' => 0,
            'cantidad_nueva' => 20,
            'diferencia' => 20,
            'motivo' => 'Inventario Inicial',
        ]);

        // Eliminar producto
        $response = $this->delete("/inventory/{$producto->id}");
        $response->assertRedirect('/inventory');

        // El producto se elimina mediante SoftDeletes (deleted_at no es null)
        $this->assertSoftDeleted('products', [
            'id' => $producto->id,
        ]);

        // El registro de auditoría en kardex NO se borró
        $this->assertDatabaseHas('movimiento_stocks', [
            'id' => $movimiento->id,
            'product_id' => $producto->id,
            'motivo' => 'Inventario Inicial',
        ]);
    }
}
