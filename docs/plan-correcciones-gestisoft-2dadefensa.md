# Plan de correcciones GestiSoft – Tercera demostración

12 de noviembre de 2026

## Resumen

La segunda demostración obtuvo 79/112 (4,8) porque 11 de los 16 criterios quedaron en "Regular" (4 pts). Casi todos esos 4 se explican por cinco problemas concretos: integridad del POS y del Kardex, pruebas que no prueban lo que dicen, falta de CI, un documento guía incompleto o desalineado con el código, y una hipótesis de valor sin validar con usuarios.

Corregirlos ataca directamente los criterios 2, 4, 5, 6, 8, 9, 10, 11, 12, 13 y 15. Las correcciones se hacen sobre `main` en ramas `fix/*` con PR revisado por otro integrante, para que también quede evidencia de revisión entre pares (criterio 14).

| Criterio | Causa principal del 4 | Sección del plan |
| --- | --- | --- |
| 2. Hipótesis y señal | La señal mide HTTP 403, no la confianza del dueño | Validación H-01 |
| 4. Backlog | SPIKE-02 sin resultado ni decisión | Documento |
| 5. Arquitectura | Modelo usa Tenant/tenant_id/justificacion; sin transacción en ajustes | Código C2 + Documento |
| 6. Reproducible | README con `cd` erróneo y versiones PHP/Laravel incorrectas | Documento |
| 8. Funcional | Importes del cliente; motivo no obligatorio; sin transacción | Código C1, C2 |
| 9. Aceptación | Sin pruebas de error/borde para AC-07 | Pruebas |
| 10. Pruebas | `POSTest` envía `cart`; sin logs ni CI | Pruebas |
| 11. Calidad | Carrito descrito como AJAX; p95 sin datos crudos | Pruebas + Documento |
| 12. Seguridad | Importes del cliente; Kardex se borra en cascada | Código C1, C3, C4 |
| 13. Trazabilidad | Modelo documentado ≠ implementado; faltan escenarios de fallo | Documento |
| 15. Validación y riesgos | Sin validación con usuarios; 8 campos vacíos | Validación H-01 + Documento |

## Correcciones de código

Las cinco correcciones siguen pendientes en `main` (revisado al 12-nov, después del merge de PBI-03). C1 es la más urgente: ahora las ventas también alimentan el arqueo de caja, así que un precio manipulado desde el navegador descuadra el turno.

### C1. El servidor calcula precios, neto, IVA y vuelto (criterios 8 y 12)

Archivo: `app/Http/Controllers/POSController.php`, método `checkout()`. Dejar de aceptar `price`, `total`, `neto`, `iva` y `change` desde el cliente; el servidor los obtiene del `Product` bloqueado.

```php
$validated = $request->validate([
    'items' => 'required|array|min:1',
    'items.*.product_id' => 'required|integer|distinct',
    'items.*.quantity' => 'required|integer|min:1',
    'payment_method' => 'required|in:Efectivo,Débito,Crédito,Transferencia',
    'amount_received' => 'nullable|integer|min:0',
]);

return DB::transaction(function () use ($validated, $turnoActivo) {
    $total = 0;
    $lineas = [];
    foreach ($validated['items'] as $item) {
        $product = Product::whereKey($item['product_id'])->lockForUpdate()->firstOrFail();
        if ($product->stock < $item['quantity']) {
            throw ValidationException::withMessages(['checkout' => "Stock insuficiente: {$product->name}"]);
        }
        $subtotal = $product->price * $item['quantity'];
        $total += $subtotal;
        $lineas[] = [$product, $item['quantity'], $subtotal];
    }
    $neto = (int) round($total / 1.19);
    $iva = $total - $neto;
    // Efectivo: amount_received obligatorio y >= $total; change = amount_received - $total
    // Crear Venta con $total/$neto/$iva, luego descontar stock y crear VentaDetalle con $product->price
    $turnoActivo->sincronizarTotales();
    return back()->with('success', 'Venta procesada exitosamente.');
});
```

- `firstOrFail()` con el scope `HasNegocio` también impide vender productos de otro negocio.
- El frontend puede seguir mostrando su cálculo, pero solo como vista previa.

### C2. Motivo obligatorio y ajuste atómico (criterios 5, 8 y 9)

Archivo: `app/Http/Controllers/ProductController.php`, método `update()`. La regla `required_if:stock,!=X` nunca se activa: Laravel compara contra el texto literal "!=X".

```php
'motivo' => [Rule::requiredIf(fn () => (int) $request->stock !== $product->stock), 'nullable', 'string', 'max:255'],

DB::transaction(function () use ($product, $validated, $request) {
    $product = Product::whereKey($product->id)->lockForUpdate()->first();
    $anterior = $product->stock;
    $product->update(Arr::except($validated, 'motivo'));
    if ($product->wasChanged('stock')) {
        MovimientoStock::create([... 'cantidad_anterior' => $anterior, 'motivo' => $request->motivo]);
    }
});
```

Aplicar lo mismo en `store()`, para que el producto y su movimiento de "Inventario Inicial" se creen juntos.

### C3. El Kardex no se puede borrar (criterio 12)

Hoy `movimiento_stocks.product_id` usa `cascadeOnDelete()` y `destroy()` borra físicamente el producto, así que el historial desaparece.

- Agregar `SoftDeletes` a `Product` (nueva migración con `deleted_at` en `products`).
- Nueva migración que cambie la FK de `movimiento_stocks.product_id` y `user_id` a `restrictOnDelete()`.
- No editar la migración original: crear una nueva, porque ya está aplicada.

### C4. Exponer solo lo necesario a React (cierra SPIKE-02, criterios 4 y 12)

Archivo: `app/Http/Middleware/HandleInertiaRequests.php`. Hoy envía `$request->user()` completo, lo que contradice el criterio de éxito del propio SPIKE-02.

```php
'auth' => [
    'user' => $request->user()?->only(['id', 'name', 'email', 'role']),
],
```

### C5. Creación de administradores (criterio 12)

Decidir y dejarlo escrito en un ADR-05. La opción más simple de defender es mantener la creación de admin, porque está en el alcance de `PBI-04.md`, y agregarla explícitamente al flujo F-01, a AC-08 y a un test. La otra opción es restringir `UserController::store()` a `cajero`.

## Pruebas y CI

Cada corrección de código lleva al menos un test que falle antes del cambio y pase después; eso es lo que el criterio 10 pide como evidencia. La suite tiene que correr sola en GitHub Actions y el log de cada ejecución queda como registro reproducible.

### Tests a corregir o agregar

| Test | Archivo | Qué demuestra | Criterios |
| --- | --- | --- | --- |
| Corregir `test_no_se_puede_vender_producto_sin_stock`: enviar `items` (no `cart`) y abrir un turno antes | `POSTest.php` | Que el rechazo viene de la regla de stock, verificando el mensaje "Stock insuficiente" | 9, 10 |
| `test_venta_ignora_precio_enviado_por_cliente` | `POSTest.php` | Se envía `price: 1` y la venta queda con el precio real del producto | 8, 12 |
| `test_efectivo_insuficiente_es_rechazado` | `POSTest.php` | `amount_received` menor al total devuelve error y no crea venta | 9 |
| `test_no_se_puede_vender_producto_de_otro_negocio` | `POSTest.php` | Venta con `product_id` de otro tenant falla y no descuenta stock | 12 |
| `test_ajuste_de_stock_sin_motivo_es_rechazado` | `InventoryTest.php` | Error en `motivo`, el stock no cambia y no hay movimiento | 8, 9 (AC-07) |
| `test_cambio_de_nombre_sin_cambio_de_stock_no_exige_motivo` | `InventoryTest.php` | Caso alternativo de AC-07 | 9 |
| `test_eliminar_producto_conserva_kardex` | `InventoryTest.php` | Tras borrar, los `movimiento_stocks` siguen existiendo | 12 |
| `test_inertia_no_comparte_campos_sensibles` | `RoleSecurityTest.php` | Las props `auth.user` solo traen id, name, email y role | 4, 12 |

Para probar la atomicidad del ajuste (fallo del Kardex), basta un test que fuerce una excepción en `MovimientoStock::creating` y verifique que el stock no cambió.

### Workflow de GitHub Actions

Crear `.github/workflows/tests.yml` en la raíz del repo:

```yaml
name: tests
on: [push, pull_request]
jobs:
  phpunit:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: gestisoft-app
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: pdo_sqlite
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: composer install --no-interaction --prefer-dist
      - run: npm ci && npm run build
      - run: cp .env.example .env && php artisan key:generate
      - run: php artisan test
```

`phpunit.xml` ya usa SQLite en memoria, así que no hace falta un servicio MySQL. Después, activar en GitHub la regla de rama que exige que el check `tests` pase antes de hacer merge a `main`.

### Evidencia para la demo

- Enlace a la ejecución verde de Actions del commit candidato.
- Badge de estado en el README.
- Una tabla en `mediciones-calidad.md` que distinga prueba planificada de resultado obtenido, con fecha y commit.

## Documento guía y README

El documento entregado se evalúa tal cual, así que no puede quedar ningún "Escriba aquí..." ni nada que contradiga el código. Antes de entregar, buscar ese texto con Ctrl+F: hoy aparece en 8 celdas.

### Guía de trabajo en equipo (.docx entregado)

| Sección | Cambio | Criterios |
| --- | --- | --- |
| 5. Hipótesis y señal | Mantener los 403 como señal técnica y agregar una señal de valor medida con dueños (ver Validación H-01) | 2 |
| 7. Backlog | Registrar el resultado de SPIKE-02 y de SPIKE-03 y explicar los cambios de prioridad desde la semana 9 (entrada de PBI-03) | 4 |
| 13. Contratos | `POST /checkout` recibe solo `items[{product_id, quantity}]`, `payment_method` y `amount_received`; el servidor calcula los montos | 5, 12 |
| 14. Modelo conceptual | `Tenant`/`tenant_id` → `Negocio`/`negocio_id`; `justificacion` → `motivo`; agregar `Product`, `Venta`, `VentaDetalle`, `TurnoCaja`; borrar las 2 filas vacías | 5, 13 |
| 14. Restricciones | "Ajuste de stock y movimiento en una transacción; Kardex sin borrado en cascada" | 5, 12 |
| 15. Atributos de calidad | Quitar "AJAX" del carrito (es estado local de React); dejar la búsqueda como la operación medida | 11 |
| 16. ADR | Agregar ADR-03 (cálculo de montos en servidor) y ADR-04 (Kardex inmutable con soft delete) | 5 |
| 17. Spike | Llenar "Decisión esperada" y añadir el resultado obtenido | 4 |
| 18. Riesgos | Agregar columnas de señal y fecha de revisión; nuevos riesgos: manipulación de importes y pérdida de auditoría; borrar las 4 filas vacías | 12, 15 |
| Revisión cruzada | Completar la fila vacía o borrarla | 14 |
| Checklist final | Marcar `[x]` solo lo que de verdad esté cumplido | 15 |

### Mediciones de calidad (`producto/semana-3/mediciones-calidad.md`)

- Guardar los datos crudos de las mediciones de p95 (CSV con las 50 muestras) junto al reporte.
- Describir el procedimiento paso a paso para que otro integrante pueda repetirlo.
- Si es posible, automatizarlo con un script simple (por ejemplo, 50 llamadas a `/pos/search` midiendo tiempos).

### Trazabilidad (`producto/semana-3/trazabilidad.csv`)

Agregar filas que conecten los nuevos riesgos con las decisiones, criterios y tests: manipulación de importes → ADR-03 → criterio de aceptación del checkout → `test_venta_ignora_precio_enviado_por_cliente`, y pérdida de auditoría → ADR-04 → AC-07 → `test_eliminar_producto_conserva_kardex`.

### README

1. Después del `git clone`, agregar `cd GestiSoft` antes de `cd gestisoft-app`.
2. Cambiar "Laravel 11" por "Laravel 13" y "PHP >= 8.2" por "PHP >= 8.3", igual que `composer.json`.
3. Dejar los comandos en orden y completos: `composer install`, `npm install`, `cp .env.example .env`, `php artisan key:generate`, `php artisan migrate --seed`, `npm run build` y `php artisan test`.
4. Agregar usuarios de prueba del seeder (admin y cajero) y el número real de tests.
5. Antes de la demo, que un integrante que no programó la app siga el README en un equipo limpio y anote cualquier paso que falte.

## Validación de la hipótesis H-01

El profesor descontó en los criterios 2 y 15 porque la única evidencia es técnica (HTTP 403). Hace falta una señal medida con dueños reales que diga si la separación de roles les da confianza para delegar la caja.

**Hipótesis:** si el cajero no puede ver ni modificar inventario ni precios, el dueño confiará en dejarlo solo operando la caja.

**Señal de éxito (propuesta):** al menos 2 de 3 dueños, después de usar la app, dicen que dejarían a un empleado solo en caja con GestiSoft y lo califican con 4 o 5 en una escala de 1 a 5.

### Procedimiento (una sesión de unos 20 minutos por dueño)

1. Contactar a los 3 negocios ya entrevistados (`investigacion/registros-anonimizados/`): minimarket, tienda de vestuario y bazar.
2. Antes de la prueba, preguntar: "Del 1 al 5, ¿qué tan tranquilo dejaría hoy a un empleado solo en caja?"
3. El dueño crea un cajero, inicia sesión como ese cajero, intenta entrar a inventario y cambiar un precio, y hace una venta.
4. Después, repetir la pregunta del paso 2 y agregar: "¿Qué le faltaría para delegar la caja?"
5. Registrar las respuestas anonimizadas en `investigacion/validacion-h01.md`, con fecha y versión probada.

### Decisión según resultado

- **Se cumple:** H-01 validada; se continúa con reportería (PBI-05).
- **No se cumple:** priorizar lo que los dueños digan que falta (por ejemplo, el arqueo de PBI-03) antes de agregar funcionalidades nuevas.

Presentar el resultado tal cual, aunque sea negativo. La rúbrica premia interpretar la señal "sin exagerar resultados" y reconocer limitaciones, como que 3 dueños son una muestra pequeña.

## Reparto sugerido y checklist final

El reparto sigue los roles del acuerdo de equipo. Cada PR lo revisa alguien distinto de su autor, para que la revisión entre pares quede registrada en GitHub.

| Tarea | Responsable | Revisa | Orden |
| --- | --- | --- | --- |
| C1 checkout en servidor + C2 motivo y transacción | Leonel Ayala | Alan Troncoso | 1 |
| C3 Kardex inmutable + C4 props de Inertia | Leonel Ayala | Luis Barrios | 2 |
| Tests nuevos y corregidos + workflow de CI | Alan Troncoso | Leonel Ayala | 1 (en paralelo con C1) |
| Frontend: enviar solo `items`, `payment_method` y `amount_received`; mostrar errores del servidor | Luis Barrios | Leonel Ayala | 2 |
| Mediciones de p95 con datos crudos y script | Luis Barrios | Alan Troncoso | 3 |
| Validación H-01 con los 3 dueños | Rodrigo Bertolini | Alan Troncoso | 1 (agendar ya) |
| Documento guía, ADR-03/04, riesgos y trazabilidad | Rodrigo Bertolini y Alan Troncoso | Leonel Ayala | 3 |
| README y prueba de instalación en un equipo limpio | Alan Troncoso | Rodrigo Bertolini | 4 |

### Antes de entregar

- [ ] `php artisan test` pasa en GitHub Actions sobre el commit candidato
- [ ] Existe un tag o release (por ejemplo, `v0.3.0-demo3`) que identifica la versión candidata
- [ ] Ninguna venta acepta montos calculados por el cliente
- [ ] Un ajuste de stock sin motivo es rechazado (probado en vivo y con un test)
- [ ] Borrar un producto no borra su historial de Kardex
- [ ] El .docx no tiene ningún "Escriba aquí..." y el modelo conceptual coincide con las migraciones
- [ ] El checklist del documento solo tiene `[x]` en lo que está cumplido
- [ ] El README funciona de principio a fin en un equipo limpio
- [ ] Está registrado el resultado de la validación H-01, aunque sea negativo
- [ ] Cada integrante puede explicar en la defensa su PR, sus tests y por qué tomó cada decisión
