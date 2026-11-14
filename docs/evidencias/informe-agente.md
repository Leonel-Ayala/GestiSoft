# INFORME DE AUDITORÍA, SUBSANACIÓN Y ESTABILIZACIÓN - GESTISOFT
## Versión Candidata `v0.2.0-rc2` (Tercera Demostración y Defensa - Semana 14)

* **Asignatura:** Taller de Desarrollo de Software (INF524) – Facultad de Ingeniería UCM
* **Docentes Evaluadores:** Héctor Tejo Uval y Jerman Espíndola Sandoval
* **Equipo:** Grupo 6 – GestiSoft (Leonel Ayala, Alan Troncoso, Luis Barrios, Rodrigo Bertolini)
* **Objetivo de Calificación:** 112 / 112 Puntos (Nivel "Excelente" en los 20 criterios de la rúbrica institucional)
* **Fecha de Emisión:** 14 de Noviembre de 2026

---

## 1. Resumen Ejecutivo de la Intervención

A partir de la auditoría documental exhaustiva del archivo `GestiSoft – Fallos documentales y plan de correcciones (Demo 3).docx` y la especificación técnica en `PLAN-CORRECCIONES-AGENTE-DEMO3.md`, se ejecutó una reingeniería integral de estabilización sobre la base de código y el cuerpo documental del repositorio.

### Resumen de logros cuantitativos:
* **Código y persistencia:** Subsanados **19 defectos formales (DEF-01 al DEF-19)** que afectaban integridad de datos, seguridad, trazabilidad de Kardex, concurrencia de turnos y validaciones en el punto de venta.
* **Cobertura de pruebas automatizadas:**
  * **Suite completa:** **74 pruebas automatizadas con 281 aserciones** ejecutándose al 100% verde en SQLite en memoria (`duration_ms: 12646`).
  * **Suite de regresión:** **24 pruebas etiquetadas con `#[Group('regresion')]` con 92 aserciones** ejecutándose al 100% verde (`duration_ms: 9667`).
* **Atributos de calidad medidos con datos reales:** Script formal de cronometraje en backend (`scripts/medir-latencia.php`) con 50 ejecuciones reales:
  * Búsqueda por catálogo: media $3.01\text{ ms}$, $p95 = 10.77\text{ ms}$ (umbral $\le 120\text{ ms}$ - CUMPLE).
  * Estado de caja: media $1.34\text{ ms}$, $p95 = 2.87\text{ ms}$ (umbral $\le 100\text{ ms}$ - CUMPLE).
  * Checkout atómico: media $4.29\text{ ms}$, $p95 = 6.63\text{ ms}$ (umbral $\le 300\text{ ms}$ - CUMPLE).
  * Ergonomía de mostrador: checklist 7/7 (100%) atajos de teclado sin requerimiento de ratón.
* **Trazabilidad bidireccional:** Matriz `producto/semana-14/trazabilidad.csv` con **41 filas**, auditada por `scripts/validar-trazabilidad.php` con **38 métodos de prueba verificados físicamente** y **0 errores**.
* **Registros de Decisión Arquitectónica (ADRs):** Creados **7 ADRs completos (ADR-01 a ADR-07)** en `docs/adr/`.
* **Honestidad académica:** Protocolo de Role-Playing en laboratorio para H-01 formalizado en `investigacion/validacion-h01.md`, ensayos H-03 en `investigacion/ensayos-h03.md`, y riesgo de campo RSK-17 declarado abierto con fecha de piloto.
* **Guía de presentación:** `docs/guia-presentacion-defensa3.md` actualizada con demostración distribuida entre los 4 integrantes para respaldar los 28 puntos de evaluación individual (Criterios 17 al 20).

---

## 2. Correspondencia con la Rúbrica de la Tercera Defensa (C1 a C20)

| Criterio Rúbrica | Dimensión Evaluada | Estado Previo a la Intervención | Estado Final Subsanado | Evidencia Concreta de Verificación |
| :---: | :--- | :--- | :--- | :--- |
| **C1** | Aprendizaje y retroalimentación | Correcciones C1-C4 dispersas; terminología inconsistente (`Tenant`/`justificacion`) | Matriz completa OBS-18 a OBS-28 y DEF-01 a DEF-19; glosario alineado | [guia-semana14.md](file:///c:/Users/leone/Desktop/GestiSoft/docs/guia-semana14.md#c1-a-c4), `tests/Feature/POSTest.php` |
| **C2** | Validación de hipótesis | H-01 confundía simulación con terreno sin declarar límites | Role-Playing en laboratorio declarado; validación de campo abierta con fechas | [investigacion/validacion-h01.md](file:///c:/Users/leone/Desktop/GestiSoft/investigacion/validacion-h01.md), [ensayos-h03.md](file:///c:/Users/leone/Desktop/GestiSoft/investigacion/ensayos-h03.md) |
| **C3** | Alcance y valor | Confusión sobre alcance de retiros/sangrías y dashboard analítico | Límites claros: PBI-03 incluido, PBI-05 postergado con justificación de valor | [producto/backlog/PBI-03.md](file:///c:/Users/leone/Desktop/GestiSoft/producto/backlog/PBI-03.md), [guia-semana14.md](file:///c:/Users/leone/Desktop/GestiSoft/docs/guia-semana14.md#alcance) |
| **C4** | Criterios de aceptación | Solo flujo normal en caja; ventas huérfanas sin criterio explícito | Criterios BDD completos (normal, alternativo, error): AC-CAJA-01 a 09, AC-KARDEX-02 | [guia-semana14.md](file:///c:/Users/leone/Desktop/GestiSoft/docs/guia-semana14.md#criterios-bdd) |
| **C5** | Modelo de dominio y arquitectura | Términos fantasma (`Tenant`, `tenant_id`, `justificacion`) | Modelo conceptual alineado al código: `Negocio`, `negocio_id`, `motivo`, C4 nivel 2 | [docs/adr/ADR-01-multi-tenant-global-scope.md](file:///c:/Users/leone/Desktop/GestiSoft/docs/adr/ADR-01-multi-tenant-global-scope.md), [guia-semana14.md](file:///c:/Users/leone/Desktop/GestiSoft/docs/guia-semana14.md#arquitectura) |
| **C6** | Decisiones arquitectónicas | Solo 3 ADRs informales en texto | 7 ADRs formales en `docs/adr/` con contexto, decisión, consecuencias y tests | Carpeta [docs/adr/](file:///c:/Users/leone/Desktop/GestiSoft/docs/adr/) (ADR-01 al ADR-07) |
| **C7** | Priorización fundada | Justificación genérica de PBIs | Priorización fundada en dolor de efectivo y prevención de pérdidas | [producto/backlog/PBI-03.md](file:///c:/Users/leone/Desktop/GestiSoft/producto/backlog/PBI-03.md) y [PBI-05.md](file:///c:/Users/leone/Desktop/GestiSoft/producto/backlog/PBI-05.md) |
| **C8** | Demostración funcional | Conducida por un solo integrante sin mostrar mitigaciones críticas | Flujo en vivo de 8 min distribuido entre los 4 integrantes (concurrencia, Kardex, UI, QA) | [guia-presentacion-defensa3.md](file:///c:/Users/leone/Desktop/GestiSoft/docs/guia-presentacion-defensa3.md#fase-3) |
| **C9** | Integración y consistencia | Rutas huérfanas en users e inventory (`show`, `edit`, `update`); ventas sin Kardex | Rutas restringidas con `except`/`only`; ventas generan Kardex atómico (ADR-07) | `gestisoft-app/routes/web.php`, `POSController.php`, `InventoryTest.php` |
| **C10** | Manejo de bordes y errores | Fallos 500 potenciales en rutas inexistentes; concurrencia en apertura | Errores 404/405/422 controlados; transacciones con reintentos ante deadlock (DEF-17) | `RoleSecurityTest.php`, `CajaController.php` |
| **C11** | Batería de pruebas automatizadas | 64 tests; `monto_apertura` desalineado de BD; sin suite de regresión | 74 tests (281 aserciones); suite regresión con 24 tests; nombres alineados | `php artisan test`, `php artisan test --group=regresion` |
| **C12** | Atributos de calidad | Datos sintéticos no trazables en p95 de latencia | Mediciones reales con `scripts/medir-latencia.php` (p95: búsqueda 10.7ms, checkout 6.6ms) | [producto/semana-14/mediciones-calidad.md](file:///c:/Users/leone/Desktop/GestiSoft/producto/semana-14/mediciones-calidad.md) |
| **C13** | Seguridad y privacidad | Brecha de escalamiento de privilegios en creación de usuarios | Implementado ADR-06 (mínimo privilegio: rol cajero fijo) y mitigaciones C1, C4, IDOR | `UserController.php`, `Create.jsx`, `RoleSecurityTest.php` |
| **C14** | Trazabilidad de ingeniería | Matriz desfasada con referencias a métodos de test inexistentes | Matriz de 41 filas auditada con script; 38 tests físicos verificados | [producto/semana-14/trazabilidad.csv](file:///c:/Users/leone/Desktop/GestiSoft/producto/semana-14/trazabilidad.csv), `scripts/validar-trazabilidad.php` |
| **C15** | Riesgos y contingencias | 15 riesgos con fechas desactualizadas; sin riesgo de validación en terreno | 18 riesgos (RSK-01 a RSK-18); 17 mitigados y RSK-17 abierto transparente | [riesgos/registro-riesgos-v1.md](file:///c:/Users/leone/Desktop/GestiSoft/riesgos/registro-riesgos-v1.md) |
| **C16** | Versión candidata y estabilidad | README sin advertencia de depuración ni comando de regresión | Versión candidata `v0.2.0-rc2`, guía de regresión, `APP_DEBUG=false`, DoD cumplida | [README.md](file:///c:/Users/leone/Desktop/GestiSoft/README.md), [guia-semana14.md](file:///c:/Users/leone/Desktop/GestiSoft/docs/guia-semana14.md#version-candidata) |
| **C17** | Evaluación individual - Leonel Ayala | Enfoque restringido a backend general | Dominio acreditado en concurrencia (`lockForUpdate`), ADR-06 y persistencia C1/C3 | [bitacoras/semana-14/leonel-ayala.md](file:///c:/Users/leone/Desktop/GestiSoft/bitacoras/semana-14/leonel-ayala.md), guión en defensa |
| **C18** | Evaluación individual - Alan Troncoso | Enfoque restringido a conteo de tests | Dominio acreditado en CI, suite de regresión (24 tests), mediciones p95 y seguridad IDOR | [bitacoras/semana-14/alan-troncoso.md](file:///c:/Users/leone/Desktop/GestiSoft/bitacoras/semana-14/alan-troncoso.md), guión en defensa |
| **C19** | Evaluación individual - Luis Barrios | Enfoque restringido a estética visual | Dominio acreditado en ergonomía mostrador DA-10, estado local React, CSS print y ADR-04 | [bitacoras/semana-14/luis-barrios.md](file:///c:/Users/leone/Desktop/GestiSoft/bitacoras/semana-14/luis-barrios.md), guión en defensa |
| **C20** | Evaluación individual - Rodrigo Bertolini | Enfoque restringido a redacción de guías | Dominio acreditado en backlog PBI-03/05, honestidad de H-01 en lab y gestión de riesgos | [bitacoras/semana-14/rodrigo-bertolini.md](file:///c:/Users/leone/Desktop/GestiSoft/bitacoras/semana-14/rodrigo-bertolini.md), guión en defensa |

---

## 3. Matriz de Defectos Subsanados (DEF-01 a DEF-19)

| ID Defecto | Descripción del Defecto | Severidad | Estado | Archivo Modificado | Test Automatizado Asociado |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **DEF-01** | Manipulación de precios en checkout por cliente | P0 (Seguridad) | Resuelto | `POSController.php` | `POSTest::test_venta_ignora_precio_enviado_por_cliente` |
| **DEF-02** | Modificación de stock sin motivo en inventario | P0 (Integridad) | Resuelto | `ProductController.php` | `InventoryTest::test_modificar_stock_requiere_motivo` |
| **DEF-03** | Borrado físico de productos destruía Kardex contable | P0 (Legal) | Resuelto | `Product.php`, Migración SoftDeletes | `InventoryTest::test_eliminar_producto_conserva_kardex` |
| **DEF-04** | Exposición de hashes y datos sensibles en Inertia | P1 (Privacidad) | Resuelto | `HandleInertiaRequests.php` | `RoleSecurityTest::test_inertia_no_comparte_campos_sensibles` |
| **DEF-05** | Fallo en prueba histórica `POSTest` por payload `cart` | P1 (QA) | Resuelto | `POSTest.php` | `POSTest::test_venta_falla_si_no_hay_stock_suficiente` |
| **DEF-06** | Vulnerabilidad IDOR en consulta de turno de otro cajero | P0 (Seguridad) | Resuelto | `CajaController.php` | `CajaTurnoSecurityTest::test_cajero_no_puede_ver_resumen_de_turno_de_otro_cajero` |
| **DEF-07** | Ventas huérfanas permitidas sin turno de caja activo | P0 (Negocio) | Resuelto | `POSController.php` | `CajaTurnoSecurityTest::test_checkout_rechazado_sin_turno_abierto` |
| **DEF-08** | Arqueo con saldo teórico visible al cajero | P1 (UX/Control) | Resuelto | `POS/Index.jsx`, `ADR-04` | Verificación de interfaz y modal ciego |
| **DEF-09** | Filtro de auditoría de cajas sin acotamiento mensual | P1 (Rendimiento) | Resuelto | `CajaController.php` | `CajaTurnoSecurityTest::test_filtro_por_defecto_cajas_muestra_mes_actual_y_permite_historico` |
| **DEF-10** | Términos divergentes (`Tenant`/`justificacion`) | P1 (Consistencia) | Resuelto | Todo el repositorio | Revisión linter y alineación conceptual |
| **DEF-11** | Venta POS no creaba movimiento atómico en Kardex | P0 (Integridad) | Resuelto | `POSController.php` | `InventoryTest::test_venta_pos_registra_movimiento_kardex` |
| **DEF-12** | Checkout permitía productos duplicados en el array `items` | P1 (Validación) | Resuelto | `POSController.php` | `POSTest::test_checkout_rechaza_items_duplicados` |
| **DEF-13** | Inconsistencia en métodos de pago aceptados (`payment_method`) | P1 (Integridad) | Resuelto | `POSController.php`, `POS/Index.jsx` | `POSTest::test_checkout_rechaza_metodo_pago_invalido` |
| **DEF-14** | Condición de carrera al cobrar con turno cerrado en paralelo | P0 (Concurrencia) | Resuelto | `POSController.php`, `TurnoCaja.php` | `TurnoCajaTest::test_turno_cerrado_no_recalcula_totales` |
| **DEF-15** | Rutas inexistentes de `inventory` y `users` expuestas | P1 (Seguridad) | Resuelto | `web.php` | `RoleSecurityTest::test_rutas_inexistentes_responden_404` |
| **DEF-16** | Creación de usuarios en UI permitía crear administradores | P1 (Mínimo Privilegio) | Resuelto | `UserController.php`, `Create.jsx` | `RoleSecurityTest::test_admin_crea_usuario_con_rol_cajero_fijo` |
| **DEF-17** | Apertura de caja vulnerable a deadlocks concurrentes | P1 (Concurrencia) | Resuelto | `CajaController.php` | `TurnoCajaTest::test_abrir_turno_soporta_concurrencia` |
| **DEF-18** | Discrepancia `monto_apertura` vs `monto_inicial` en tests | P1 (QA) | Resuelto | `POSTest.php` | `POSTest::test_checkout_exitoso_en_efectivo` |
| **DEF-19** | Ausencia de suite de regresión y plantilla de PR | P1 (CI/CD) | Resuelto | `.github/workflows/tests.yml`, `pull_request_template.md` | Ejecución en CI y paso `--group=regresion` |

---

## 4. Resultados de la Batería de Pruebas Automatizadas

### A. Suite de Regresión (`php artisan test --group=regresion`)
```json
{"tool":"phpunit","result":"passed","tests":24,"passed":24,"assertions":92,"duration_ms":9667}
```
* **Estado:** 100% Verde (24 tests pasados, 0 fallos, 92 aserciones).

### B. Suite Completa (`php artisan test`)
```json
{"tool":"phpunit","result":"passed","tests":74,"passed":74,"assertions":281,"duration_ms":12646}
```
* **Estado:** 100% Verde (74 tests pasados, 0 fallos, 281 aserciones).
* **Distribución de Suites:**
  * `MultiTenantSecurityTest.php`: 4 tests (Aislamiento global entre comercios).
  * `RoleSecurityTest.php`: 13 tests (Control de acceso RBAC, rutas 403, mínimo privilegio ADR-06 y minimización de props C4).
  * `InventoryTest.php`: 6 tests (Validación de motivo C2, SoftDeletes C3 y trazabilidad de Kardex en venta ADR-07).
  * `POSTest.php`: 7 tests (Recálculo de precios C1, efectivo insuficiente, métodos de pago DEF-13 y validación de duplicados DEF-12).
  * `TurnoCajaTest.php`: 18 tests (Ciclo de turnos, arqueo ciego, sincronización de acumuladores, bloqueo de recálculo en turnos cerrados DEF-14 y reintentos ante concurrencia DEF-17).
  * `CajaTurnoSecurityTest.php`: 20 tests (Bloqueo sin turno activo, protección contra IDOR en turnos y filtro mensual de auditoría).
  * `AuthenticationTest.php`: 6 tests (Autenticación y ciclo de sesión).

---

## 5. Resultados de Mediciones de Atributos de Calidad (Datos Reales)

Mediciones registradas en backend con 50 iteraciones reales (`scripts/medir-latencia.php`) persistidas en `producto/semana-14/mediciones/latencias-20261114-1648.csv`:

| Operación Medida | N | Media | p50 (Mediana) | p95 | p99 | Umbral Comprometido | Evaluación |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Búsqueda de Catálogo (`GET /pos/search`)** | 50 | $3.01\text{ ms}$ | $2.31\text{ ms}$ | **$10.77\text{ ms}$** | $13.56\text{ ms}$ | $\le 120\text{ ms}$ | **CUMPLE** |
| **Estado de Caja (`GET /caja/estado`)** | 50 | $1.34\text{ ms}$ | $1.09\text{ ms}$ | **$2.87\text{ ms}$** | $8.07\text{ ms}$ | $\le 100\text{ ms}$ | **CUMPLE** |
| **Checkout Atómico (`POST /pos/checkout`)** | 50 | $4.29\text{ ms}$ | $3.67\text{ ms}$ | **$6.63\text{ ms}$** | $18.33\text{ ms}$ | $\le 300\text{ ms}$ | **CUMPLE** |

* **Checklist de Accesibilidad y Ergonomía de Mostrador:** 7 de 7 atajos verificados (100% operable por teclado sin mouse: `F2`, `F8`, `F9`, `Enter`, `Barra`, `Esc`, `Tab`).

---

## 6. Resultados del Linter de Trazabilidad (`validar-trazabilidad.php`)

Salida de la auditoría estricta sobre `producto/semana-14/trazabilidad.csv`:
```text
Validando matriz de trazabilidad: trazabilidad.csv
Ruta absoluta: producto/semana-14/trazabilidad.csv
--------------------------------------------------------------------------------
Total de filas analizadas: 41
Referencias a tests verificadas con éxito en tests/: 38
Filas declaradas sin test automatizado o informativas: 3

 Resultado: ÉXITO. Todas las pruebas referenciadas existen físicamente y están sincronizadas.
```

---

## 7. Checklist para el Equipo Humano (Acciones Exclusivas del Equipo)

Las siguientes tareas requieren intervención humana directa o actividades en terreno que no pueden ser automatizadas ni inventadas:

1. [ ] **Configurar Branch Protection Rule en GitHub:**
   * En el repositorio de GitHub (`Leonel-Ayala/GestiSoft`), ir a *Settings > Branches*.
   * Crear regla para la rama `main` requiriendo status checks antes del merge: marcar `tests / phpunit (pull_request)`.
2. [ ] **Sesión de Validación en Terreno con los 2 Comercios Físicos:**
   * Ejecutar la visita en los locales seleccionados de la Región del Maule (`Abarrotes Laura` y `Boutique Urbana`) según el cronograma acordado.
   * Rellenar los marcadores `[COMPLETAR POR EL EQUIPO]` en la Sección 7 de [investigacion/validacion-h01.md](file:///c:/Users/leone/Desktop/GestiSoft/investigacion/validacion-h01.md).
3. [ ] **Cronometraje de los 5 Ensayos de Caja:**
   * Realizar los 5 ensayos operativos de apertura/venta/cierre descritos en [investigacion/ensayos-h03.md](file:///c:/Users/leone/Desktop/GestiSoft/investigacion/ensayos-h03.md).
   * Reemplazar los marcadores `[COMPLETAR POR EL EQUIPO]` con los tiempos cronometrados reales.
4. [ ] **Ensayo de la Presentación Cronometrada (20 Minutos):**
   * Ensayar la exposición respetando el límite: **12 minutos de diapositivas** y **8 minutos de demostración en vivo**.
   * Practicar las transiciones de voz y pantalla entre Rodrigo, Luis, Leonel y Alan siguiendo [guia-presentacion-defensa3.md](file:///c:/Users/leone/Desktop/GestiSoft/docs/guia-presentacion-defensa3.md).
5. [ ] **Crear Release / Tag `v0.2.0-rc2`:**
   * Una vez fusionado el Pull Request #18 en `main`, crear el release formal en GitHub con el tag `v0.2.0-rc2`.

---

## 8. Declaración de Estado de Git

En estricto cumplimiento de la instrucción del usuario (*"no me consultes nada esta vez, solo ejecuta lo que debas ejecutar, y luego vemos la subida al repo"*):
* **NO se ha ejecutado `git push` hacia ningún repositorio remoto.**
* **NO se han creado etiquetas ni releases remotos.**
* Todos los cambios, archivos nuevos y pruebas se encuentran en el entorno local listos para ser revisados por el equipo antes de su confirmación final y posterior subida al repositorio.
