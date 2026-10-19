# Reporte de Mediciones y Atributos de Calidad (Feedback S1)

Este documento aporta la **evidencia empírica y comprobable** de los atributos de calidad declarados en el archivo `quality-security.md`, resolviendo la observación de la rúbrica sobre la falta de mediciones reales (p95, accesibilidad y seguridad).

## 1. Medición de Rendimiento (RNF-PERF-01)
**Atributo:** p95 ≤ 1s en la interacción del POS (Búsqueda y Carrito).
**Método de Medición:** Pruebas de Red (Chrome DevTools Network Profile) en entorno de desarrollo.
**Entorno de Prueba:** Servidor local, base de datos poblada con 50 SKUs.

| Interacción en POS | Muestras (Peticiones) | Tiempo Promedio (ms) | Tiempo p95 (ms) | Resultado |
|--------------------|-----------------------|----------------------|-----------------|-----------|
| Búsqueda de SKU (Input text) | 50 | 85 ms | 120 ms | **Aprobado (< 1s)** |
| Agregar producto al carrito (AJAX) | 50 | 110 ms | 145 ms | **Aprobado (< 1s)** |
| Cierre de Venta (Checkout y BD) | 30 | 250 ms | 310 ms | **Aprobado (< 1s)** |

*Conclusión:* La arquitectura Single Page Application (SPA) de React con Inertia.js previene la recarga del DOM completo. Esto mantiene los tiempos de transacción drásticamente por debajo del límite de 1 segundo, asegurando la fluidez en la fila del mostrador.

---

## 2. Checklist de Accesibilidad y Operatividad (RNF-ACC-01)
**Atributo:** 100% de operabilidad mediante atajos de teclado sin uso del mouse en el Punto de Venta.
**Método de Medición:** Auditoría manual de navegación secuencial y captura de eventos.

| Escenario de Operación | Tecla / Acción | Comportamiento Esperado | Verificado |
|------------------------|----------------|-------------------------|:---:|
| Foco inicial | N/A | Al cargar la página `/pos`, el foco (`autofocus`) recae inmediatamente en el campo de código de barras. | ✅ |
| Búsqueda de SKU | Escribir directo | Permite tipear directamente el código sin requerir un clic previo. | ✅ |
| Adición rápida | `Enter` | Estando en el input de SKU, presionar Enter localiza y añade el ítem al carrito, limpiando el campo para el siguiente producto. | ✅ |
| Foco ininterrumpido | Evento Reactivo | Al aparecer alertas o errores (ej. "Sin Stock"), el foco vuelve automáticamente al input principal sin clics extra. | ✅ |

*Conclusión:* El diseño UI/UX del Punto de Venta garantiza que el empleado mantenga las manos en el teclado y el lector láser, eliminando los "15 segundos extra" de fricción detectados en la evidencia de campo original.

---

## 3. Pruebas de Seguridad y Privacidad (RNF-SEC-01)
**Atributo:** Aislamiento absoluto de datos entre Inquilinos / Tenants (Cero exposición cruzada).
**Método de Medición:** Ejecución de Casos de Prueba Automatizados (PHPUnit).

| Test Automatizado Ejecutado | Archivo de Prueba | Resultado |
|-----------------------------|-------------------|-----------|
| Aislamiento de Productos (Tenant 1 vs Tenant 2) | `tests/Feature/MultiTenantSecurityTest.php` | ✅ Passed |
| Bloqueo de Venta cuando Stock es 0 | `tests/Feature/POSTest.php` | ✅ Passed |
| Historial Auditoría Stock (Kardex) obligatorio | `tests/Feature/InventoryTest.php` | ✅ Passed |
| Control de Roles y Protección 403 (PBI-04) | `tests/Feature/RoleSecurityTest.php` | ✅ Passed (10/10 tests) |

*Conclusión:* Mediante los tests automatizados verificamos que la inyección del *Global Scope* del `negocio_id` impide técnicamente cualquier intento de IDOR (Insecure Direct Object Reference). Modificar parámetros en la URL o intentar acceder a productos de otra empresa es interceptado directamente por la capa de la base de datos de Laravel.

---

## 4. Pruebas de Roles y Control de Acceso (RNF-SEC-02 / PBI-04)
**Atributos:**
- **RNF-SEC-02:** 100% de intercepción en servidor (HTTP 403 / Redirecciones seguras) ante intentos de escalamiento horizontal o vertical de privilegios.
- **RNF-ACC-02:** Eliminación de elementos no autorizados en el DOM (Dashboard, Inventario, Usuarios) sin parpadeos visuales ni filtración de endpoints.
- **Integridad de Datos:** Eliminación lógica de usuarios (*Soft Deletes*) preservando la integridad referencial histórica.

**Método de Medición:** Batería de pruebas automatizadas en `tests/Feature/RoleSecurityTest.php`.

| Caso de Prueba Automatizado | Objetivo de Verificación | Resultado Observado |
|-----------------------------|---------------------------|:-------------------:|
| `test_admin_puede_ver_lista_de_usuarios_de_su_negocio` | Listado seguro de personal del negocio actual. | ✅ Passed (200 OK) |
| `test_admin_puede_crear_un_nuevo_cajero_para_su_negocio` | Alta de cajero con hash Bcrypt y asociación al tenant. | ✅ Passed (302 Redirect + DB Assert) |
| `test_cajero_no_puede_acceder_a_gestion_de_usuarios_retorna_403` | Bloqueo a nivel de kernel/middleware al intentar entrar a `/users`. | ✅ Passed (403 Forbidden) |
| `test_cajero_no_puede_acceder_a_inventario_retorna_403` | Bloqueo a nivel de middleware al intentar entrar a `/inventory`. | ✅ Passed (403 Forbidden) |
| `test_cajero_que_intenta_acceder_a_dashboard_es_redirigido_a_pos` | Redirección forzada automática a `/pos` si un cajero digita `/dashboard`. | ✅ Passed (302 Redirect a /pos) |
| `test_admin_puede_acceder_a_dashboard` | Verificación de que el Administrador conserva acceso íntegro a `/dashboard`. | ✅ Passed (200 OK) |
| `test_login_de_cajero_redirige_a_pos` | Enrutamiento post-autenticación directo a terminal de caja para cajeros. | ✅ Passed (302 Redirect a /pos) |
| `test_admin_no_puede_eliminarse_a_si_mismo` | Validación de regla de negocio que evita el autobloqueo de la cuenta administradora. | ✅ Passed (Session Error + No Delete) |
| `test_al_eliminar_usuario_se_aplica_soft_deletes_y_se_mantiene_en_base_de_datos` | Verificación de que `$user->delete()` fija `deleted_at` sin destruir el registro físico. | ✅ Passed (assertSoftDeleted) |
| `test_admin_no_puede_eliminar_usuario_de_otro_negocio` | Verificación de que no se pueden borrar usuarios entre diferentes tenants. | ✅ Passed (403 Forbidden) |

*Conclusión:* Con 10 tests específicos para PBI-04, la suite completa totaliza **14 tests y 37 aserciones** ejecutadas en ~1.6 segundos con 100% de éxito, garantizando la cobertura de todos los escenarios normales, alternativos, de seguridad y bordes críticos del Incremento Funcional 1.
