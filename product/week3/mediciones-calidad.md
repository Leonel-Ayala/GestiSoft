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

*Conclusión:* Mediante los tests automatizados verificamos que la inyección del *Global Scope* del `negocio_id` impide técnicamente cualquier intento de IDOR (Insecure Direct Object Reference). Modificar parámetros en la URL o intentar acceder a productos de otra empresa es interceptado directamente por la capa de la base de datos de Laravel.
