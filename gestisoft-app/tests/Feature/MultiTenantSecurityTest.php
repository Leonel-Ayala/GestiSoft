<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Negocio;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MultiTenantSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_usuario_no_puede_ver_los_productos_de_otro_negocio()
    {
        $negocio1 = Negocio::create(['name' => 'Ferretería']);
        $user1 = User::factory()->create(['negocio_id' => $negocio1->id]);
        
        $this->actingAs($user1);
        
        $producto1 = Product::create([
            'negocio_id' => $negocio1->id,
            'sku' => '123',
            'name' => 'Martillo',
            'price' => 100,
            'stock' => 10,
        ]);

        $negocio2 = Negocio::create(['name' => 'Minimarket']);
        $user2 = User::factory()->create(['negocio_id' => $negocio2->id]);
        
        $this->actingAs($user2);

        $producto2 = Product::create([
            'negocio_id' => $negocio2->id,
            'sku' => '456',
            'name' => 'Leche',
            'price' => 1500,
            'stock' => 20,
        ]);

        $this->actingAs($user1);
        $response = $this->get('/inventory');
        $response->assertSee('Martillo');
        $response->assertDontSee('Leche');

        $this->actingAs($user2);
        $response = $this->get('/inventory');
        $response->assertSee('Leche');
        $response->assertDontSee('Martillo');
    }
}
