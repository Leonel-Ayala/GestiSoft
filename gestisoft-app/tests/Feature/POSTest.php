<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Negocio;
use App\Models\Product;
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

        $producto = Product::create([
            'negocio_id' => $negocio->id,
            'sku' => '000',
            'name' => 'Cable',
            'price' => 10,
            'stock' => 0,
        ]);

        $response = $this->post('/pos/checkout', [
            'cart' => [
                ['id' => $producto->id, 'quantity' => 1]
            ]
        ]);

        $response->assertSessionHasErrors();
        $this->assertDatabaseHas('products', ['stock' => 0]);
        $this->assertDatabaseCount('ventas', 0);
    }
}
