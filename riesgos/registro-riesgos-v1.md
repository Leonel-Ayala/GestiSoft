# Registro de Riesgos del Proyecto (Versión 2 — Incremento 2)

**Producto:** GestiSoft (SaaS POS & Retail)  
**Semana de Línea Base:** Semana 3 (Actualizado en Semanas 6, 13 y 14)  
**Líder de QA y Riesgos:** Alan Troncoso  
**Archivo estructurado:** [`registro-v1.csv`](registro-v1.csv)  

---

## 1. Criterios de Evaluación de Riesgos

* **Probabilidad:** Baja (1), Media (2), Alta (3)
* **Impacto:** Menor (1), Moderado (2), Alto (3), Crítico (4)
* **Nivel de Severidad:**  
  * **Crítico / Alto:** Requiere acción de mitigación obligatoria antes de liberar el incremento (Spike técnico, refactorización transaccional o prueba automatizada en CI).
  * **Medio:** Monitoreo constante y validación en revisiones de código cruzadas (*Peer Review*).
  * **Bajo:** Aceptación informada y declaración en limitaciones.

---

## 2. Matriz Consolidada de Riesgos (RSK-01 a RSK-18)

| ID | Categoría | Descripción del Riesgo | Probabilidad | Impacto | Nivel | Estrategia | Acción de Mitigación / Contingencia | Responsable | Estado | Evidencia Verificable |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- | :---: | :--- |
| **RSK-01** | Técnico | **Filtración de datos entre comercios:** Al compartir una única BD, exponer productos o ventas de otra tienda. | Media | Crítico | **Alto** | Mitigar | Trait `HasNegocio` con *Global Scope* en Eloquent y pruebas de integración. | Leonel Ayala | **Mitigado** | `MultiTenantSecurityTest.php` |
| **RSK-02** | Usabilidad | **Pérdida de foco en el POS:** Al mostrar alertas en horas punta, obligar al cajero a usar mouse retrasando la atención. | Alta | Alto | **Alto** | Mitigar | Manejo de `autofocus` con React `useRef`, atajos globales `[F2]`, `[F4]`, `[F8]`, `[F9]`, `[Enter]`. | Luis Barrios | **Mitigado** | `resources/js/Pages/POS/Index.jsx` |
| **RSK-03** | Seguridad | **Desconfianza del comerciante en la nube:** Temor a que competidores accedan a sus márgenes o catálogo. | Alta | Crítico | **Alto** | Evitar | Aislamiento forzado en el servidor, sesiones seguras y hashing Bcrypt. | Rodrigo Bertolini | **Mitigado** | `app/Traits/HasNegocio.php` |
| **RSK-04** | Seguridad | **Falsa seguridad visual:** Ocultar menús en React pero olvidar proteger la ruta en Laravel. | Media | Crítico | **Alto** | Mitigar | Middleware `CheckRole` (`role:admin`) en el Kernel HTTP; código `HTTP 403 Forbidden`. | Alan Troncoso | **Mitigado** | `tests/Feature/RoleSecurityTest.php` |
| **RSK-05** | Operativo | **Bloqueo del Administrador:** Un dueño modifica su propio rol a Cajero o se auto-elimina. | Media | Alto | **Medio** | Evitar | Validación en `UserController@destroy` que impide auto-eliminación de usuario activo. | Luis Barrios | **Mitigado** | `test_admin_no_puede_eliminarse_a_si_mismo` |
| **RSK-06** | Rendimiento | **Degradación del POS ante catálogos grandes:** Búsqueda lenta violando RNF-PERF-01. | Media | Alto | **Medio** | Mitigar | Límite a 10 resultados, indexación por SKU y medición automatizada ($p95 \le 150\text{ ms}$). | Leonel Ayala | **Controlado** | `scripts/medir-latencia.php` ($p95 = 10.77\text{ ms}$) |
| **RSK-07** | Integridad Financiera | **Venta huérfana en POS:** Venta procesada sin turno activo o en turno cerrado concurrentemente. | Alta | Crítico | **Alto** | Mitigar | Validación obligatoria en `POSController@checkout` con `lockForUpdate` del turno y rechazo con error. | Rodrigo Bertolini | **Mitigado** | `test_checkout_del_pos_bloqueado_si_no_hay_turno_abierto` |
| **RSK-08** | Usabilidad | **Arqueo ciego confuso:** Cajero no comprende cómo declarar el dinero o comete errores al cerrar. | Media | Alto | **Medio** | Mitigar | Modal limpio de arqueo ciego con teclado numérico, previsualización de acta y atajo `[F9]`. | Luis Barrios | **Mitigado** | `resources/js/Pages/POS/Index.jsx` |
| **RSK-09** | Regresión de Calidad | **Regresiones por cambios en caja:** Modificaciones de caja rompen flujos existentes del Incremento 1. | Alta | Alto | **Alto** | Mitigar | Suite de regresión automatizada dedicada en CI (`php artisan test --group=regresion`, 24 tests). | Alan Troncoso | **Mitigado** | `.github/workflows/tests.yml` |
| **RSK-10** | Seguridad Multi-Tenant | **Filtración de turnos entre comercios:** Un usuario consulta boletas o turnos de otro negocio. | Alta | Crítico | **Alto** | Mitigar | Trait `HasNegocio` en `TurnoCaja` y comprobación en `CajaTurnoSecurityTest`. | Leonel Ayala | **Mitigado** | `test_aislamiento_multitenant_un_usuario_no_puede_ver_ni_cerrar_turno_de_otro_negocio` |
| **RSK-11** | Manipulación Importes | **Precios alterados desde el cliente:** Manipulación de peticiones HTTP enviando precios o subtotales alterados. | Crítico | Crítico | **Crítico** | Mitigar | **ADR-03**: Servidor recalcula precios, neto, IVA y vuelto desde BD descartando importes del cliente. | Leonel Ayala | **Mitigado** | `POSTest::test_venta_ignora_precio_enviado_por_cliente` |
| **RSK-12** | Pérdida de Auditoría | **Destrucción de Kardex en cascada:** Eliminar un producto destruye sus movimientos por `cascadeOnDelete`. | Alta | Crítico | **Alto** | Mitigar | **ADR-05**: Habilitación de `SoftDeletes` en `Product` y foreign key con `restrictOnDelete`. | Leonel Ayala | **Mitigado** | `InventoryTest::test_eliminar_producto_conserva_kardex` |
| **RSK-13** | Inconsistencia Stock | **Modificación de existencias sin justificación:** Variaciones de stock sin motivo o transacciones incompletas. | Alta | Alto | **Alto** | Mitigar | Envoltura en `DB::transaction()` y validación de motivo obligatorio con `Rule::requiredIf`. | Rodrigo Bertolini | **Mitigado** | `InventoryTest::test_ajuste_de_stock_sin_motivo_es_rechazado` |
| **RSK-14** | Exposición Privacidad | **Fuga de atributos sensibles en React:** Hashes de contraseñas o tokens expuestos en props compartidas. | Media | Crítico | **Alto** | Mitigar | **SPIKE-02**: Lista blanca estricta en `HandleInertiaRequests` (`id, name, email, role, negocio_id`). | Alan Troncoso | **Mitigado** | `RoleSecurityTest::test_inertia_no_comparte_campos_sensibles` |
| **RSK-15** | Disponibilidad Operativa | **Medios de pago no válidos en POS:** Peticiones con medios arbitrarios corrompen acumuladores de caja. | Media | Alto | **Medio** | Mitigar | **DEF-13**: Validación estricta con `Rule::in(METODOS_PAGO)` y rechazo controlado. | Luis Barrios | **Mitigado** | `POSTest::test_medio_de_pago_invalido_es_rechazado` |
| **RSK-16** | Concurrencia de Caja | **Deadlock en doble apertura simultánea:** Peticiones concurrentes de apertura producen error 500 en MySQL. | Baja | Alto | **Medio** | Mitigar | **DEF-17**: `DB::transaction(..., 3)` con 3 reintentos automáticos y captura de `QueryException`. | Leonel Ayala | **Mitigado** | `test_no_se_puede_abrir_un_segundo_turno_si_ya_hay_uno_abierto` |
| **RSK-17** | Validación de Negocio | **Falta de validación empírica en terreno:** No contar con métricas de satisfacción directa de dueños en sitio. | Alta | Alto | **Alto** | Aceptar | Role-playing en laboratorio basado en entrevistas y tests automatizados; piloto propuesto para el Incremento 3. | Rodrigo Bertolini | **Abierto (aceptado para esta entrega)** | `investigacion/validacion-h01.md` (Sección 7) |
| **RSK-18** | Integridad Kardex | **Kardex incompleto por ventas sin movimiento:** Descuento de stock en checkout sin fila en `movimiento_stocks`. | Alta | Crítico | **Alto** | Mitigar | **ADR-07 / DEF-11**: Inserción atómica de `MovimientoStock` en cada venta; invariante stock = $\sum$ Kardex. | Rodrigo Bertolini | **Mitigado** | `POSTest::test_stock_coincide_con_suma_de_kardex_tras_alta_ajuste_y_venta` |

---

## 3. Seguimiento en el Ciclo Ágil
* Todo riesgo con nivel **Alto** o **Crítico** generó una decisión arquitectónica (**ADR**), un experimento técnico (**SPIKE**) o una prueba automatizada en la suite de pruebas unitarias/funcionales.
* El riesgo marcado como **Abierto (aceptado para esta entrega)** (RSK-17) corresponde a la validación en uso real con comercios, propuesta como trabajo para el Incremento 3, encontrándose declarado de forma explícita en las limitaciones del proyecto.
