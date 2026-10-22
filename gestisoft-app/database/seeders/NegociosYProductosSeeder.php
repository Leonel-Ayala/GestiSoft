<?php

namespace Database\Seeders;

use App\Models\MovimientoStock;
use App\Models\Negocio;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class NegociosYProductosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->newLine();
        $this->command->info('===============================================================');
        $this->command->info('  INICIANDO SEEDER: NEGOCIOS, ADMINISTRADORES Y PRODUCTOS      ');
        $this->command->info('===============================================================');

        // 1. CONSULTAR A LA BASE DE DATOS LOS DUEÑOS Y LOCALES EXISTENTES
        $this->command->newLine();
        $this->command->comment('1. Consultando los dueños y locales existentes en la base de datos...');
        
        $duenosExistentes = User::where('role', 'admin')->with('negocio')->get();

        if ($duenosExistentes->isEmpty()) {
            $this->command->warn('   No se encontraron administradores previos en la base de datos.');
        } else {
            $tableData = $duenosExistentes->map(function ($user) {
                return [
                    'ID Usuario' => $user->id,
                    'Dueño / Admin' => $user->name,
                    'Email' => $user->email,
                    'Negocio ID' => $user->negocio_id ?? 'Sin asignar',
                    'Nombre Negocio' => $user->negocio ? $user->negocio->name : 'N/A',
                ];
            });
            $this->command->table(['ID Usuario', 'Dueño / Admin', 'Email', 'Negocio ID', 'Nombre Negocio'], $tableData);
        }

        // 2. DEFINICIÓN DE LOS 3 NUEVOS NEGOCIOS CON SUS ADMINISTRADORES Y PRODUCTOS
        $nuevosNegocios = [
            // RUBRO: ROPA / MODA
            [
                'negocio' => 'Boutique Urbana',
                'admin' => [
                    'name' => 'Valentina Ropa',
                    'email' => 'ropa@gestisoft.cl',
                    'password' => 'admin1234',
                    'role' => 'admin',
                ],
                'rubro' => 'Ropa y Vestuario',
                'productos' => [
                    ['sku' => 'ROP-001', 'name' => 'Polera Básica Algodón Unisex', 'price' => 9990, 'stock' => 35],
                    ['sku' => 'ROP-002', 'name' => 'Jeans Denim Slim Fit Clásico', 'price' => 24990, 'stock' => 20],
                    ['sku' => 'ROP-003', 'name' => 'Polerón Hoodie con Capucha', 'price' => 19990, 'stock' => 25],
                    ['sku' => 'ROP-004', 'name' => 'Chaqueta Mezclilla Vintage', 'price' => 32990, 'stock' => 12],
                    ['sku' => 'ROP-005', 'name' => 'Camisa Formal Manga Larga Oxford', 'price' => 17990, 'stock' => 18],
                    ['sku' => 'ROP-006', 'name' => 'Pantalón Jogger Deportivo Algodón', 'price' => 15990, 'stock' => 22],
                    ['sku' => 'ROP-007', 'name' => 'Vestido Casual Estampado Verano', 'price' => 18990, 'stock' => 15],
                    ['sku' => 'ROP-008', 'name' => 'Pack x3 Calcetines Deportivos Bambú', 'price' => 4990, 'stock' => 50],
                    ['sku' => 'ROP-009', 'name' => 'Gorro Beanie Urbano Tejido', 'price' => 6990, 'stock' => 30],
                    ['sku' => 'ROP-010', 'name' => 'Cinturón de Cuero Genuino Ajustable', 'price' => 11990, 'stock' => 16],
                ],
            ],

            // RUBRO: CARTAS POKÉMON Y COLECCIONABLES TCG
            [
                'negocio' => 'PokéStore TCG & Coleccionables',
                'admin' => [
                    'name' => 'Ash Pokémon',
                    'email' => 'pokemon@gestisoft.cl',
                    'password' => 'admin1234',
                    'role' => 'admin',
                ],
                'rubro' => 'Cartas Pokémon y Coleccionables',
                'productos' => [
                    ['sku' => 'PKM-001', 'name' => 'Sobre Booster Pack Escarlata y Púrpura', 'price' => 5500, 'stock' => 80],
                    ['sku' => 'PKM-002', 'name' => 'Elite Trainer Box (ETB) Corona Astral', 'price' => 54990, 'stock' => 10],
                    ['sku' => 'PKM-003', 'name' => 'Baraja de Combate Deluxe Meowscarada ex', 'price' => 22990, 'stock' => 15],
                    ['sku' => 'PKM-004', 'name' => 'Lata Coleccionable Charizard ex', 'price' => 26990, 'stock' => 12],
                    ['sku' => 'PKM-005', 'name' => 'Carpeta Archivadora 9 Bolsillos Pokéball', 'price' => 18990, 'stock' => 20],
                    ['sku' => 'PKM-006', 'name' => 'Pack 65 Protectores Sleeves Pikachu Ultra Pro', 'price' => 8990, 'stock' => 45],
                    ['sku' => 'PKM-007', 'name' => 'Mini Tin Compañeros de Paldea', 'price' => 13500, 'stock' => 25],
                    ['sku' => 'PKM-008', 'name' => 'Caja Colección Especial Destinos de Paldea', 'price' => 34990, 'stock' => 8],
                    ['sku' => 'PKM-009', 'name' => 'Tapete Playmat Oficial Charizard TCG', 'price' => 21990, 'stock' => 14],
                    ['sku' => 'PKM-010', 'name' => 'Figura Coleccionable Mewtwo 15cm', 'price' => 16990, 'stock' => 10],
                ],
            ],

            // RUBRO: VENTA DE HELADOS / HELADERÍA
            [
                'negocio' => 'Heladería Dulce Crema',
                'admin' => [
                    'name' => 'Camila Helados',
                    'email' => 'helados@gestisoft.cl',
                    'password' => 'admin1234',
                    'role' => 'admin',
                ],
                'rubro' => 'Venta de Helados',
                'productos' => [
                    ['sku' => 'HLD-001', 'name' => 'Barquillo Simple 1 Bola Artesanal', 'price' => 2200, 'stock' => 60],
                    ['sku' => 'HLD-002', 'name' => 'Barquillo Doble 2 Sabores Artesanal', 'price' => 3500, 'stock' => 50],
                    ['sku' => 'HLD-003', 'name' => 'Barquillo Triple Especial Dulce Crema', 'price' => 4800, 'stock' => 35],
                    ['sku' => 'HLD-004', 'name' => 'Copa Helada Sundae Chocolate Belga', 'price' => 4200, 'stock' => 25],
                    ['sku' => 'HLD-005', 'name' => 'Copa Clásica Banana Split Especial', 'price' => 5500, 'stock' => 20],
                    ['sku' => 'HLD-006', 'name' => 'Pote Helado 1 Litro Cookies & Cream', 'price' => 7990, 'stock' => 18],
                    ['sku' => 'HLD-007', 'name' => 'Pote Helado 500ml Manjar Frutos del Bosque', 'price' => 4990, 'stock' => 22],
                    ['sku' => 'HLD-008', 'name' => 'Paleta Artesanal Rellena con Manjar', 'price' => 2500, 'stock' => 40],
                    ['sku' => 'HLD-009', 'name' => 'Paleta Vegana Mango Maracuyá Fruta Natural', 'price' => 2000, 'stock' => 45],
                    ['sku' => 'HLD-010', 'name' => 'Milkshake Batido Helado Vainilla y Frutos Rojos', 'price' => 3900, 'stock' => 30],
                ],
            ],
        ];

        // 3. CREAR NUEVOS NEGOCIOS, ADMINISTRADORES Y SUS 10 PRODUCTOS USANDO LOGIN TEMPORAL
        $this->command->newLine();
        $this->command->comment('2. Creando los nuevos negocios y utilizando Auth::login para activar el trait HasNegocio...');

        foreach ($nuevosNegocios as $data) {
            // A. Crear o recuperar el Negocio
            $negocio = Negocio::firstOrCreate(
                ['name' => $data['negocio']]
            );

            // B. Crear o recuperar el Administrador
            $admin = User::firstOrCreate(
                ['email' => $data['admin']['email']],
                [
                    'name' => $data['admin']['name'],
                    'password' => Hash::make($data['admin']['password']),
                    'role' => $data['admin']['role'],
                    'negocio_id' => $negocio->id,
                ]
            );

            // Asegurar que el negocio_id esté sincronizado
            if ($admin->negocio_id !== $negocio->id) {
                $admin->negocio_id = $negocio->id;
                $admin->save();
            }

            $this->command->info(sprintf(
                '   -> Negocio [%d]: "%s" | Admin: "%s" (%s) | Clave: %s',
                $negocio->id,
                $negocio->name,
                $admin->name,
                $admin->email,
                $data['admin']['password']
            ));

            // C. INICIAR SESIÓN TEMPORAL CON EL ADMIN DEL NEGOCIO
            Auth::login($admin);

            $productosGuardados = 0;
            foreach ($data['productos'] as $prodData) {
                // Gracias a Auth::login() y al Trait HasNegocio:
                // 1) El Global Scope busca solo en este negocio (WHERE negocio_id = $admin->negocio_id)
                // 2) El evento creating asigna $model->negocio_id = Auth::user()->negocio_id automáticamente
                // 3) Product::$fillable no necesita 'negocio_id'
                $producto = Product::where('sku', $prodData['sku'])->first();

                if ($producto) {
                    $producto->update([
                        'name' => $prodData['name'],
                        'price' => $prodData['price'],
                        'stock' => $prodData['stock'],
                    ]);
                } else {
                    $producto = Product::create([
                        'sku' => $prodData['sku'],
                        'name' => $prodData['name'],
                        'price' => $prodData['price'],
                        'stock' => $prodData['stock'],
                    ]);

                    // Registrar movimiento de stock inicial
                    MovimientoStock::firstOrCreate(
                        [
                            'product_id' => $producto->id,
                            'motivo' => 'Inventario Inicial',
                        ],
                        [
                            'user_id' => Auth::id(),
                            'cantidad_anterior' => 0,
                            'cantidad_nueva' => $producto->stock,
                            'diferencia' => $producto->stock,
                        ]
                    );
                }

                $productosGuardados++;
            }

            // D. CERRAR SESIÓN DEL ADMIN ACTUAL
            Auth::logout();

            $this->command->line(sprintf('      ✓ %d productos creados con HasNegocio y sesión cerrada.', $productosGuardados));
        }

        // 4. ASEGURAR QUE LOS NEGOCIOS EXISTENTES TENGAN AL MENOS 10 PRODUCTOS
        $this->command->newLine();
        $this->command->comment('3. Completando productos para negocios previos mediante Auth::login de sus dueños...');

        $productosExtrasPorNegocio = [
            'Completos Hugo' => [
                ['sku' => 'HUG-004', 'name' => 'Completo Italiano Gigante', 'price' => 3200, 'stock' => 50],
                ['sku' => 'HUG-005', 'name' => 'Completo Dinámico Especial', 'price' => 3400, 'stock' => 45],
                ['sku' => 'HUG-006', 'name' => 'As Italiano Vacuno', 'price' => 4500, 'stock' => 30],
                ['sku' => 'HUG-007', 'name' => 'Churrasco Palta Mayo', 'price' => 4990, 'stock' => 25],
                ['sku' => 'HUG-008', 'name' => 'Porción Papas Fritas Grandes', 'price' => 3500, 'stock' => 40],
                ['sku' => 'HUG-009', 'name' => 'Bebida Lata Coca-Cola 350ml', 'price' => 1500, 'stock' => 60],
                ['sku' => 'HUG-010', 'name' => 'Empanada de Pino Tradicional', 'price' => 2500, 'stock' => 35],
            ],
            'Abarrotes Laura' => [
                ['sku' => 'AL-002', 'name' => 'Arroz Grado 1 Selección 1kg', 'price' => 1890, 'stock' => 40],
                ['sku' => 'AL-003', 'name' => 'Aceite Vegetal Maravilla 900ml', 'price' => 2790, 'stock' => 30],
                ['sku' => 'AL-004', 'name' => 'Fideos Spaghetti Nº5 400g', 'price' => 1090, 'stock' => 50],
                ['sku' => 'AL-005', 'name' => 'Azúcar Blanca Refinada 1kg', 'price' => 1490, 'stock' => 35],
                ['sku' => 'AL-006', 'name' => 'Leche Entera Tetra 1 Litro', 'price' => 1290, 'stock' => 45],
                ['sku' => 'AL-007', 'name' => 'Atún Lomitos en Agua 160g', 'price' => 1650, 'stock' => 30],
                ['sku' => 'AL-008', 'name' => 'Té en Bolsitas Caja x100 unidades', 'price' => 3290, 'stock' => 25],
                ['sku' => 'AL-009', 'name' => 'Pan de Molde Blanco XL', 'price' => 2490, 'stock' => 20],
                ['sku' => 'AL-010', 'name' => 'Bebida Gaseosa 1.5L', 'price' => 2100, 'stock' => 30],
            ],
        ];

        foreach ($productosExtrasPorNegocio as $nombreNegocio => $extras) {
            $negocio = Negocio::where('name', $nombreNegocio)->first();
            if (! $negocio) {
                continue;
            }

            $admin = User::where('negocio_id', $negocio->id)->where('role', 'admin')->first();
            if (! $admin) {
                continue;
            }

            // Iniciar sesión temporal con el dueño del negocio
            Auth::login($admin);

            $totalProductosNegocio = Product::count(); // Filtrado automáticamente por el Global Scope

            if ($totalProductosNegocio < 10) {
                foreach ($extras as $extra) {
                    $producto = Product::where('sku', $extra['sku'])->first();
                    if (! $producto) {
                        $nuevoProd = Product::create([
                            'sku' => $extra['sku'],
                            'name' => $extra['name'],
                            'price' => $extra['price'],
                            'stock' => $extra['stock'],
                        ]);

                        MovimientoStock::firstOrCreate(
                            [
                                'product_id' => $nuevoProd->id,
                                'motivo' => 'Inventario Inicial',
                            ],
                            [
                                'user_id' => Auth::id(),
                                'cantidad_anterior' => 0,
                                'cantidad_nueva' => $nuevoProd->stock,
                                'diferencia' => $nuevoProd->stock,
                            ]
                        );
                    }
                }
            }

            Auth::logout();
        }

        // Asegurar que la sesión quede completamente cerrada al terminar
        Auth::logout();

        // 5. RESUMEN FINAL EN CONSOLA
        $this->command->newLine();
        $this->command->info('===============================================================');
        $this->command->info('  RESUMEN FINAL: NEGOCIOS Y PRODUCTOS EN LA PLATAFORMA        ');
        $this->command->info('===============================================================');

        $resumen = Negocio::with(['users' => function ($q) {
            $q->where('role', 'admin');
        }])->get()->map(function ($negocio) {
            $cantProductos = Product::withoutGlobalScopes()->where('negocio_id', $negocio->id)->count();
            $admins = $negocio->users->pluck('email')->implode(', ');
            return [
                'ID' => $negocio->id,
                'Negocio' => $negocio->name,
                'Administrador(es)' => $admins ?: 'Sin admin',
                'Cant. Productos' => $cantProductos,
                'Cumple >= 10' => $cantProductos >= 10 ? '✓ SÍ (' . $cantProductos . ')' : '✗ NO (' . $cantProductos . ')',
            ];
        });

        $this->command->table(['ID', 'Negocio', 'Administrador(es)', 'Cant. Productos', 'Cumple >= 10'], $resumen);
        $this->command->info('Seeder completado con éxito utilizando HasNegocio y Auth::login / Auth::logout.');
        $this->command->newLine();
    }
}
