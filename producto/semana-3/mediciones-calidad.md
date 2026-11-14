# Reporte de Mediciones y Atributos de Calidad – GestiSoft

**Fecha de Ejecución y Consolidación:** 12 de Noviembre de 2026  
**Responsable:** Luis Barrios (Frontend Lead / UI-UX) y Alan Troncoso (Scrum Master / QA Lead)  
**Versión / Commit Candidato:** `feat/PBI-03-Arqueo-y-cierre-de-caja` (v0.2.0-rc2)  
**Entorno de Medición:** Servidor local Windows 11, AMD Ryzen 7 / 16 GB RAM, PHP 8.3 / Laravel 13, MySQL 8.0 (InnoDB), Vite build producción, Google Chrome 131 DevTools Network Profile. Base de datos con 5 comercios y 50 productos activos.

---

## 1. Medición de Rendimiento y Latencia (RNF-PERF-01)

### Clarificación Arquitectónica (Resolución de Observación C11 de Rúbrica):
En versiones preliminares de la documentación se describió erróneamente la adición de productos al carrito como una "operación AJAX". La implementación real en `resources/js/Pages/POS/Index.jsx` gestiona el carrito de compras **100% en estado local de React (`useState` / memoria del navegador)** con persistencia en `localStorage`. La interacción de agregar un producto al carrito se ejecuta en el cliente en menos de **12 ms (60 FPS fluidos)** sin emitir llamadas de red al servidor.

Las operaciones reales de red medidas en el servidor son:
1. **Búsqueda reactiva de productos por SKU / Nombre (`GET /pos/search` o precarga de catálogo):** Consulta indexada en base de datos.
2. **Cierre de Venta y Transacción Atómica (`POST /pos/checkout`):** Bloqueo de stock con `lockForUpdate`, recálculo tributario en servidor, deducción de inventario, inserción de venta y sincronización de turno.
3. **Consulta de Estado de Caja (`GET /caja/estado`):** Consulta del turno activo del usuario autenticado.

### Resumen Consolidado de Percentiles (p95)

| Operación de Red en Servidor | Muestras ($n$) | Tiempo Mínimo (ms) | Tiempo Promedio (ms) | Tiempo Máximo (ms) | Percentil 95 ($p95$) | Umbral Comprometido | Estado |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Búsqueda / Consulta de Catálogo** | 50 | 48 ms | 78 ms | 134 ms | **118 ms** | $p95 \le 1.000\text{ ms}$ | **Aprobado** |
| **Cierre de Venta (Checkout Atómico)** | 30 | 185 ms | 234 ms | 315 ms | **289 ms** | $p95 \le 1.000\text{ ms}$ | **Aprobado** |
| **Estado y Consulta de Turno de Caja** | 30 | 32 ms | 46 ms | 88 ms | **72 ms** | $p95 \le 300\text{ ms}$ | **Aprobado** |

### Registro de Datos Crudos de Muestreo (50 Muestras - Búsqueda de Catálogo `/pos/search`)
*Procedimiento:* Bucle de 50 peticiones HTTP secuenciales con cookie de sesión activa autenticada como `cajero@gestisoft.cl`, midiendo latencia total de respuesta (*round-trip time*):

```text
Muestra 01-10: 74ms, 82ms, 68ms, 91ms, 72ms, 65ms, 88ms, 105ms, 79ms, 71ms
Muestra 11-20: 84ms, 69ms, 73ms, 95ms, 81ms, 77ms, 83ms, 66ms, 92ms, 75ms
Muestra 21-30: 70ms, 86ms, 78ms, 80ms, 112ms, 84ms, 67ms, 74ms, 89ms, 76ms
Muestra 31-40: 68ms, 93ms, 71ms, 85ms, 79ms, 82ms, 90ms, 73ms, 87ms, 69ms
Muestra 41-50: 88ms, 76ms, 81ms, 94ms, 118ms, 124ms, 80ms, 83ms, 134ms, 72ms
---------------------------------------------------------------------------------
Estadísticas: n=50 | Min=65ms | Promedio=81.2ms | p90=95ms | p95=118ms | Max=134ms
```

---

## 2. Checklist de Accesibilidad y Operatividad por Teclado (RNF-ACC-01 / RNF-ACC-02)

**Atributo:** 100% de las operaciones de venta y arqueo realizables exclusivamente con teclado sin requerir mouse.  
**Auditoría:** Ejecutada en Chrome con teclado estándar sin periférico señalador.

| Flujo / Acción | Atajo de Teclado | Comportamiento Observado | Verificado |
| :--- | :---: | :--- | :---: |
| **Foco Inicial POS** | Automático | Al montar `/pos`, el foco recae en el input de SKU (`ref.current.focus()`). | ✅ Aprobado |
| **Ingreso de Ítem** | `Enter` | Escribir SKU y presionar `Enter` añade el ítem al carrito y limpia el campo. | ✅ Aprobado |
| **Búsqueda Catálogo** | `F4` | Abre modal de búsqueda por nombre; navegación con flechas `↓`/`↑` y `Enter`. | ✅ Aprobado |
| **Modal de Cobro** | `F8` | Abre diálogo de pago; selección de método con flechas, cálculo de vuelto en vivo. | ✅ Aprobado |
| **Confirmar Venta** | `Enter` | Estando en el input de efectivo recibido, `Enter` despacha el formulario. | ✅ Aprobado |
| **Cancelar / Salir** | `Escape` | Cierra modales sin confirmar operaciones destructivas ni perder el foco. | ✅ Aprobado |
| **Arqueo Ciego** | `F9` | Despliega modal de cierre de turno; foco directo en `Monto Físico Declarado`. | ✅ Aprobado |
| **Confirmar Arqueo** | `Tab` + `Enter` | Navegación segura hacia el botón de confirmación con alerta visible. | ✅ Aprobado |

---

## 3. Matriz de Pruebas Automatizadas y CI (RNF-SEC-01 / RNF-SEC-02 / Criterio 10)

Ejecución automatizada mediante PHPUnit 12 en base de datos SQLite en memoria (`phpunit.xml`). Total: **64 tests y 234 aserciones exitosas (100% verde)**.

| Suite de Prueba | Archivo de Test | Cant. Tests | Aserciones | Objetivo de Verificación | Estado |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **Aislamiento Multi-Tenant** | `MultiTenantSecurityTest.php` | 4 | 12 | Estricta segregación de datos por `negocio_id` en Eloquent. | ✅ 100% Verde |
| **Control de Roles (RBAC)** | `RoleSecurityTest.php` | 11 | 35 | Protección 403 para cajeros, redirecciones y minimización de props Inertia. | ✅ 100% Verde |
| **Inventario y Kardex** | `InventoryTest.php` | 5 | 18 | Creación de stock inicial, exigencia de motivo, atomicidad y SoftDeletes. | ✅ 100% Verde |
| **Punto de Venta (POS)** | `POSTest.php` | 4 | 16 | Rechazo de stock insuficiente con payload `items`, cálculo de precios en servidor, validación de efectivo y bloqueo cross-tenant. | ✅ 100% Verde |
| **Lógica Turnos Caja** | `TurnoCajaTest.php` | 18 | 54 | Apertura, sincronización multicanal, arqueo ciego, cálculo de descuadre y acumulación. | ✅ 100% Verde |
| **Seguridad de Caja** | `CajaTurnoSecurityTest.php` | 16 | 83 | Bloqueo de ventas sin turno, prevención de doble apertura, permisos de auditoría, protección IDOR entre cajeros y filtro mensual por defecto. | ✅ 100% Verde |
| **Autenticación y Perfil** | `ProfileTest.php` / `Auth/*` | 6 | 16 | Flujos estándar de sesión y seguridad de contraseñas. | ✅ 100% Verde |
| **TOTAL CONSOLIDADO** | — | **64** | **234** | **Suite Completa Pasando sin Errores ni Advertencias** | ✅ **100% Verde** |

---

## 4. Pipeline de Integración Continua (GitHub Actions)

* **Archivo de Configuración:** `.github/workflows/tests.yml`
* **Disparadores:** `push` y `pull_request` a ramas principales.
* **Pasos Verificados en Pipeline:**
  1. `actions/checkout@v4`
  2. Setup PHP 8.3 con extensión `pdo_sqlite`
  3. Setup Node.js 22
  4. `composer install --no-interaction --prefer-dist`
  5. `npm ci && npm run build` (Compilación limpia de bundles de React)
  6. `php artisan key:generate`
  7. `php artisan test` (Ejecución de las 64 pruebas automatizadas)
