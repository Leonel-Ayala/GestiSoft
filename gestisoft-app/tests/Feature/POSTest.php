<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Negocio;
use App\Models\Product;
use App\Models\TurnoCaja;
use App\Models\Venta;
use App\Models\VentaDetalle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

class POSTest extends TestCase
{
    use RefreshDatabase;

    #[Group('regresion')]
    public function test_no_se_puede_vender_producto_sin_stock()
    {
        $negocio = Negocio::create(['name' => 'Local POS']);
        $user = User::factory()->create(['negocio_id' => $negocio->id]);

        $this->actingAs($user);

        // Turno activo requerido para registrar ventas
        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $user->id,
            'monto_inicial' => 50000,
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

    #[Group('regresion')]
    public function test_venta_ignora_precio_enviado_por_cliente()
    {
        $negocio = Negocio::create(['name' => 'Local POS']);
        $user = User::factory()->create(['negocio_id' => $negocio->id]);

        $this->actingAs($user);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $user->id,
            'monto_inicial' => 50000,
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

    #[Group('regresion')]
    public function test_efectivo_insuficiente_es_rechazado()
    {
        $negocio = Negocio::create(['name' => 'Local POS']);
        $user = User::factory()->create(['negocio_id' => $negocio->id]);

        $this->actingAs($user);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $user->id,
            'monto_inicial' => 50000,
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

    #[Group('regresion')]
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
            'monto_inicial' => 50000,
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

    public function test_venta_registra_movimiento_en_kardex()
    {
        $negocio = Negocio::create(['name' => 'Local Kardex POS']);
        $user = User::factory()->create(['negocio_id' => $negocio->id, 'role' => 'cajero']);

        $this->actingAs($user);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $user->id,
            'monto_inicial' => 50000,
            'estado' => 'abierto',
            'fecha_apertura' => now(),
        ]);

        $producto = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => 'KARDEX-01',
            'name' => 'Teclado Gamer',
            'price' => 10000,
            'stock' => 5,
        ]);

        $response = $this->post('/pos/checkout', [
            'items' => [
                ['product_id' => $producto->id, 'quantity' => 2]
            ],
            'payment_method' => 'Efectivo',
            'amount_received' => 20000,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertEquals(3, $producto->fresh()->stock);

        $venta = Venta::latest('id')->first();
        $this->assertNotNull($venta);

        $this->assertDatabaseHas('movimiento_stocks', [
            'product_id' => $producto->id,
            'user_id' => $user->id,
            'cantidad_anterior' => 5,
            'cantidad_nueva' => 3,
            'diferencia' => -2,
            'motivo' => "Venta #{$venta->id}",
        ]);
    }

    #[Group('regresion')]
    public function test_stock_coincide_con_suma_de_kardex_tras_alta_ajuste_y_venta()
    {
        $negocio = Negocio::create(['name' => 'Comercio Invariante']);
        $admin = User::factory()->create(['negocio_id' => $negocio->id, 'role' => 'admin']);

        $this->actingAs($admin);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $admin->id,
            'monto_inicial' => 50000,
            'estado' => 'abierto',
            'fecha_apertura' => now(),
        ]);

        // 1. Alta inicial mediante POST /inventory
        $responseCreate = $this->post('/inventory', [
            'sku' => 'INV-001',
            'name' => 'Mouse Inalámbrico',
            'price' => 1000,
            'stock' => 10,
        ]);
        $responseCreate->assertRedirect('/inventory');

        $producto = Product::where('sku', 'INV-001')->first();
        $this->assertNotNull($producto);
        $this->assertEquals(10, $producto->stock);

        // 2. Ajuste manual mediante PUT /inventory/{id}
        $responseUpdate = $this->put("/inventory/{$producto->id}", [
            'sku' => 'INV-001',
            'name' => 'Mouse Inalámbrico',
            'price' => 1000,
            'stock' => 8,
            'motivo' => 'Merma por embalaje defectuoso',
        ]);
        $responseUpdate->assertRedirect('/inventory');
        $this->assertEquals(8, $producto->fresh()->stock);

        // 3. Venta de 3 unidades en el POS
        $responseCheckout = $this->post('/pos/checkout', [
            'items' => [
                ['product_id' => $producto->id, 'quantity' => 3]
            ],
            'payment_method' => 'Efectivo',
            'amount_received' => 3000,
        ]);
        $responseCheckout->assertSessionHasNoErrors();

        // Invariante: El stock en tabla coincide exactamente con la suma de diferencias del Kardex
        $this->assertEquals(5, $producto->fresh()->stock);
        $sumaKardex = (int) \App\Models\MovimientoStock::where('product_id', $producto->id)->sum('diferencia');
        $this->assertEquals(5, $sumaKardex);
    }

    public function test_si_falla_la_venta_no_queda_movimiento_de_kardex()
    {
        $negocio = Negocio::create(['name' => 'Local Rollback']);
        $user = User::factory()->create(['negocio_id' => $negocio->id, 'role' => 'cajero']);

        $this->actingAs($user);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $user->id,
            'monto_inicial' => 50000,
            'estado' => 'abierto',
            'fecha_apertura' => now(),
        ]);

        $producto = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => 'RB-01',
            'name' => 'Audífonos',
            'price' => 5000,
            'stock' => 1,
        ]);

        $response = $this->post('/pos/checkout', [
            'items' => [
                ['product_id' => $producto->id, 'quantity' => 2]
            ],
            'payment_method' => 'Efectivo',
            'amount_received' => 10000,
        ]);

        $response->assertSessionHasErrors(['checkout']);
        $this->assertDatabaseCount('ventas', 0);
        $this->assertEquals(1, $producto->fresh()->stock);
        $this->assertDatabaseMissing('movimiento_stocks', ['product_id' => $producto->id]);
    }

    public function test_items_duplicados_no_permiten_sobreventa()
    {
        $negocio = Negocio::create(['name' => 'Local Duplicados']);
        $user = User::factory()->create(['negocio_id' => $negocio->id, 'role' => 'cajero']);

        $this->actingAs($user);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $user->id,
            'monto_inicial' => 50000,
            'estado' => 'abierto',
            'fecha_apertura' => now(),
        ]);

        $producto = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => 'DUP-01',
            'name' => 'Pendrive 32GB',
            'price' => 5000,
            'stock' => 1,
        ]);

        $response = $this->post('/pos/checkout', [
            'items' => [
                ['product_id' => $producto->id, 'quantity' => 1],
                ['product_id' => $producto->id, 'quantity' => 1],
            ],
            'payment_method' => 'Efectivo',
            'amount_received' => 10000,
        ]);

        $response->assertSessionHasErrors(['items.0.product_id']);
        $this->assertEquals(1, $producto->fresh()->stock);
        $this->assertDatabaseCount('ventas', 0);
        $this->assertDatabaseMissing('movimiento_stocks', ['product_id' => $producto->id]);
    }

    public function test_medio_de_pago_invalido_es_rechazado()
    {
        $negocio = Negocio::create(['name' => 'Local Metodo']);
        $user = User::factory()->create(['negocio_id' => $negocio->id, 'role' => 'cajero']);

        $this->actingAs($user);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $user->id,
            'monto_inicial' => 50000,
            'estado' => 'abierto',
            'fecha_apertura' => now(),
        ]);

        $producto = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => 'PAY-01',
            'name' => 'Funda Celular',
            'price' => 5000,
            'stock' => 5,
        ]);

        $response = $this->post('/pos/checkout', [
            'items' => [
                ['product_id' => $producto->id, 'quantity' => 1]
            ],
            'payment_method' => 'Cheque',
        ]);

        $response->assertSessionHasErrors('payment_method');
        $this->assertEquals(5, $producto->fresh()->stock);
        $this->assertDatabaseCount('ventas', 0);
    }

    public function test_medio_de_pago_en_minusculas_es_rechazado()
    {
        $negocio = Negocio::create(['name' => 'Local Canónico']);
        $user = User::factory()->create(['negocio_id' => $negocio->id, 'role' => 'cajero']);

        $this->actingAs($user);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $user->id,
            'monto_inicial' => 50000,
            'estado' => 'abierto',
            'fecha_apertura' => now(),
        ]);

        $producto = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => 'PAY-02',
            'name' => 'Cargador Rápido',
            'price' => 12000,
            'stock' => 10,
        ]);

        $response = $this->post('/pos/checkout', [
            'items' => [
                ['product_id' => $producto->id, 'quantity' => 1]
            ],
            'payment_method' => 'efectivo',
        ]);

        $response->assertSessionHasErrors('payment_method');
        $this->assertEquals(10, $producto->fresh()->stock);
        $this->assertDatabaseCount('ventas', 0);
    }
}
