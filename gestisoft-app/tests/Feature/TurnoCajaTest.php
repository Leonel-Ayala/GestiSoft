<?php

namespace Tests\Feature;

use App\Models\Negocio;
use App\Models\TurnoCaja;
use App\Models\User;
use App\Models\Venta;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TurnoCajaTest extends TestCase
{
    use RefreshDatabase;

    public function test_se_puede_abrir_un_turno_de_caja_con_monto_inicial()
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
            'fecha_apertura' => now(),
            'monto_inicial' => 50000,
            'total_esperado' => 50000,
            'estado' => 'abierto',
        ]);

        $this->assertDatabaseHas('turnos_caja', [
            'id' => $turno->id,
            'estado' => 'abierto',
            'monto_inicial' => 50000,
        ]);

        // Verificar el Local Scope abierto()
        $turnoActivo = TurnoCaja::abierto()->first();
        $this->assertNotNull($turnoActivo);
        $this->assertEquals($turno->id, $turnoActivo->id);
    }

    public function test_se_vincula_una_venta_al_turno_y_sincroniza_totales_por_metodo_de_pago()
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
            'fecha_apertura' => now(),
            'monto_inicial' => 20000,
            'total_esperado' => 20000,
            'estado' => 'abierto',
        ]);

        // Venta en efectivo
        $ventaEfectivo = Venta::create([
            'negocio_id' => $negocio->id,
            'user_id' => $cajero->id,
            'turno_caja_id' => $turno->id,
            'total' => 15000,
            'neto' => 12605,
            'iva' => 2395,
            'payment_method' => 'Efectivo',
        ]);

        // Venta con tarjeta
        $ventaTarjeta = Venta::create([
            'negocio_id' => $negocio->id,
            'user_id' => $cajero->id,
            'turno_caja_id' => $turno->id,
            'total' => 10000,
            'neto' => 8403,
            'iva' => 1597,
            'payment_method' => 'Tarjeta',
        ]);

        // Sincronizar totales del turno
        $turno->sincronizarTotales();
        $turno->refresh();

        // En caja física solo entra el efectivo: $20.000 inicial + $15.000 efectivo = $35.000
        $this->assertEquals(15000, $turno->monto_ventas_efectivo);
        $this->assertEquals(10000, $turno->monto_ventas_tarjeta);
        $this->assertEquals(35000, $turno->total_esperado);

        // Relaciones bidireccionales
        $this->assertEquals(2, $turno->ventas()->count());
        $this->assertEquals($turno->id, $ventaEfectivo->turnoCaja->id);
        $this->assertEquals($turno->id, $ventaTarjeta->turnoCaja->id);
    }

    public function test_cierre_de_caja_calcula_diferencia_correctamente_sin_descuadre()
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
            'fecha_apertura' => now(),
            'monto_inicial' => 10000,
            'total_esperado' => 10000,
            'estado' => 'abierto',
        ]);

        // Cajero declara en arqueo ciego exactamente lo esperado
        $montoDeclarado = 10000;
        $diferencia = $montoDeclarado - $turno->total_esperado;

        $turno->update([
            'monto_declarado' => $montoDeclarado,
            'diferencia' => $diferencia,
            'fecha_cierre' => now(),
            'estado' => 'cerrado',
        ]);

        $this->assertEquals('cerrado', $turno->estado);
        $this->assertEquals(0, $turno->diferencia);
        $this->assertNull(TurnoCaja::abierto()->first());
    }

    public function test_cierre_de_caja_detecta_descuadre_faltante()
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
            'fecha_apertura' => now(),
            'monto_inicial' => 50000,
            'total_esperado' => 50000,
            'estado' => 'abierto',
        ]);

        // El cajero declara 47.000 (faltante de 3.000)
        $montoDeclarado = 47000;
        $diferencia = $montoDeclarado - $turno->total_esperado;

        $turno->update([
            'monto_declarado' => $montoDeclarado,
            'diferencia' => $diferencia,
            'fecha_cierre' => now(),
            'estado' => 'cerrado',
        ]);

        $this->assertEquals(-3000, $turno->diferencia);
    }
}
