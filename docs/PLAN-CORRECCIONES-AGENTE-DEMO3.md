# Plan de correcciones para agente — GestiSoft, Tercera Demostración y Defensa (Incremento 2)

> **Para quién es este documento:** un agente de código (Claude Code u otro) que trabajará sobre el repositorio `https://github.com/Leonel-Ayala/GestiSoft`.
> **Objetivo:** dejar el repositorio en condición de obtener el nivel **Excelente (7 pts)** en los 20 criterios de la rúbrica `docs/referencias/Semana 14 - INF524 - Rúbrica Tercera Demostración y Defensa.docx`.
> **Punto de partida:** rama `main`, commit `4fddd58` (merge del PR #18).
> **Fecha de elaboración:** 2026-11-14.

---

## 0. Reglas obligatorias para el agente (leer antes de tocar nada)

1. **No inventes evidencia.** Nunca escribas en un documento cifras, sesiones con usuarios, calificaciones, tiempos, revisiones ni resultados de CI que no hayas obtenido ejecutando algo real en este repositorio. Si un dato depende de una persona (por ejemplo, una entrevista con un dueño de comercio), deja el marcador `[COMPLETAR POR EL EQUIPO: …]` y anótalo en la sección "Pendientes humanos" de tu informe final.
2. **No falsifiques autoría.** No cambies `user.name` ni `user.email` de git para hacerte pasar por otro integrante, y no uses `--author`. El plan asigna cada tarea a un integrante: esa persona debe ejecutar (o al menos revisar, commitear y publicar desde su cuenta) la rama de su tarea. Si eres un agente usado por un solo integrante, prepara la rama y deja escrito en tu informe qué integrante debe publicarla y abrir el PR.
3. **No escribas bitácoras en nombre de otras personas.** En `bitacoras/semana-14/*.md` solo puedes agregar **enlaces** (PR, commit, test). La redacción en primera persona ("aprendí", "decidí") la hace cada integrante.
4. **Un cambio por rama y por PR.** Usa el nombre de rama indicado en cada tarea. Nunca hagas push directo a `main`.
5. **Todo cambio de código lleva un test** que falle antes del cambio y pase después. Ejecuta el test antes del cambio, confirma que falla y anota esa salida en la descripción del PR.
6. **Antes de cada commit**, ejecuta la suite completa desde `gestisoft-app/`: `php artisan test`. Si algo falla, no hagas commit. Si se rompe un test existente, corrígelo y explícalo en el PR.
7. **No cambies los nombres reales del dominio:** `Negocio`, `negocio_id`, `motivo`, `Product`, `Venta`, `VentaDetalle`, `TurnoCaja`, `MovimientoStock`. Nunca uses `Tenant`, `tenant_id` ni `justificacion`.
8. **Un solo catálogo de IDs.** Cada vez que crees o cites un ID (OBS, AC, DEF, RSK, ADR, H, F, REV), revisa que tenga el mismo significado en todos los archivos. La tabla de la sección 3 es la referencia.
9. **Idioma:** todo en español, igual que el resto del repositorio. Mensajes de commit en formato Conventional Commits, en español.
10. **Si algo de este plan no coincide con el código actual** (un archivo movido, una línea distinta), manda el código actual: adapta la instrucción y anótalo en el PR.

### 0.1 Preparación del entorno

```bash
git clone https://github.com/Leonel-Ayala/GestiSoft.git
cd GestiSoft
git checkout main && git pull
cd gestisoft-app
composer install
npm install --legacy-peer-deps
cp .env.example .env
php artisan key:generate
php artisan test          # Línea base: deben pasar 64 tests. Anota el total y las aserciones.
```

Si la línea base no da 64 tests en verde, **detente** y repórtalo antes de seguir.

### 0.2 Convención de PR

Cada PR debe usar esta plantilla en la descripción:

```markdown
## Qué cambia
<una o dos frases>

## Por qué
Cierra DEF-XX / OBS-XX. Criterio(s) de la rúbrica S14: CX, CY.

## Evidencia
- Test nuevo: `tests/Feature/Archivo.php::test_nombre`
- Antes del cambio: <pegar la línea de fallo del test>
- Después: `php artisan test` → N passed (M assertions)

## Revisión solicitada a
<integrante revisor>, según el plan de correcciones.
```

Crea también `.github/pull_request_template.md` con esa plantilla (la tarea T-3.1 lo detalla).

---

## 1. Mapa del repositorio (lo que vas a tocar)

| Ruta | Qué es |
| --- | --- |
| `gestisoft-app/app/Http/Controllers/POSController.php` | Checkout del POS (C1 ya aplicado). Aquí van DEF-11, DEF-12, DEF-13 y DEF-14 |
| `gestisoft-app/app/Http/Controllers/CajaController.php` | Abrir, cerrar y auditar turnos. Aquí va DEF-17 |
| `gestisoft-app/app/Http/Controllers/UserController.php` | Creación de usuarios. Aquí va DEF-16 |
| `gestisoft-app/routes/web.php` | Rutas. Aquí va DEF-15 |
| `gestisoft-app/app/Models/TurnoCaja.php` | `sincronizarTotales()` |
| `gestisoft-app/app/Models/MovimientoStock.php` | Kardex (fillable: `product_id, user_id, cantidad_anterior, cantidad_nueva, diferencia, motivo`) |
| `gestisoft-app/tests/Feature/*.php` | 64 tests en PHPUnit con SQLite en memoria |
| `.github/workflows/tests.yml` | CI: PHP 8.4, Node 22, `php artisan test` |
| `docs/guia-semana13.md` | Guía actual (se reemplaza por `docs/guia-semana14.md`) |
| `docs/referencias/Guía de Trabajo en Equipo - Evolución y Estabilización - GestiSoft.docx` | Versión .docx de la guía, que hoy no coincide con el .md |
| `producto/backlog/*.md` | Fichas de PBI y SPIKE |
| `producto/semana-3/trazabilidad.csv` | Matriz de trazabilidad |
| `producto/semana-3/mediciones-calidad.md` | Mediciones de calidad |
| `riesgos/registro-v1.csv`, `riesgos/registro-riesgos-v1.md` | Registro de riesgos (hoy solo RSK-01 a RSK-06) |
| `investigacion/validacion-h01.md` | Validación de H-01 |
| `docs/guia-presentacion-defensa3.md` | Guion de la defensa |
| `README.md` | Instalación |

---

## 2. Orden de ejecución y dependencias

```
FASE 0  Protección de main y plantilla de PR        (T-0.1)
   │
FASE 1  Código y tests                              (T-1.1 … T-1.9)  → cada una en su propio PR
   │    (todas las de la fase 1 fusionadas y con CI en verde)
FASE 2  Documentos                                  (T-2.1 … T-2.9)  → citan los PR y tests de la fase 1
   │
FASE 3  Autoría y revisión                          (T-3.1 … T-3.3)
   │
FASE 4  Congelar la versión candidata               (T-4.1 … T-4.3)  → tag v0.2.0-rc2 + Release
```

Las tareas de una misma fase pueden ir en paralelo, salvo que se indique una dependencia.

---

## 3. Catálogo único de IDs (referencia obligatoria)

### 3.1 Defectos

DEF-01 a DEF-10 se conservan tal como están en la sección 12 de `docs/guia-semana13.md`. Los defectos nuevos son estos:

| ID | Título corto | Severidad | Tarea |
| --- | --- | --- | --- |
| DEF-11 | Venta sin movimiento de Kardex | Alta / P0 | T-1.1 |
| DEF-12 | Sobreventa con ítems duplicados en el checkout | Alta / P0 | T-1.2 |
| DEF-13 | `payment_method` sin lista cerrada de valores | Media / P1 | T-1.2 y T-1.3 |
| DEF-14 | Venta registrada en un turno que se cerró de forma concurrente | Media / P1 | T-1.4 |
| DEF-15 | Rutas de recurso inexistentes devuelven error 500 | Media / P1 | T-1.5 |
| DEF-16 | Creación de administradores sin decisión documentada (C5) | Media / P1 | T-1.6 |
| DEF-17 | Doble apertura concurrente no protegida a nivel de base de datos | Baja / P2 | T-1.7 |
| DEF-18 | `restrictOnDelete` no se comprueba en CI (SQLite) | Baja / P2 | T-1.8 |
| DEF-19 | Tests que crean `TurnoCaja` con el campo inexistente `monto_apertura` | Baja / P2 | T-1.8 |

### 3.2 ADR

| ID | Decisión |
| --- | --- |
| ADR-01 | Multi-tenant con Global Scope (`HasNegocio`) — ya existe |
| ADR-02 | RBAC con campo `role` — ya existe |
| ADR-03 | Importes calculados en el servidor (C1) — ya existe |
| ADR-04 | Arqueo ciego transaccional — ya existe |
| ADR-05 | Kardex inmutable con SoftDeletes + `restrictOnDelete` (C3) — ya existe. **No reutilizar este número** |
| ADR-06 | **Nuevo:** política de creación de administradores (C5 / DEF-16) |
| ADR-07 | **Nuevo:** toda variación de stock deja un movimiento de Kardex, incluidas las ventas (DEF-11) |

### 3.3 Criterios de aceptación nuevos

| ID | Tipo | Resumen |
| --- | --- | --- |
| AC-CAJA-07 | Borde | Ítems duplicados en el checkout se rechazan sin alterar stock ni ventas |
| AC-CAJA-08 | Error | Medio de pago fuera de la lista se rechaza sin alterar stock ni ventas |
| AC-CAJA-09 | Borde | Una venta contra un turno ya cerrado se rechaza |
| AC-KARDEX-02 | Normal | Cada venta crea un movimiento de Kardex con `diferencia = -cantidad`, y el stock coincide con la suma del Kardex |
| AC-SEC-03 | Error | Las rutas no implementadas responden 404, no 500 |
| AC-USR-01 | Seguridad | Creación de usuarios según ADR-06 |

AC-CAJA-01 a AC-CAJA-06, AC-07-REV, AC-SEC-POS-01 y AC-SEC-KARDEX-01 se conservan **con el significado que tienen en `docs/guia-semana13.md`** (sección 8). El .docx se corrige para que coincida.

---

## FASE 0 — Preparación

### T-0.1 Protección de `main` y plantilla de PR
- **Responsable:** Leonel (dueño del repositorio). **El agente no puede hacerlo**: requiere permisos de administrador en GitHub.
- **Instrucción para el humano:** GitHub → Settings → Branches → Add branch protection rule → `main`:
  - [x] Require a pull request before merging → Require approvals: **1**
  - [x] Require status checks to pass → seleccionar el job `phpunit`
  - [x] Do not allow bypassing the above settings
- **Lo que sí hace el agente:** crear `.github/pull_request_template.md` con la plantilla de la sección 0.2, en la rama `chore/pr-template`.
- **Criterio de cierre:** el archivo existe en `main` y la regla está activa (captura de pantalla en `docs/evidencias/proteccion-main.png`, tomada por el humano).

---

## FASE 1 — Código y tests

> En todas las tareas: crea la rama desde `main` actualizada, escribe primero el test, comprueba que falla, aplica el cambio, comprueba que pasa y ejecuta la suite completa.

### T-1.1 DEF-11 — Registrar en el Kardex cada venta
- **Rama:** `fix/DEF-11-kardex-en-ventas`
- **Autor:** Rodrigo · **Revisor:** Leonel
- **Criterios:** C6, C7, C15
- **Problema:** `POSController@checkout` descuenta stock (paso 6) pero no crea un `MovimientoStock`. El Kardex solo registra los ajustes manuales, así que el stock no se puede reconstruir a partir del Kardex.

**Pasos:**
1. Abre `gestisoft-app/app/Http/Controllers/POSController.php` y agrega el import `use App\Models\MovimientoStock;`.
2. Reemplaza el bloque `// 6. Descontar stock y registrar detalles` por:

```php
            // 6. Descontar stock, registrar detalles y dejar trazabilidad en el Kardex (ADR-07)
            foreach ($itemsDetalles as $detalle) {
                $prod = $detalle['product'];
                $cantidadAnterior = (int) $prod->stock;
                $cantidadNueva = $cantidadAnterior - $detalle['quantity'];

                $prod->stock = $cantidadNueva;
                $prod->save();

                VentaDetalle::create([
                    'venta_id' => $venta->id,
                    'product_id' => $prod->id,
                    'product_name' => $prod->name,
                    'quantity' => $detalle['quantity'],
                    'price' => $detalle['price'],
                    'subtotal' => $detalle['subtotal'],
                ]);

                MovimientoStock::create([
                    'product_id' => $prod->id,
                    'user_id' => auth()->id(),
                    'cantidad_anterior' => $cantidadAnterior,
                    'cantidad_nueva' => $cantidadNueva,
                    'diferencia' => -$detalle['quantity'],
                    'motivo' => "Venta #{$venta->id}",
                ]);
            }
```

3. Revisa que el movimiento quede **dentro** de `DB::beginTransaction()` / `DB::commit()`: si falla, el `rollBack()` del `catch` lo revierte junto con todo lo demás.
4. Si la vista del Kardex en `resources/js/Pages/Inventory/*.jsx` muestra los movimientos, revisa que los de venta (diferencia negativa) se vean bien. Si no hay vista de Kardex, no crees una.

**Tests (en `tests/Feature/POSTest.php`):**

```php
public function test_venta_registra_movimiento_en_kardex()
{
    // Arrange: negocio, usuario cajero, turno abierto (usar 'monto_inicial', NO 'monto_apertura'),
    //          producto con stock 5 y precio 10000.
    // Act: POST /pos/checkout con 2 unidades, 'Efectivo', amount_received 20000.
    // Assert:
    //   - assertSessionHasNoErrors()
    //   - products.stock = 3
    //   - movimiento_stocks tiene una fila con product_id, cantidad_anterior 5, cantidad_nueva 3,
    //     diferencia -2 y motivo "Venta #<id de la venta creada>"
}

public function test_stock_coincide_con_suma_de_kardex_tras_alta_ajuste_y_venta()
{
    // Arrange: usuario admin del negocio (UserFactory crea role 'admin' por defecto), turno abierto del admin.
    // Act:
    //   1) POST /inventory  (sku, name, price 1000, stock 10) → movimiento "Inventario Inicial" +10
    //   2) PUT /inventory/{id} con stock 8 y motivo "Merma"  → -2
    //   3) POST /pos/checkout con 3 unidades en Efectivo      → -3
    // Assert: Product::find(id)->stock === 5
    //         MovimientoStock::where('product_id', id)->sum('diferencia') === 5   (invariante)
}

public function test_si_falla_la_venta_no_queda_movimiento_de_kardex()
{
    // Arrange: turno abierto, producto con stock 1.
    // Act: checkout con 2 unidades (stock insuficiente).
    // Assert: movimiento_stocks sin filas para el producto; ventas = 0; stock = 1.
}
```

Agrega `#[\PHPUnit\Framework\Attributes\Group('regresion')]` a `test_stock_coincide_con_suma_de_kardex_tras_alta_ajuste_y_venta`.

**Criterio de cierre:** 3 tests nuevos en verde, suite completa en verde y PR revisado por Leonel.
**Commit:** `fix(pos): registrar movimiento de Kardex en cada venta (DEF-11, ADR-07)`

---

### T-1.2 DEF-12 y DEF-13 — Validar ítems duplicados y medio de pago
- **Rama:** `fix/DEF-12-13-validacion-checkout`
- **Autor:** Alan · **Revisor:** Rodrigo
- **Criterios:** C6, C8, C13

**Pasos:**
1. En `POSController.php` agrega `use Illuminate\Validation\Rule;`.
2. Reemplaza el `$request->validate([...])` del checkout por:

```php
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|distinct',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => ['required', 'string', Rule::in(self::METODOS_PAGO)],
            'amount_received' => 'nullable|integer|min:0',
        ], [
            'items.*.product_id.distinct' => 'El mismo producto no puede venir repetido en la venta; agrupe las cantidades.',
            'payment_method.in' => 'Medio de pago no válido.',
        ]);
```

3. Agrega la constante a la clase:

```php
    public const METODOS_PAGO = ['Efectivo', 'Débito', 'Crédito', 'Transferencia'];
```

4. Cambia el cálculo de `$esEfectivo` a `$esEfectivo = $validated['payment_method'] === 'Efectivo';`.
5. **No borres** los alias heredados (`cash`, `Tarjeta`, `card`, etc.) de `TurnoCaja::sincronizarTotales()` ni de `CajaController@transacciones`: sirven para leer ventas antiguas. Agrega un comentario: `// Alias heredados solo para lectura de datos históricos; la escritura está restringida por POSController::METODOS_PAGO`.
6. Los tests `TurnoCajaTest.php` (línea ~85, `'Tarjeta'`) y `CajaTurnoSecurityTest.php` (línea ~397, `'cash'`) crean ventas con `Venta::create` directamente, sin pasar por el checkout. **No los cambies:** prueban la compatibilidad con datos históricos. Agrega un comentario en cada uno que lo explique.

**Tests (en `tests/Feature/POSTest.php`):**

```php
public function test_items_duplicados_no_permiten_sobreventa()
{
    // Producto stock 1, precio 5000, turno abierto.
    // POST /pos/checkout items: [{id,1},{id,1}], 'Efectivo', 10000
    // Assert: assertSessionHasErrors() (clave 'items.1.product_id' o 'items.0.product_id')
    //         products.stock = 1; ventas = 0; movimiento_stocks sin filas para el producto.
}

public function test_medio_de_pago_invalido_es_rechazado()
{
    // Producto stock 5, turno abierto.
    // POST con 'payment_method' => 'Cheque'
    // Assert: assertSessionHasErrors('payment_method'); stock intacto; ventas = 0.
}

public function test_medio_de_pago_en_minusculas_es_rechazado()
{
    // 'payment_method' => 'efectivo' → assertSessionHasErrors('payment_method').
    // Documenta en el PR que el frontend envía siempre los 4 valores canónicos (POS/Index.jsx, METODOS_PAGO).
}
```

**Criterio de cierre:** 3 tests en verde y suite completa en verde.
**Commit:** `fix(pos): rechazar ítems duplicados y medios de pago no permitidos (DEF-12, DEF-13)`

---

### T-1.3 DEF-13 (interfaz) — Mostrar los errores del checkout
- **Rama:** `fix/DEF-13-ui-errores-checkout`
- **Autor:** Luis · **Revisor:** Alan
- **Depende de:** T-1.2 fusionada
- **Criterios:** C6, C8

**Pasos:**
1. En `resources/js/Pages/POS/Index.jsx`, revisa que el arreglo `METODOS_PAGO` (línea ~84) tenga exactamente los mismos 4 `id` que `POSController::METODOS_PAGO`. Agrega un comentario que diga que deben mantenerse sincronizados.
2. Revisa que los errores de validación de Inertia con claves `payment_method` y `items.*` (no solo `checkout`) se muestren al cajero en el modal de pago o en la notificación existente. Si hoy solo se lee `errors.checkout`, agrega la lectura de `errors.payment_method` y de cualquier clave que empiece con `items`.
3. Revisa que `addToCart` (línea ~201) siga agrupando las cantidades del mismo producto. Ya lo hace con `prevCart.find(...)`: no lo cambies, solo menciónalo en el PR como la razón de que el frontend nunca envíe duplicados.
4. Ejecuta `npm run build` sin errores.

**Evidencia:** captura del mensaje de error al forzar un medio inválido (por ejemplo, desde DevTools), guardada en `docs/evidencias/DEF-13-error-medio-pago.png` y enlazada en el PR. La captura la toma el humano si el agente no puede abrir un navegador.
**Commit:** `fix(pos-ui): mostrar errores de validación de medio de pago e ítems (DEF-13)`

---

### T-1.4 DEF-14 — Bloquear el turno dentro de la transacción del checkout
- **Rama:** `fix/DEF-14-lock-turno-checkout`
- **Autor:** Leonel · **Revisor:** Alan
- **Depende de:** T-1.1 y T-1.2 fusionadas (tocan el mismo método)
- **Criterios:** C6, C8

**Problema:** el turno activo se lee antes de `DB::beginTransaction()` y sin bloqueo. Si el turno se cierra entre esa lectura y el commit, la venta queda asociada a un turno cerrado y `sincronizarTotales()` modifica el `total_esperado` de un turno que ya pasó por el arqueo.

**Pasos:**
1. Mantén la verificación previa (falla rápido, mensaje igual), pero **dentro** de la transacción, como primera instrucción después de `DB::beginTransaction();`, agrega:

```php
            // Re-lectura con bloqueo: el turno no puede cerrarse mientras esta venta se registra (DEF-14)
            $turnoActivo = TurnoCaja::whereKey($turnoActivo->id)->lockForUpdate()->first();

            if (!$turnoActivo || $turnoActivo->estado !== 'abierto') {
                throw new \Exception('El turno de caja fue cerrado. Abra un nuevo turno para registrar ventas.');
            }
```

2. Revisa que `CajaController@cerrar` siga bloqueando el turno con `lockForUpdate()` (ya lo hace). Con esto, cierre y venta quedan serializados sobre la misma fila.
3. Agrega en `TurnoCaja::sincronizarTotales()` una guarda al inicio:

```php
        if ($this->estado === 'cerrado') {
            // Un turno cerrado es inmutable: no se recalculan sus totales (ADR-04)
            return;
        }
```

   Revisa que `CajaController@cerrar` llame a `sincronizarTotales()` **antes** de cambiar el estado a `cerrado` (hoy lo hace así). Si la guarda rompe algún test, ajústala y explica el cambio en el PR.

**Tests (en `tests/Feature/TurnoCajaTest.php`):**

```php
public function test_venta_rechazada_si_turno_se_cerro()
{
    // Turno abierto del usuario; producto stock 5.
    // Simula el cierre concurrente: después de la verificación previa, marca el turno como cerrado
    //   (forma simple y determinista: cerrar el turno con POST /caja/cerrar y luego intentar el checkout;
    //    debe responder con el error 'Debe abrir un turno...' de la verificación previa).
    // Para cubrir la re-lectura: usa TurnoCaja::updating/booted en el test, o un listener de DB::listen
    //   que cierre el turno con un update directo justo antes del primer SELECT ... FOR UPDATE de productos.
    //   Si no logras un test determinista de la re-lectura, deja el test del flujo secuencial y
    //   declara la limitación en el PR y en la guía (sección "Limitaciones").
    // Assert: ventas = 0; stock = 5; turno sigue 'cerrado' con su total_esperado intacto.
}

public function test_turno_cerrado_no_recalcula_totales()
{
    // Turno cerrado con total_esperado X; se inserta directamente una Venta con turno_caja_id del turno.
    // Llama a $turno->sincronizarTotales().
    // Assert: total_esperado sigue siendo X.
}
```

**Commit:** `fix(caja): serializar checkout y cierre de turno con bloqueo de fila (DEF-14)`

---

### T-1.5 DEF-15 — Rutas de recurso sin implementación
- **Rama:** `fix/DEF-15-rutas-recurso`
- **Autor:** Luis · **Revisor:** Leonel
- **Criterios:** C8, C13

**Pasos:**
1. En `routes/web.php`, cambia:

```php
Route::resource('inventory', ProductController::class)
    ->parameters(['inventory' => 'product'])
    ->except(['show']);
Route::resource('users', \App\Http\Controllers\UserController::class)
    ->only(['index', 'create', 'store', 'destroy']);
```

2. Ejecuta `php artisan route:list --path=users` y `--path=inventory`, y pega la salida en el PR.
3. En `.env.example`, revisa `APP_DEBUG=true`. Déjalo así para desarrollo local, pero agrega al README (T-2.8) que una demo o producción debe usar `APP_DEBUG=false` para no exponer trazas. **No cambies** el `.env.example` sin avisar en el PR.

**Tests (en `tests/Feature/RoleSecurityTest.php`):**

```php
public function test_rutas_inexistentes_responden_404()
{
    // actingAs admin
    // $this->get('/users/'.$admin->id)->assertNotFound();      // antes: 500
    // $this->get('/users/'.$admin->id.'/edit')->assertNotFound();
    // $this->get('/inventory/'.$producto->id)->assertNotFound();
}
```

**Commit:** `fix(rutas): limitar resources a acciones implementadas para evitar 500 (DEF-15)`

---

### T-1.6 DEF-16 — Política de creación de administradores (C5) y ADR-06
- **Rama:** `feat/DEF-16-adr06-creacion-admin`
- **Autor:** Rodrigo · **Revisor:** Luis
- **Criterios:** C1, C13, C15

**Decisión que debe tomar el equipo (el agente NO decide):** pregunta al humano cuál de las dos opciones adoptar y espera la respuesta antes de implementar.
- **Opción A (recomendada por la rúbrica de seguridad: mínimo privilegio):** `UserController::store()` solo crea `cajero`; el rol `admin` se asigna únicamente por el seeder o el registro inicial del negocio.
- **Opción B:** mantener la creación de admin, pero declararla en el alcance de PBI-04, en el flujo y en AC-USR-01, con un test que la cubra.

**Pasos para la opción A:**
1. En `UserController::store()`, quita `role` de la validación de entrada y fuerza `'role' => 'cajero'` en `User::create`.
2. En `resources/js/Pages/Users/Create.jsx`, quita el selector de rol (o muéstralo deshabilitado con "Cajero").
3. Actualiza el test existente `test_admin_puede_crear_un_nuevo_cajero_para_su_negocio` si envía `role`.
4. Test nuevo `test_admin_no_puede_crear_otro_admin_desde_formulario`: POST `/users` con `role => 'admin'` → el usuario creado tiene `role = 'cajero'`.

**Pasos para la opción B:**
1. No cambies el código.
2. Test nuevo `test_admin_puede_crear_admin_del_mismo_negocio` que compruebe `role = admin` y el mismo `negocio_id`.
3. Documenta en PBI-04 y en AC-USR-01 que la creación de admin está en el alcance, y por qué.

**ADR-06 (ambas opciones):** créalo en `docs/adr/ADR-06-creacion-administradores.md` con este formato:

```markdown
# ADR-06: Política de creación de usuarios administradores
- **Estado:** Aceptado (AAAA-MM-DD)
- **Contexto:** Observación de la Demo 2 (criterio 12): `UserController::store()` admite rol admin además de cajero. OBS-29.
- **Alternativas:** A) solo cajeros desde la UI; B) permitir admins documentado en alcance.
- **Decisión:** <A o B> porque <razón ligada a riesgo RSK-xx y mínimo privilegio>.
- **Consecuencias:** <qué cambia en UI, tests, alcance>.
- **Condición de revisión:** <cuándo se reconsideraría>.
- **Evidencia:** PR #<n>, test `<nombre>`.
```

**Commit:** `feat(usuarios): aplicar política ADR-06 de creación de administradores (DEF-16)`

---

### T-1.7 DEF-17 — Doble apertura concurrente
- **Rama:** `fix/DEF-17-apertura-concurrente`
- **Autor:** Leonel · **Revisor:** Rodrigo
- **Criterios:** C8, C16

**Contexto:** `lockForUpdate()` sobre una consulta que no encuentra filas no impide que dos transacciones inserten a la vez. En MySQL (InnoDB, REPEATABLE READ) eso puede terminar en un deadlock, que hoy no se captura y produce un error 500.

**Pasos:**
1. En `CajaController@abrir`, captura el deadlock o la violación de restricción y responde de forma controlada:

```php
        try {
            return DB::transaction(function () use ($validated, $request) { /* código actual */ }, 3); // 3 reintentos ante deadlock
        } catch (\Illuminate\Database\QueryException $e) {
            report($e);
            $msg = 'Ya existe un turno de caja abierto o se está abriendo uno en este momento.';
            return $request->wantsJson()
                ? response()->json(['error' => $msg], 422)
                : back()->withErrors(['caja' => $msg]);
        }
```

2. **Opcional, solo si el equipo lo aprueba:** una restricción en la base de datos que garantice un único turno abierto por usuario. MySQL no tiene índices parciales; la alternativa es una columna generada `turno_abierto_user_id` (= `user_id` si `estado = 'abierto'`, si no `NULL`) con índice `UNIQUE`. Si se implementa, debe ser una migración nueva, compatible con SQLite en los tests (usa `DB::getDriverName()` como en `2026_11_12_100001`).
3. Si no se implementa el paso 2, declara en la guía (sección de limitaciones) y en el registro de riesgos (RSK-16) que la protección es de aplicación más reintentos, no una restricción física.

**Tests:** el test secuencial existente (`test_no_se_puede_abrir_dos_turnos_simultaneos_para_el_mismo_usuario`) debe **renombrarse** a `test_no_se_puede_abrir_un_segundo_turno_si_ya_hay_uno_abierto`, porque no es concurrente. Actualiza todas las referencias a ese nombre en los documentos.
**Commit:** `fix(caja): manejar apertura concurrente con reintentos y respuesta controlada (DEF-17)`

---

### T-1.8 Suite de regresión, DEF-18 y DEF-19 en tests y CI
- **Rama:** `test/regresion-incremento-1`
- **Autor:** Alan · **Revisor:** Leonel
- **Depende de:** T-1.1 a T-1.6 fusionadas (para etiquetar también los tests nuevos)
- **Criterios:** C9, C10, C14

**Pasos:**
1. **DEF-19:** busca `monto_apertura` en `tests/` (`grep -rn monto_apertura tests`) y reemplázalo por `monto_inicial` en los 4 lugares donde aparece. Revisa que esos tests sigan en verde. Ese campo no existe y Laravel lo descartaba sin avisar.
2. **Grupo de regresión:** agrega `#[\PHPUnit\Framework\Attributes\Group('regresion')]` (y su `use`) a los tests que protegen el Incremento 1:
   - `InventoryTest`: todos los métodos.
   - `POSTest`: `test_no_se_puede_vender_producto_sin_stock`, `test_venta_ignora_precio_enviado_por_cliente`, `test_efectivo_insuficiente_es_rechazado`, `test_no_se_puede_vender_producto_de_otro_negocio`.
   - `RoleSecurityTest`: todos los métodos.
   - `MultiTenantSecurityTest`: todos los métodos.
   - `POSTest::test_stock_coincide_con_suma_de_kardex_tras_alta_ajuste_y_venta` (T-1.1).
3. Ejecuta `php artisan test --group=regresion`, anota el número de tests y pega la salida en el PR.
4. **CI:** en `.github/workflows/tests.yml`, antes del paso `Run PHPUnit Tests`, agrega:

```yaml
      - name: Regresión Incremento 1 (inventario, POS, roles, multi-tenant, Kardex)
        run: php artisan test --group=regresion

      - name: Suite completa
        run: php artisan test
```

   Renombra el paso actual a "Suite completa" (no lo dupliques).
5. **DEF-18:** C3 (`restrictOnDelete`) no se aplica en SQLite. Elige una opción y escríbela en el PR:
   - **Opción mínima (recomendada):** agregar un comentario en la migración `2026_11_12_100001_...` y declarar en la DoD que la restricción física se verifica solo en MySQL; la protección de la aplicación (SoftDeletes) sí está cubierta por `test_eliminar_producto_conserva_kardex`.
   - **Opción completa:** un segundo job de CI, `phpunit-mysql`, con `services: mysql:8.0` que ejecute solo `--filter=test_eliminar_producto_conserva_kardex` y un test nuevo `test_borrado_fisico_de_producto_con_kardex_es_rechazado_en_mysql` (marcado con `#[RequiresPhpExtension('pdo_mysql')]` y saltado si el driver no es mysql).

**Criterio de cierre:** el CI del PR muestra dos pasos separados ("Regresión…" y "Suite completa"), ambos en verde.
**Commit:** `test(ci): suite de regresión del Incremento 1 en paso dedicado y corrección de fixtures (DEF-18, DEF-19)`

---

### T-1.9 Script reproducible de latencia
- **Rama:** `chore/script-mediciones`
- **Autor:** Alan · **Revisor:** Luis
- **Criterios:** C12

**Pasos:**
1. Crea `scripts/medir-latencia.php`: un comando que se ejecuta con `php scripts/medir-latencia.php --base=http://127.0.0.1:8000 --n=50`, que:
   - Inicia sesión como `cajero@gestisoft.cl` / `cajero1234` (usuarios del seeder; comprueba las credenciales en el README y en `NegociosYProductosSeeder`) guardando la cookie y el token CSRF.
   - Abre turno si no hay uno (POST `/caja/abrir`, `monto_inicial` 50000).
   - Ejecuta N veces `GET /pos/search?q=<término del seeder>` y N veces `POST /pos/checkout` con 1 unidad de un producto con stock suficiente.
   - Mide cada petición con `hrtime(true)` y escribe un CSV `producto/semana-14/mediciones/latencias-AAAAMMDD-HHMM.csv` con las columnas `operacion,muestra,ms`.
   - Calcula e imprime n, mínimo, promedio, p90, p95 y máximo con el método **nearest-rank** (`ceil(p/100 * n)`), y guarda ese resumen en `...-resumen.txt` junto al entorno: `php -v`, `DB_CONNECTION`, sistema operativo, CPU y RAM si se pueden obtener.
   - Alternativa aceptable: un script bash con `curl -w '%{time_total}'`. Lo importante es que el CSV y el resumen salgan del script, sin pasos manuales.
2. **Ejecución:** con la app levantada (`php artisan migrate:fresh --seed && php artisan serve`), corre el script. Si el agente **no puede** levantar la app con MySQL, ejecútalo con SQLite y declara ese entorno. **Nunca escribas cifras que no salgan del script.**
3. Haz commit del script **y** de su salida.
4. Documenta en el PR que la medición es local, sin red real, y que no representa producción.

**Commit:** `chore(calidad): script reproducible de latencia con salida CSV y percentiles`

---

## FASE 2 — Documentos

> Requisito: todos los PR de la fase 1 fusionados. Ten a mano el número de cada PR y el nombre exacto de cada test, porque los documentos deben citarlos.

### T-2.1 Crear `docs/guia-semana14.md` (fuente única)
- **Rama:** `docs/guia-semana14`
- **Autor:** Leonel · **Revisor:** Rodrigo
- **Criterios:** todos los grupales (C1–C16)

**Estructura obligatoria** (un encabezado por criterio de la rúbrica, en este orden). Toma el contenido válido de `docs/guia-semana13.md` y corrige lo indicado:

| Sección de la guía | Criterio | Qué debe contener | Correcciones respecto de `guia-semana13.md` |
| --- | --- | --- | --- |
| Encabezado | — | Equipo, roles, versión `v0.2.0-rc2`, commit del tag, **defensa: Semana 14** | La línea 14 decía "Semana 15" |
| 1. Retroalimentación de la 2.ª defensa y evolución | C1 | Tabla OBS → decisión → artefacto modificado → **enlace a PR/commit** → estado. Una sola numeración (usa la del .md: OBS-18 a OBS-28) y agrega **OBS-29** (creación de admin → ADR-06 → DEF-16) y **OBS-30** (SPIKE-02 sin resultado → ficha actualizada) | Agregar la columna de enlace. Quitar "Cerrado" si no hay enlace |
| 2. Objetivo, hipótesis y señal | C2 | Objetivo del Incremento 2, límites. H-01, H-03, H-04 con: hipótesis, señal, **evidencia obtenida**, **qué falta validar**, decisión | H-01: "Evidencia de laboratorio (role-playing interno); validación con dueños: pendiente / realizada el <fecha>". H-03: quitar "8 s / 45 s / 5 ensayos" salvo que exista un registro en `investigacion/` (si existe, enlazarlo) |
| 3. Alcance y Product Backlog refinado | C3 | Incluye / posterga / excluye; backlog ordenado con **defectos DEF-11 a DEF-19** y su prioridad; capacidad real usada (horas) | Igualar el backlog en .md y .docx (7 ítems + defectos nuevos) |
| 4. Versión candidata reproducible | C4 | Tag, Release, comando `git checkout v0.2.0-rc2`, enlace al CI del tag, usuarios de prueba | Nuevo |
| 5. Corte vertical del Incremento 2 | C5 | Diagrama del flujo F-03 (ya existe en mermaid), capas atravesadas e integración con el Incremento 1 | Conservar |
| 6. Comportamiento e integridad del estado | C6 | Lista de invariantes con su test: (a) stock = Σ Kardex; (b) venta ⇒ turno abierto; (c) turno cerrado inmutable; (d) total del turno = Σ ventas por canal; (e) importes solo del servidor | Nuevo. Cada invariante con `Archivo::test` |
| 7. Criterios de aceptación: recorrido normal | C7 | AC-CAJA-01 a 03, AC-KARDEX-02 en Gherkin, cada uno con **"Verificado por: `Archivo::test`"** | Agregar la línea "Verificado por" |
| 8. Alternativos, errores y bordes | C8 | AC-CAJA-04 a 09, AC-07-REV, AC-SEC-POS-01, AC-SEC-KARDEX-01, AC-SEC-03, AC-USR-01, con "Verificado por" | Agregar los AC nuevos (sección 3.3 de este plan) |
| 9. Regresión del Incremento 1 | C9 | Tabla comportamiento → riesgo de regresión → test del grupo `regresion` → resultado; comando `php artisan test --group=regresion`; enlace al paso del CI. **Incluir al menos una regresión detectada y corregida** (candidatas reales: DEF-08, falso positivo en `POSTest`, y DEF-19, fixture `monto_apertura`) | Reemplazar "REG-CAJA-01" por el grupo real |
| 10. Pruebas automatizadas y evidencia | C10 | Número real de tests y aserciones **copiado de la salida del CI del tag**, enlace al run, tabla test → AC/DEF/RSK | Actualizar "64 / 234" con el número real |
| 11. Definition of Done y estabilización | C11 | Las 6 dimensiones, con estado **Cumplido / Parcial** y su evidencia enlazada. Tabla de defectos DEF-01 a DEF-19 con estado real; los no resueltos, como "Abierto" con su plan | Quitar los "Done" sin evidencia |
| 12. Atributos de calidad | C12 | Por atributo: condición, **un único umbral**, método (script), entorno, resultado (copiado del `-resumen.txt`), cumple / no cumple | Unificar umbrales: búsqueda p95 ≤ 150 ms; checkout p95 ≤ 500 ms; estado del turno p95 ≤ 300 ms. Si el equipo prefiere otros, cámbialos en todos los archivos |
| 13. Seguridad y privacidad | C13 | Controles → riesgo → test: RBAC, multi-tenant, C1, C4, DEF-13, DEF-15, ADR-06, ausencia de secretos (`.env` en `.gitignore`), `APP_DEBUG=false` en demo | Agregar DEF-13, DEF-15 y ADR-06 |
| 14. Repositorio, CI y revisión por pares | C14 | Tabla PR → autor → revisor → comentario relevante → enlace; captura de la protección de `main`; job y pasos del CI (**PHP 8.4**) | Corregir "PHP 8.3" (OBS-24). Las REV-xx deben enlazar a comentarios de PR |
| 15. Arquitectura, riesgos y decisiones | C15 | Drivers DA-06 a DA-11, ADR-01 a 07 (enlace a cada archivo), riesgos RSK-07 a 16 con enlace al registro; justificar que se conserva el monolito | REV-11: el nombre del negocio viene de `negocio_nombre` (backend), no de `auth.user.negocio.name` |
| 16. Demostración, limitaciones y próximos pasos | C16 | Guion corto, reparto de la demo, tabla **Logrado / Pendiente / Riesgo vigente**, propuesta del Incremento 3 (PBI-05, retiros, alertas por umbral, piloto en terreno) ligada a la evidencia. Frase explícita: "versión candidata, no liberación final" | Nuevo |
| 17. Bitácoras individuales | C17–C20 | Enlace a `bitacoras/semana-14/<nombre>.md` de cada integrante; **no** copiar su contenido | Ver T-3.2 |
| Anexo A. Comprobación final | — | Cada pregunta con Sí / Parcial / No y enlace | Respuestas reales |

**Reglas de redacción:** frases cortas, cifras con unidad, cada afirmación con un enlace relativo al archivo o a la URL del PR o run. Sin adjetivos como "garantía matemática", "erradicación total", "100% blindado".

**Al terminar:**
1. Agrega al inicio de `docs/guia-semana13.md`: `> Documento histórico de la Semana 13. La versión vigente es [guia-semana14.md](guia-semana14.md).` No borres el archivo.
2. Exporta el .docx oficial, si `pandoc` está disponible: `pandoc docs/guia-semana14.md -o "docs/referencias/Guía de Trabajo en Equipo - Semana 14 - GestiSoft.docx"`. Si no está disponible, anótalo como pendiente humano. **No edites** el .docx antiguo de la Semana 13: agrega en la guía una nota que diga que fue reemplazado.

**Commit:** `docs: guía semana 14 como fuente única alineada a la rúbrica de la tercera defensa`

---

### T-2.2 Hipótesis y validación (`investigacion/validacion-h01.md`)
- **Rama:** `docs/validacion-h01`
- **Autor:** Rodrigo · **Revisor:** Alan
- **Criterios:** C2, C16

**Pasos:**
1. Cambia el título y el veredicto: "Confirmada" pasa a ser **"Evidencia de laboratorio (simulación interna del equipo)"**.
2. Sección 4, escenario 1, paso 1: el texto dice "Redirección inmediata a `/pos`", pero `RoleSecurityTest::test_cajero_no_puede_acceder_a_inventario_retorna_*` comprueba un **403**. Comprueba en el código y en el test cuál es el comportamiento real y escribe ese.
3. Las calificaciones "4/5" y "5/5" deben decir explícitamente: "puntuación heurística asignada por el equipo; no es una medición de satisfacción de usuarios".
4. Escenario 3: cambia "IDOR C5" por "RSK-10 (aislamiento de turnos entre cajeros)", porque C5 es la creación de administradores.
5. Agrega la sección **"7. Sesiones con dueños reales"** con la tabla del procedimiento de `docs/plan-correcciones-gestisoft-2dadefensa.md` (L200–220):

```markdown
| Comercio (anonimizado) | Fecha | Versión probada | Confianza antes (1–5) | Confianza después (1–5) | ¿Delegaría la caja? | Qué le faltaría |
| --- | --- | --- | --- | --- | --- | --- |
| ENT-01 minimarket | [COMPLETAR POR EL EQUIPO] | v0.2.0-rc2 | [ ] | [ ] | [ ] | [ ] |
| ENT-02 vestuario  | [COMPLETAR POR EL EQUIPO] | v0.2.0-rc2 | [ ] | [ ] | [ ] | [ ] |
| ENT-03 bazar      | [COMPLETAR POR EL EQUIPO] | v0.2.0-rc2 | [ ] | [ ] | [ ] | [ ] |
```

   El agente **deja los marcadores**. Si el equipo no alcanza a hacer las sesiones antes de la defensa, debe reemplazar la tabla por una frase con la fecha comprometida y el responsable.
6. Sección 6: agrega la fecha, el responsable y el criterio del piloto (SUS ≥ 75).
7. H-03: si no hay un registro de los "5 ensayos", agrega un protocolo breve, en `investigacion/ensayos-h03.md`, para cronometrar la apertura y el arqueo con 5 ensayos, con una tabla vacía `[COMPLETAR POR EL EQUIPO]`.

**Commit:** `docs(investigacion): declarar con precisión el alcance de la validación de H-01 y H-03`

---

### T-2.3 Fichas de backlog
- **Rama:** `docs/backlog-actualizado`
- **Autor:** Rodrigo · **Revisor:** Luis
- **Criterios:** C1, C3

**`producto/backlog/SPIKE-02.md`:**
1. L10: cambia `tenant_id` por `negocio_id`. L14: cambia "Laravel 11" por "Laravel 13".
2. Sección 4: el artefacto queda como `only(['id','name','email','role','negocio_id'])` (igual que `HandleInertiaRequests.php`).
3. Agrega una sección **"6. Resultado y decisión (cerrado el AAAA-MM-DD)"** con: hallazgo (`$request->user()` serializaba el modelo completo), decisión (lista blanca de 5 campos), evidencia (`RoleSecurityTest::test_inertia_no_comparte_campos_sensibles`, commit de C4) y efecto en el trabajo (cierra RSK-14 y DEF-07).

**`producto/backlog/PBI-03.md`:** reescríbelo completo con la misma plantilla de las demás fichas:
- Historia: "Como **dueño/administrador**, quiero que el cajero declare el efectivo contado **sin ver el total esperado** (arqueo ciego) y que el sistema calcule el descuadre, para auditar la caja sin depender de la honestidad del conteo".
- Incluye: lo de la sección 6.1 de la guía (apertura con `monto_inicial`, bloqueo del POS, enlace de la venta al turno, arqueo ciego, diferencia inmutable, auditoría mensual o histórica, acta imprimible).
- No incluye: retiros parciales, varias cajas por sucursal, conciliación bancaria.
- Requisitos: los RF que correspondan (revisa `producto/semana-3/requisitos.md`; si faltan RF de caja, agrégalos ahí con ID nuevo).
- Criterios: AC-CAJA-01 a AC-CAJA-09.
- Estimación: 8 puntos (igual que la guía). Estado: **Implementado en el Incremento 2**, con enlace a los PR #15 a #18 y a los PR de la fase 1.
- Elimina la nota "Excluido del MVP de la Semana 4" o déjala como historial: "(Semana 4: excluido por capacidad; repriorizado en la Semana 13 por OBS-18)".

**`producto/backlog/PBI-05.md`:** agrega "**Estado:** Postergado al Incremento 3. **Motivo:** la evidencia de H-01 y las entrevistas priorizan el control de caja (PBI-03); el dashboard necesita historial de turnos cerrados (dependencia de datos)".

**`producto/backlog/PBI-04.md`:** agrega la referencia a ADR-06 y AC-USR-01.

**Commit:** `docs(backlog): actualizar SPIKE-02, PBI-03, PBI-04 y PBI-05 al estado real del Incremento 2`

---

### T-2.4 Mediciones de calidad
- **Rama:** `docs/mediciones-reproducibles`
- **Autor:** Alan · **Revisor:** Rodrigo
- **Depende de:** T-1.9 con salida commiteada
- **Criterios:** C12

**Pasos:**
1. En `producto/semana-3/mediciones-calidad.md`, agrega arriba: `> Reemplazado por producto/semana-14/mediciones-calidad.md`. No borres el histórico.
2. Crea `producto/semana-14/mediciones-calidad.md` con:
   - Entorno, copiado literal del `-resumen.txt`.
   - Procedimiento: el comando exacto del script.
   - Tabla por operación: n, mínimo, promedio, p90, p95, máximo, **umbral único** (el de T-2.1, sección 12), cumple / no cumple. **Cada cifra copiada del resumen**, sin calcular a mano.
   - Enlace al CSV crudo.
   - Accesibilidad por teclado: conserva el checklist existente, comprobando que los atajos coincidan con `POS/Index.jsx`: busca `F2`, `F4`, `F8`, `F9` en el archivo y corrige el checklist si alguno no existe.
   - Sección "Limitaciones": medición local, sin red real, sin carga concurrente.
3. Corrige la inconsistencia registrada: el antiguo reporte decía mínimo 48 / promedio 78 en la tabla y 65 / 81,2 en los datos crudos, cuando el promedio real de esas 50 muestras es 83,1 ms. Explícalo en una línea: "El reporte de la Semana 13 tenía estadísticas inconsistentes; se reemplaza por la salida del script".

**Commit:** `docs(calidad): mediciones reproducibles generadas por script con umbrales únicos`

---

### T-2.5 Trazabilidad
- **Rama:** `docs/trazabilidad-incremento-2`
- **Autor:** Luis · **Revisor:** Alan
- **Criterios:** C15, C10

**Pasos:** reescribe `producto/semana-3/trazabilidad.csv` (o crea `producto/semana-14/trazabilidad.csv` y deja una nota de reemplazo en el antiguo) con estas columnas:

```
ID_fila,Evidencia/Observación,Necesidad,Decisión(DEC/ADR),Requisito(RF/RNF),Criterio(AC),PBI/DEF,Riesgo(RSK),Prueba(archivo::método),PR,Estado
```

- **Una fila por AC** (AC-CAJA-01 … 09, AC-07-REV, AC-KARDEX-02, AC-SEC-POS-01, AC-SEC-KARDEX-01, AC-SEC-03, AC-USR-01, y los del Incremento 1 que ya existen).
- Una fila por cada DEF-01 a DEF-19, ligada a su OBS, test y PR.
- Una fila por cada hipótesis H-01, H-03 y H-04, ligada a su evidencia (archivo en `investigacion/`).
- `Prueba` debe ser un `Archivo::método` que exista. Compruébalo con `grep -rn "function <método>" gestisoft-app/tests`. Si una fila no tiene test, escribe `SIN TEST` y estado `Pendiente`.
- `PR` = `#<número>`.
- `Estado` ∈ {`Verificado`, `Pendiente`, `Postergado`}.

**Validación automática obligatoria:** agrega `scripts/validar-trazabilidad.php` (o `.py` si hay Python), que lea el CSV y falle si algún `archivo::método` no existe en `tests/`. Ejecútalo y pega la salida en el PR. **Opcional:** súmalo como paso del CI.

**Commit:** `docs(trazabilidad): matriz bidireccional del Incremento 2 con pruebas verificadas por script`

---

### T-2.6 Registro de riesgos
- **Rama:** `docs/registro-riesgos-v2`
- **Autor:** Leonel · **Revisor:** Luis
- **Criterios:** C15, C16

**Pasos:**
1. Agrega a `riesgos/registro-v1.csv` y a `riesgos/registro-riesgos-v1.md` las filas RSK-07 a RSK-15, copiándolas de la sección 18 de `docs/guia-semana13.md` con las mismas columnas que RSK-01 a RSK-06.
2. Agrega los riesgos nuevos:
   - **RSK-16:** apertura concurrente sin restricción física (DEF-17). Estado: Mitigado parcialmente o Cerrado, según T-1.7.
   - **RSK-17:** H-01 sin validación con dueños reales. Estado: **Abierto** hasta que la tabla de T-2.2 tenga datos.
   - **RSK-18:** Kardex incompleto por ventas sin movimiento (DEF-11). Estado: Cerrado con PR #.
3. A cada riesgo cerrado agrégale una columna o campo "Evidencia" con el test o PR.
4. **No marques todos como cerrados.** Los que dependan de evidencia humana quedan abiertos.

**Commit:** `docs(riesgos): registro actualizado RSK-07 a RSK-18 con evidencia y estado real`

---

### T-2.7 DoD, defectos y Anexo A
- Incluido en T-2.1 (secciones 11 y Anexo A). **Autor de la revisión de contenido:** Alan · **Revisor:** Leonel.
- **Procedimiento:** para cada dimensión de la DoD, escribe una fila con condición, evidencia (enlace) y estado. Regla: **sin enlace, no hay Cumplido**. Para el Anexo A, cada "Sí" debe tener un enlace. Si falta, responde "Parcial" y explica qué falta.

---

### T-2.8 README
- **Rama:** `docs/readme-version-candidata`
- **Autor:** Luis · **Revisor:** Rodrigo
- **Criterios:** C4, C9

**Agregar al `README.md`:**
1. Sección "Versión candidata": `git checkout v0.2.0-rc2`, enlace al Release y al run del CI.
2. En "Pruebas": `php artisan test` (suite completa) y `php artisan test --group=regresion` (regresión del Incremento 1), con el número de tests de cada uno.
3. En "Mediciones": cómo ejecutar `scripts/medir-latencia.php`.
4. Nota de seguridad: `APP_DEBUG=false` para demo o producción.
5. **Prueba en equipo limpio:** un integrante que no programó la app (por ejemplo, Rodrigo) sigue el README desde cero y anota en el PR cada paso que faltó. Esta tarea es humana; el agente deja el checklist en el PR.

**Commit:** `docs(readme): versión candidata, comando de regresión y mediciones reproducibles`

---

### T-2.9 Guion de la defensa
- **Rama:** `docs/guion-defensa3`
- **Autor:** Leonel · **Revisor:** Alan
- **Depende de:** T-2.1 a T-2.8
- **Criterios:** C16, C17–C20

**Pasos en `docs/guia-presentacion-defensa3.md`:**
1. Actualiza las diapositivas 19 a 26 con los números reales (tests, mediciones, riesgos y PR).
2. Diapositiva 23: muestra la tabla de PR con 4 autores y 4 revisores.
3. Sección 3: cambia "Conducida y operada íntegramente por Leonel Ayala" por un reparto en el que cada integrante opera en vivo su parte (Rodrigo: Kardex en ventas y auditoría; Alan: tests de bordes y CI de regresión; Luis: interfaz de errores y rutas; Leonel: concurrencia de turnos y versión candidata).
4. Agrega una diapositiva "Logrado / Pendiente / Riesgos vigentes" antes del cierre.
5. Sección 4 (respuestas individuales): cada integrante debe poder explicar **una falla o regresión concreta** de su aporte y su test (el criterio C18 lo pide). Deja un marcador por integrante para que lo redacte él mismo.

**Commit:** `docs(defensa): guion actualizado con evidencia real y demo repartida`

---

## FASE 3 — Autoría y revisión

### T-3.1 Revisiones reales en cada PR
- **Quién:** todos (humanos). El agente solo prepara los PR.
- **Regla:** cada PR de las fases 1 y 2 debe tener:
  1. Una descripción con la plantilla 0.2.
  2. Al menos **un comentario técnico** del revisor, específico y no genérico. Ejemplo: "¿qué pasa si `quantity` llega como string?", y no "LGTM".
  3. Una aprobación del revisor asignado.
  4. La fusión hecha por alguien distinto del autor.
- **Evidencia para la guía (sección 14):** tabla `PR | Título | Autor | Revisor | Comentario relevante (enlace) | CI`.

### T-3.2 Bitácoras de la Semana 14
- **Quién:** cada integrante edita **su propio** archivo `bitacoras/semana-14/<nombre>.md` desde su cuenta.
- **El agente solo puede:** agregar en la sección "Trazabilidad" de cada bitácora las líneas de enlace a los PR, commits y tests de ese integrante, en un PR propio (`docs/bitacoras-enlaces`), con este formato:
  `* **Evidencia:** [PR #NN – título](url) · `tests/Feature/X.php::test_y` | **Qué demuestra:** <una frase factual>`
- Revisa que lo que cada bitácora dice haber hecho coincida con los PR enlazados. Si no coincide, **no lo corrijas tú**: anótalo en tu informe final para que el integrante lo ajuste.

### T-3.3 Ensayo de la demo repartida
- Tarea humana. Criterio: tiempo total dentro del límite y cada integrante opera su parte sin ayuda.

---

## FASE 4 — Congelar la versión candidata

### T-4.1 Tag y Release
- **Autor:** Leonel · **Revisor:** Alan
- **Requisitos:** todas las fases anteriores fusionadas y el CI de `main` en verde.

```bash
git checkout main && git pull
cd gestisoft-app && php artisan test && php artisan test --group=regresion && cd ..
git tag -a v0.2.0-rc2 -m "GestiSoft v0.2.0-rc2 – Versión candidata Incremento 2 (Tercera defensa)"
git push origin v0.2.0-rc2
```

Crea el Release en GitHub (Releases → Draft new release → tag `v0.2.0-rc2`, marcado como **pre-release**) con estas notas:

```markdown
## GestiSoft v0.2.0-rc2 — Versión candidata del Incremento 2
**No es una liberación final.**

### Nuevo resultado de usuario
Apertura de turno con fondo inicial, ventas ligadas al turno, arqueo ciego, conciliación de descuadres, auditoría mensual/histórica y acta imprimible (PBI-03).

### Defectos corregidos
DEF-01 … DEF-19 (enlaces a PR).

### Verificación
- CI: <enlace al run del tag> — Regresión: N tests · Suite completa: M tests / K aserciones.
- Mediciones: producto/semana-14/mediciones-calidad.md

### Limitaciones conocidas
- H-01 validada en laboratorio; validación con dueños: <estado>.
- <DEF-17/DEF-18 si quedaron como limitación>.

### Cómo ejecutar
Ver README → "Versión candidata".
```

### T-4.2 Coherencia de la versión en todos los documentos
- **Rama:** `docs/version-rc2` (antes del tag; si hay que corregir después del tag, crea `v0.2.0-rc3` en vez de mover el tag).
- Busca y revisa: `grep -rn "v0.2.0" --include=*.md .` Todas las menciones deben apuntar al mismo tag y commit.

### T-4.3 Verificación final (la ejecuta el agente y la entrega como informe)

Ejecuta y pega la salida de cada comando en `docs/evidencias/verificacion-final.md`:

```bash
git describe --tags                                   # debe mostrar v0.2.0-rc2
cd gestisoft-app
php artisan test --group=regresion                    # todo en verde
php artisan test                                      # todo en verde; anota el total
php artisan route:list | grep -E "users|inventory"   # sin show/edit/update inexistentes
grep -rn "monto_apertura" tests                       # sin resultados
grep -rn "tenant_id\|Tenant\|justificacion" ../producto ../docs/guia-semana14.md   # sin resultados
php ../scripts/validar-trazabilidad.php               # sin errores
cd ..
grep -rn "Semana 15" docs/guia-semana14.md            # sin resultados
grep -rn "PHP 8.3" docs/guia-semana14.md              # sin resultados en la sección del CI
```

---

## 4. Checklist final (marcar con evidencia)

| # | Ítem | Criterio | Evidencia |
| --- | --- | --- | --- |
| 1 | Tag `v0.2.0-rc2` y Release pre-release publicados | C4 | URL del Release |
| 2 | CI del tag en verde con paso de regresión separado | C9, C10, C14 | URL del run |
| 3 | DEF-11 a DEF-16 cerrados con su test | C6, C8, C13 | Filas en la trazabilidad |
| 4 | DEF-17 y DEF-18 cerrados o declarados como limitación | C11, C16 | Guía, sección 16 |
| 5 | `guia-semana14.md` como fuente única; .docx exportado desde ella | C1, C15 | Archivos |
| 6 | SPIKE-02, PBI-03, PBI-04 y PBI-05 actualizados | C1, C3 | PR |
| 7 | Hipótesis redactadas sin exagerar; tabla de sesiones con dueños completa o con fecha comprometida | C2 | `validacion-h01.md` |
| 8 | Mediciones generadas por script, con CSV crudo y umbral único | C12 | `producto/semana-14/` |
| 9 | Trazabilidad validada por script | C15 | Salida del script |
| 10 | Registro de riesgos RSK-01 a RSK-18 con estado real | C15 | CSV |
| 11 | DoD y Anexo A con enlace en cada "Cumplido" o "Sí" | C11 | Guía |
| 12 | 4 integrantes con al menos 1 PR propio y 1 revisión con comentario | C14, C17 | Tabla de PR |
| 13 | `main` protegida; ningún PR fusionado por su autor | C14 | Captura |
| 14 | Demo repartida y ensayada con cronómetro | C16, C18–C20 | Guion |

---

## 5. Informe final que debe entregar el agente

Al terminar, crea `docs/evidencias/informe-agente.md` con:
1. La lista de ramas y PR creados (número, título, autor previsto, estado).
2. Las tareas completadas y las que no, y el motivo.
3. **Pendientes humanos:** todo marcador `[COMPLETAR POR EL EQUIPO]`, las decisiones pendientes (ADR-06 si no se respondió), las capturas, la protección de `main`, las sesiones con dueños, el ensayo y las bitácoras.
4. Las discrepancias encontradas entre este plan y el código real, y cómo se resolvieron.
5. La salida de la verificación final (T-4.3).
