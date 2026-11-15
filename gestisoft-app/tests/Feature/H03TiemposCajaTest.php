<?php

namespace Tests\Feature;

use App\Models\Negocio;
use App\Models\Product;
use App\Models\TurnoCaja;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('h03')]
class H03TiemposCajaTest extends TestCase
{
    use RefreshDatabase;

    private const UMBRAL_SEGUNDOS = 60;
    private const ENSAYOS = 5;

    private function prepararCajero(): array
    {
        $negocio = Negocio::create(['name' => 'Negocio H03']);
        $cajero = User::factory()->create(['negocio_id' => $negocio->id, 'role' => 'cajero']);
        $this->actingAs($cajero);
        $producto = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => 'H03-01',
            'name' => 'Producto H03',
            'price' => 1000,
            'stock' => 1000,
        ]);
        return [$negocio, $cajero, $producto];
    }

    public function test_apertura_de_turno_bajo_umbral_en_cinco_ensayos(): void
    {
        [, $cajero] = $this->prepararCajero();
        $tiempos = [];
        for ($i = 1; $i <= self::ENSAYOS; $i++) {
            $t0 = hrtime(true);
            $this->post('/caja/abrir', ['monto_inicial' => 50000])->assertSessionHasNoErrors();
            $tiempos[] = (hrtime(true) - $t0) / 1e9;
            // cerrar para el siguiente ensayo
            $this->post('/caja/cerrar', ['monto_declarado' => 50000]);
        }
        $this->registrar('apertura', $tiempos);
        foreach ($tiempos as $t) {
            $this->assertLessThan(self::UMBRAL_SEGUNDOS, $t);
        }
    }

    public function test_cierre_con_arqueo_ciego_bajo_umbral_en_cinco_ensayos(): void
    {
        [, $cajero, $producto] = $this->prepararCajero();
        $tiempos = [];
        for ($i = 1; $i <= self::ENSAYOS; $i++) {
            $this->post('/caja/abrir', ['monto_inicial' => 50000]);
            for ($v = 0; $v < 3; $v++) {
                $this->post('/pos/checkout', [
                    'items' => [['product_id' => $producto->id, 'quantity' => 1]],
                    'payment_method' => 'Efectivo',
                    'amount_received' => 1000,
                ]);
            }
            $t0 = hrtime(true);
            $this->post('/caja/cerrar', ['monto_declarado' => 53000])->assertSessionHasNoErrors();
            $tiempos[] = (hrtime(true) - $t0) / 1e9;
            $this->assertEquals('cerrado', TurnoCaja::latest('id')->first()->estado);
        }
        $this->registrar('cierre', $tiempos);
        foreach ($tiempos as $t) {
            $this->assertLessThan(self::UMBRAL_SEGUNDOS, $t);
        }
    }

    private function registrar(string $operacion, array $tiempos): void
    {
        if (! env('H03_REGISTRAR')) {
            return;
        }
        $dir = base_path('../producto/semana-14/mediciones');
        @mkdir($dir, 0777, true);
        $lineas = [];
        foreach ($tiempos as $i => $t) {
            $lineas[] = sprintf('%s,%d,%.4f', $operacion, $i + 1, $t);
        }
        file_put_contents(
            "$dir/h03-tiempos-sistema.csv",
            (file_exists("$dir/h03-tiempos-sistema.csv") ? '' : "operacion,ensayo,segundos\n") . implode("\n", $lineas) . "\n",
            FILE_APPEND
        );
    }
}
