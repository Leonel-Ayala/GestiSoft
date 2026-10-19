# Bitácora Individual - Alan Troncoso

* **Rol / Cargo:** Quality Assurance (QA) / Pruebas y Validación
* **Equipo / Producto:** GestiSoft
* **Periodo registrado:** Semanas 6 a 9 (Reorientación y Ejecución Incremento Funcional 1)

## Registro de Aprendizaje y Contribución

| Pregunta | Respuesta personal |
|----------|--------------------|
| **¿Qué contribución significativa realicé?** | Lideré la subsanación de las observaciones de calidad de la primera defensa. Diseñé y automaticé la suite de pruebas del Incremento 1 creando `RoleSecurityTest.php` (10 tests, incluyendo restricciones y redirecciones de dashboard) y complementando los tests de `InventoryTest`, `POSTest` y `MultiTenantSecurityTest` (totalizando 14 tests y 37 aserciones). Elaboré el reporte empírico de mediciones de calidad (`mediciones-calidad.md`) con pruebas de latencia p95 y checklist de accesibilidad por teclado. |
| **¿Qué decisión puedo explicar y justificar?** | Decidí estructurar las pruebas utilizando PHPUnit con el trait `RefreshDatabase` sobre SQLite en memoria y configurar estados específicos en `UserFactory` (`cajero()`). Justificación: Permite ejecutar toda la suite de 14 pruebas de negocio en solo 1.6 segundos en cualquier entorno sin depender de una base de datos local preexistente, garantizando reproducibilidad absoluta (Criterio 6 y 10). |
| **¿Qué evidencia obtuve o analicé?** | Realicé pruebas empíricas de red en Chrome DevTools Network Profile bajo carga, registrando 50 peticiones consecutivas y calculando un p95 de 120 ms en búsqueda de SKU y 310 ms en checkout. También audité la navegación secuencial del POS comprobando el 100% de operabilidad por teclado sin requerir mouse. |
| **¿Qué revisión hice al trabajo de otra persona?** | Realicé pruebas cruzadas (REV-01 y REV-02) sobre el código de Leonel en el POS, detectando la pérdida de foco al saltar alertas de error, lo que llevó a corregir el retorno automático del `autofocus` al input de SKU. |
| **¿Qué aprendí o corregí?** | Comprendí que un Criterio de Aceptación Given/When/Then no tiene validez académica o profesional si no cuenta con un test automatizado o medición empírica reproducible que lo respalde objetivamente. |
| **¿Cuál es mi próxima acción?** | Diseñar el plan de pruebas automatizadas y casos de prueba límite para el arqueo ciego de caja (descuadres por sobrante/faltante) del Incremento 2. |

## Trazabilidad
* **Evidencia:** `gestisoft-app/tests/Feature/RoleSecurityTest.php` | **Qué demuestra:** Automatización y verificación de AC-08, AC-09, AC-12 y SoftDeletes.
* **Evidencia:** `product/week3/mediciones-calidad.md` | **Qué demuestra:** Cumplimiento medible de RNF-PERF-01 (p95 < 1s), RNF-ACC-01 (100% teclado) y RNF-SEC-02.
