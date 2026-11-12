<?php

namespace Tests\Feature;

use App\Models\Negocio;
use App\Models\Product;
use App\Models\TurnoCaja;
use App\Models\User;
use App\Models\Venta;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CajaTurnoSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_cajero_puede_abrir_turno_con_monto_inicial_valido()
    {
        $negocio = Negocio::create(['name' => 'Ferretería Central']);
        $cajero = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'cajero',
        ]);

        $this->actingAs($cajero);

        $response = $this->post('/caja/abrir', [
            'monto_inicial' => 50000,
        ]);

        $response->assertRedirect(route('pos.index'));
        $this->assertDatabaseHas('turnos_caja', [
            'negocio_id' => $negocio->id,
            'user_id' => $cajero->id,
            'monto_inicial' => 50000,
            'total_esperado' => 50000,
            'estado' => 'abierto',
        ]);
    }

    public function test_no_se_puede_abrir_dos_turnos_simultaneos_para_el_mismo_usuario()
    {
        $negocio = Negocio::create(['name' => 'Ferretería Central']);
        $cajero = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'cajero',
        ]);

        $this->actingAs($cajero);

        // Primera apertura
        $this->post('/caja/abrir', ['monto_inicial' => 30000]);
        $this->assertDatabaseCount('turnos_caja', 1);

        // Intento de segunda apertura concurrente
        $response = $this->post('/caja/abrir', ['monto_inicial' => 20000]);
        $response->assertSessionHasErrors('caja');
        $this->assertDatabaseCount('turnos_caja', 1);
    }

    public function test_no_se_puede_abrir_turno_con_monto_negativo()
    {
        $negocio = Negocio::create(['name' => 'Ferretería Central']);
        $cajero = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'cajero',
        ]);

        $this->actingAs($cajero);

        $response = $this->post('/caja/abrir', [
            'monto_inicial' => -500,
        ]);

        $response->assertSessionHasErrors('monto_inicial');
        $this->assertDatabaseCount('turnos_caja', 0);
    }

    public function test_checkout_del_pos_bloqueado_si_no_hay_turno_abierto()
    {
        $negocio = Negocio::create(['name' => 'Ferretería Central']);
        $cajero = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'cajero',
        ]);

        $this->actingAs($cajero);

        $producto = Product::create([
            'sku' => 'TAL-001',
            'name' => 'Taladro Percutor',
            'price' => 45000,
            'stock' => 5,
        ]);

        // Intento de venta con caja cerrada
        $response = $this->post('/pos/checkout', [
            'items' => [
                [
                    'product_id' => $producto->id,
                    'name' => $producto->name,
                    'quantity' => 1,
                    'price' => 45000,
                ]
            ],
            'total' => 45000,
            'neto' => 37815,
            'iva' => 7185,
            'payment_method' => 'Efectivo',
            'amount_received' => 50000,
            'change' => 5000,
        ]);

        $response->assertSessionHasErrors('checkout');
        $this->assertDatabaseCount('ventas', 0);
        $this->assertEquals(5, $producto->fresh()->stock); // Stock intacto
    }

    public function test_checkout_del_pos_enlaza_turno_activo_y_sincroniza_totales()
    {
        $negocio = Negocio::create(['name' => 'Ferretería Central']);
        $cajero = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'cajero',
        ]);

        $this->actingAs($cajero);

        $producto = Product::create([
            'sku' => 'DISC-01',
            'name' => 'Disco de Corte',
            'price' => 2500,
            'stock' => 10,
        ]);

        // 1. Abrir caja con $20.000
        $this->post('/caja/abrir', ['monto_inicial' => 20000]);
        $turno = TurnoCaja::abierto()->first();

        // 2. Realizar venta en efectivo de 2 discos ($5.000)
        $response = $this->post('/pos/checkout', [
            'items' => [
                [
                    'product_id' => $producto->id,
                    'name' => $producto->name,
                    'quantity' => 2,
                    'price' => 2500,
                ]
            ],
            'total' => 5000,
            'neto' => 4202,
            'iva' => 798,
            'payment_method' => 'Efectivo',
            'amount_received' => 10000,
            'change' => 5000,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseCount('ventas', 1);

        $venta = Venta::first();
        $this->assertEquals($turno->id, $venta->turno_caja_id);
        $this->assertEquals(8, $producto->fresh()->stock); // Stock descontado

        // Totales sincronizados en el turno
        $turno->refresh();
        $this->assertEquals(5000, $turno->monto_ventas_efectivo);
        $this->assertEquals(25000, $turno->total_esperado); // $20.000 inicial + $5.000 venta
    }

    public function test_cierre_de_caja_calcula_descuadre_exacto_en_arqueo_ciego()
    {
        $negocio = Negocio::create(['name' => 'Ferretería Central']);
        $cajero = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'cajero',
        ]);

        $this->actingAs($cajero);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $cajero->id,
            'monto_inicial' => 10000,
            'total_esperado' => 10000,
            'estado' => 'abierto',
            'fecha_apertura' => now(),
        ]);

        // Arqueo exacto
        $response = $this->post('/caja/cerrar', [
            'monto_declarado' => 10000,
            'observaciones' => 'Turno cuadrado sin incidentes',
        ]);

        $response->assertRedirect(route('pos.index'));
        $turno->refresh();

        $this->assertEquals('cerrado', $turno->estado);
        $this->assertEquals(10000, $turno->monto_declarado);
        $this->assertEquals(0, $turno->diferencia);
        $this->assertNotNull($turno->fecha_cierre);
    }

    public function test_cierre_de_caja_detecta_faltante_de_dinero()
    {
        $negocio = Negocio::create(['name' => 'Ferretería Central']);
        $cajero = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'cajero',
        ]);

        $this->actingAs($cajero);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $cajero->id,
            'monto_inicial' => 50000,
            'total_esperado' => 50000,
            'estado' => 'abierto',
            'fecha_apertura' => now(),
        ]);

        // Cajero declara $47.000 (faltan $3.000)
        $response = $this->post('/caja/cerrar', [
            'monto_declarado' => 47000,
            'observaciones' => 'Faltante por error de vuelto',
        ]);

        $response->assertRedirect(route('pos.index'));
        $turno->refresh();

        $this->assertEquals('cerrado', $turno->estado);
        $this->assertEquals(-3000, $turno->diferencia);
        $this->assertEquals('Faltante por error de vuelto', $turno->observaciones);
    }

    public function test_no_se_puede_cerrar_caja_si_no_hay_turno_abierto()
    {
        $negocio = Negocio::create(['name' => 'Ferretería Central']);
        $cajero = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'cajero',
        ]);

        $this->actingAs($cajero);

        $response = $this->post('/caja/cerrar', [
            'monto_declarado' => 50000,
        ]);

        $response->assertSessionHasErrors('caja');
    }

    public function test_aislamiento_multitenant_un_usuario_no_puede_ver_ni_cerrar_turno_de_otro_negocio()
    {
        $negocioA = Negocio::create(['name' => 'Comercio A']);
        $cajeroA = User::factory()->create(['negocio_id' => $negocioA->id]);

        $negocioB = Negocio::create(['name' => 'Comercio B']);
        $cajeroB = User::factory()->create(['negocio_id' => $negocioB->id]);

        // Cajero A abre caja
        $this->actingAs($cajeroA);
        $this->post('/caja/abrir', ['monto_inicial' => 40000]);

        // Cajero B consulta estado
        $this->actingAs($cajeroB);
        $responseEstado = $this->getJson('/caja/estado');
        $responseEstado->assertJson(['abierto' => false, 'turno' => null]);

        // Cajero B intenta cerrar caja (no debe poder)
        $responseCierre = $this->post('/caja/cerrar', ['monto_declarado' => 40000]);
        $responseCierre->assertSessionHasErrors('caja');
    }

    public function test_resumen_de_turno_accesible_para_auditoria()
    {
        $negocio = Negocio::create(['name' => 'Ferretería Central']);
        $admin = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $admin->id,
            'monto_inicial' => 15000,
            'monto_ventas_efectivo' => 25000,
            'monto_ventas_tarjeta' => 10000,
            'monto_ventas_transferencia' => 5000,
            'total_esperado' => 40000,
            'monto_declarado' => 40000,
            'diferencia' => 0,
            'estado' => 'cerrado',
            'fecha_apertura' => now()->subHours(8),
            'fecha_cierre' => now(),
        ]);

        $response = $this->getJson("/caja/resumen/{$turno->id}");
        $response->assertStatus(200);
        $response->assertJson([
            'id' => $turno->id,
            'monto_inicial' => 15000,
            'total_esperado' => 40000,
            'diferencia' => 0,
            'estado' => 'cerrado',
        ]);
    }

    public function test_administrador_puede_acceder_al_modulo_de_cajas_y_cajero_es_bloqueado()
    {
        $negocio = Negocio::create(['name' => 'Ferretería Central']);
        $admin = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'admin',
        ]);
        $cajero = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'cajero',
        ]);

        // Admin accede exitosamente
        $this->actingAs($admin);
        $resAdmin = $this->get('/cajas');
        $resAdmin->assertStatus(200);

        // Cajero es bloqueado por middleware de rol
        $this->actingAs($cajero);
        $resCajero = $this->get('/cajas');
        $resCajero->assertStatus(403);
    }

    public function test_administrador_puede_consultar_transacciones_de_un_turno()
    {
        $negocio = Negocio::create(['name' => 'Ferretería Central']);
        $admin = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $admin->id,
            'monto_inicial' => 20000,
            'total_esperado' => 20000,
            'estado' => 'abierto',
            'fecha_apertura' => now(),
        ]);

        $prod = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => 'TAL-001',
            'name' => 'Taladro Percutor',
            'price' => 45000,
            'stock' => 10,
        ]);

        $venta = Venta::create([
            'negocio_id' => $negocio->id,
            'user_id' => $admin->id,
            'turno_caja_id' => $turno->id,
            'total' => 45000,
            'neto' => 37815,
            'iva' => 7185,
            'payment_method' => 'cash',
            'amount_received' => 50000,
            'change' => 5000,
        ]);

        $venta->detalles()->create([
            'product_id' => $prod->id,
            'product_name' => $prod->name,
            'quantity' => 1,
            'price' => 45000,
            'subtotal' => 45000,
        ]);

        $response = $this->getJson("/cajas/{$turno->id}/transacciones");
        $response->assertStatus(200);
        $response->assertJsonPath('turno.id', $turno->id);
        $response->assertJsonCount(1, 'ventas');
        $response->assertJsonPath('ventas.0.detalles.0.product_name', 'Taladro Percutor');
        $response->assertJsonPath('ventas.0.payment_method_normalized', 'Efectivo');
    }

    public function test_sincronizacion_de_totales_separa_debito_credito_efectivo_y_transferencia()
    {
        $negocio = Negocio::create(['name' => 'Ferretería Central']);
        $cajero = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'cajero',
        ]);

        $this->actingAs($cajero);

        $turno = TurnoCaja::create([
            'negocio_id' => $negocio->id,
            'user_id' => $cajero->id,
            'monto_inicial' => 30000,
            'total_esperado' => 30000,
            'estado' => 'abierto',
            'fecha_apertura' => now(),
        ]);

        // Venta 1: Efectivo
        Venta::create([
            'negocio_id' => $negocio->id,
            'user_id' => $cajero->id,
            'turno_caja_id' => $turno->id,
            'total' => 15000,
            'neto' => 12605,
            'iva' => 2395,
            'payment_method' => 'Efectivo',
        ]);

        // Venta 2: Débito
        Venta::create([
            'negocio_id' => $negocio->id,
            'user_id' => $cajero->id,
            'turno_caja_id' => $turno->id,
            'total' => 25000,
            'neto' => 21008,
            'iva' => 3992,
            'payment_method' => 'Débito',
        ]);

        // Venta 3: Crédito
        Venta::create([
            'negocio_id' => $negocio->id,
            'user_id' => $cajero->id,
            'turno_caja_id' => $turno->id,
            'total' => 35000,
            'neto' => 29412,
            'iva' => 5588,
            'payment_method' => 'Crédito',
        ]);

        // Venta 4: Transferencia
        Venta::create([
            'negocio_id' => $negocio->id,
            'user_id' => $cajero->id,
            'turno_caja_id' => $turno->id,
            'total' => 10000,
            'neto' => 8403,
            'iva' => 1597,
            'payment_method' => 'Transferencia',
        ]);

        $turno->sincronizarTotales();
        $turno->refresh();

        $this->assertEquals(15000, $turno->monto_ventas_efectivo);
        $this->assertEquals(25000, $turno->monto_ventas_debito);
        $this->assertEquals(35000, $turno->monto_ventas_credito);
        $this->assertEquals(60000, $turno->monto_ventas_tarjeta); // Suma débito + crédito
        $this->assertEquals(10000, $turno->monto_ventas_transferencia);
        $this->assertEquals(45000, $turno->total_esperado); // Fondo Inicial (30.000) + Efectivo (15.000)
    }
}
