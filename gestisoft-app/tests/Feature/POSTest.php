<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Negocio;
use App\Models\Product;
use App\Models\TurnoCaja;
use App\Models\Venta;
use App\Models\VentaDetalle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class POSTest extends TestCase
{
    use RefreshDatabase;

    public function test_no_se_puede_vender_producto_sin_stock()
    {
        $negocio = Negocio::create(['name' => 'Local POS']);
        $user = User::factory()->create(['negocio_id' => $negocio->id]);

        $this->actingAs($user);

        // Turno activo requerido para registrar ventas
        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $user->id,
            'monto_apertura' => 50000,
            'estado' => 'abierto',
            'fecha_apertura' => now(),
        ]);

        $producto = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => '000',
            'name' => 'Cable HDMI',
            'price' => 10000,
            'stock' => 0,
        ]);

        $response = $this->post('/pos/checkout', [
            'items' => [
                ['product_id' => $producto->id, 'quantity' => 1]
            ],
            'payment_method' => 'Efectivo',
            'amount_received' => 15000,
        ]);

        $response->assertSessionHasErrors(['checkout']);
        $errors = session('errors')->get('checkout');
        $this->assertStringContainsString('Stock insuficiente', $errors[0]);

        $this->assertDatabaseHas('products', ['id' => $producto->id, 'stock' => 0]);
        $this->assertDatabaseCount('ventas', 0);
    }

    public function test_venta_ignora_precio_enviado_por_cliente()
    {
        $negocio = Negocio::create(['name' => 'Local POS']);
        $user = User::factory()->create(['negocio_id' => $negocio->id]);

        $this->actingAs($user);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $user->id,
            'monto_apertura' => 50000,
            'estado' => 'abierto',
            'fecha_apertura' => now(),
        ]);

        $producto = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => 'PROD-REAL',
            'name' => 'Teclado Gamer',
            'price' => 20000,
            'stock' => 5,
        ]);

        // Intento de manipulación de precio: cliente envía precio 100 y total 200
        $response = $this->post('/pos/checkout', [
            'items' => [
                ['product_id' => $producto->id, 'quantity' => 2, 'price' => 100]
            ],
            'payment_method' => 'Débito',
            'total' => 200,
            'neto' => 168,
            'iva' => 32,
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        // El servidor debió recalcular: 20.000 * 2 = 40.000 total
        $this->assertDatabaseHas('ventas', [
            'negocio_id' => $negocio->id,
            'turno_caja_id' => $turno->id,
            'total' => 40000,
            'neto' => 33613, // round(40000 / 1.19)
            'iva' => 6387,
            'payment_method' => 'Débito',
        ]);

        $this->assertDatabaseHas('venta_detalles', [
            'product_id' => $producto->id,
            'quantity' => 2,
            'price' => 20000,
            'subtotal' => 40000,
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $producto->id,
            'stock' => 3,
        ]);
    }

    public function test_efectivo_insuficiente_es_rechazado()
    {
        $negocio = Negocio::create(['name' => 'Local POS']);
        $user = User::factory()->create(['negocio_id' => $negocio->id]);

        $this->actingAs($user);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $user->id,
            'monto_apertura' => 50000,
            'estado' => 'abierto',
            'fecha_apertura' => now(),
        ]);

        $producto = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => 'PROD-5K',
            'name' => 'Mouse USB',
            'price' => 5000,
            'stock' => 10,
        ]);

        // Cliente envía 3.000 para pagar un producto de 5.000
        $response = $this->post('/pos/checkout', [
            'items' => [
                ['product_id' => $producto->id, 'quantity' => 1]
            ],
            'payment_method' => 'Efectivo',
            'amount_received' => 3000,
        ]);

        $response->assertSessionHasErrors(['checkout']);
        $errors = session('errors')->get('checkout');
        $this->assertStringContainsString('insuficiente', $errors[0]);

        $this->assertDatabaseCount('ventas', 0);
        $this->assertDatabaseHas('products', ['id' => $producto->id, 'stock' => 10]);
    }

    public function test_no_se_puede_vender_producto_de_otro_negocio()
    {
        $negocioA = Negocio::create(['name' => 'Local A']);
        $negocioB = Negocio::create(['name' => 'Local B']);

        $userA = User::factory()->create(['negocio_id' => $negocioA->id]);
        $userB = User::factory()->create(['negocio_id' => $negocioB->id]);

        $this->actingAs($userB);
        $productoB = Product::create([
            'sku' => 'PROD-B',
            'name' => 'Producto Local B',
            'price' => 15000,
            'stock' => 20,
        ]);

        $this->actingAs($userA);

        $turnoA = TurnoCaja::create([
            'negocio_id' => $negocioA->id,
            'user_id' => $userA->id,
            'monto_apertura' => 50000,
            'estado' => 'abierto',
            'fecha_apertura' => now(),
        ]);

        $response = $this->post('/pos/checkout', [
            'items' => [
                ['product_id' => $productoB->id, 'quantity' => 1]
            ],
            'payment_method' => 'Transferencia',
        ]);

        $response->assertSessionHasErrors(['checkout']);
        $this->assertDatabaseCount('ventas', 0);

        // Verificamos que el stock en el negocio B siga intacto
        $this->actingAs($userB);
        $this->assertDatabaseHas('products', [
            'id' => $productoB->id,
            'stock' => 20,
        ]);
    }
}
