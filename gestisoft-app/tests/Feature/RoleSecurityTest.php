<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Negocio;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_puede_ver_lista_de_usuarios_de_su_negocio()
    {
        $negocio = Negocio::create(['name' => 'Comercial Centro']);
        $admin = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'admin',
        ]);

        $cajero = User::factory()->cajero()->create([
            'negocio_id' => $negocio->id,
            'name' => 'Juan Cajero',
        ]);

        $this->actingAs($admin);

        $response = $this->get('/users');
        $response->assertStatus(200);
        $response->assertSee('Juan Cajero');
    }

    public function test_admin_puede_crear_un_nuevo_cajero_para_su_negocio()
    {
        $negocio = Negocio::create(['name' => 'Comercial Centro']);
        $admin = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $response = $this->post('/users', [
            'name' => 'Pedro Cajero',
            'email' => 'pedro@gestisoft.cl',
            'password' => 'password123',
            'role' => 'cajero',
        ]);

        $response->assertRedirect('/users');

        $this->assertDatabaseHas('users', [
            'name' => 'Pedro Cajero',
            'email' => 'pedro@gestisoft.cl',
            'role' => 'cajero',
            'negocio_id' => $negocio->id,
        ]);
    }

    public function test_cajero_no_puede_acceder_a_gestion_de_usuarios_retorna_403()
    {
        $negocio = Negocio::create(['name' => 'Comercial Centro']);
        $cajero = User::factory()->cajero()->create([
            'negocio_id' => $negocio->id,
        ]);

        $this->actingAs($cajero);

        $response = $this->get('/users');
        $response->assertStatus(403);
    }

    public function test_cajero_no_puede_acceder_a_inventario_retorna_403()
    {
        $negocio = Negocio::create(['name' => 'Comercial Centro']);
        $cajero = User::factory()->cajero()->create([
            'negocio_id' => $negocio->id,
        ]);

        $this->actingAs($cajero);

        $response = $this->get('/inventory');
        $response->assertStatus(403);
    }

    public function test_admin_no_puede_eliminarse_a_si_mismo()
    {
        $negocio = Negocio::create(['name' => 'Comercial Centro']);
        $admin = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $response = $this->delete("/users/{$admin->id}");
        $response->assertSessionHasErrors(['error' => 'No puedes eliminarte a ti mismo.']);
        $this->assertDatabaseHas('users', [
            'id' => $admin->id,
            'deleted_at' => null,
        ]);
    }

    public function test_al_eliminar_usuario_se_aplica_soft_deletes_y_se_mantiene_en_base_de_datos()
    {
        $negocio = Negocio::create(['name' => 'Comercial Centro']);
        $admin = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'admin',
        ]);

        $cajero = User::factory()->cajero()->create([
            'negocio_id' => $negocio->id,
            'name' => 'Cajero Saliente',
        ]);

        $this->actingAs($admin);

        $response = $this->delete("/users/{$cajero->id}");
        $response->assertRedirect('/users');

        // Sigue existiendo en la tabla físicamente
        $this->assertDatabaseHas('users', [
            'id' => $cajero->id,
            'name' => 'Cajero Saliente',
        ]);

        // Pero deleted_at no es nulo
        $this->assertSoftDeleted('users', [
            'id' => $cajero->id,
        ]);
    }

    public function test_admin_no_puede_eliminar_usuario_de_otro_negocio()
    {
        $negocio1 = Negocio::create(['name' => 'Negocio 1']);
        $admin1 = User::factory()->create([
            'negocio_id' => $negocio1->id,
            'role' => 'admin',
        ]);

        $negocio2 = Negocio::create(['name' => 'Negocio 2']);
        $cajero2 = User::factory()->cajero()->create([
            'negocio_id' => $negocio2->id,
            'name' => 'Cajero Negocio 2',
        ]);

        $this->actingAs($admin1);

        $response = $this->delete("/users/{$cajero2->id}");
        $response->assertStatus(403);

        // No se elimina
        $this->assertDatabaseHas('users', [
            'id' => $cajero2->id,
            'deleted_at' => null,
        ]);
    }

    public function test_cajero_que_intenta_acceder_a_dashboard_es_redirigido_a_pos()
    {
        $negocio = Negocio::create(['name' => 'Negocio Test']);
        $cajero = User::factory()->cajero()->create([
            'negocio_id' => $negocio->id,
        ]);

        $this->actingAs($cajero);

        $response = $this->get('/dashboard');
        $response->assertRedirect(route('pos.index'));
    }

    public function test_admin_puede_acceder_a_dashboard()
    {
        $negocio = Negocio::create(['name' => 'Negocio Test']);
        $admin = User::factory()->create([
            'negocio_id' => $negocio->id,
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $response = $this->get('/dashboard');
        $response->assertStatus(200);
    }

    public function test_login_de_cajero_redirige_a_pos()
    {
        $negocio = Negocio::create(['name' => 'Negocio Test']);
        $cajero = User::factory()->cajero()->create([
            'negocio_id' => $negocio->id,
            'password' => \Illuminate\Support\Facades\Hash::make('password123'),
        ]);

        $response = $this->post('/login', [
            'email' => $cajero->email,
            'password' => 'password123',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('pos.index', absolute: false));
    }
}
