# Bitácora Individual - Alan Troncoso

* **Rol / Cargo:** Scrum Master / QA, Seguridad y Automatización Lead
* **Equipo / Producto:** GestiSoft
* **Periodo registrado:** Semanas 10 a 14 (Evolución, Calidad y Estabilización - Incremento Funcional 2)

## Registro de Aprendizaje y Contribución

| Pregunta | Respuesta personal |
|----------|--------------------|
| **¿Qué contribución significativa realicé?** | Lideré la estrategia de calidad, verificación empírica y seguridad para estabilizar la versión candidata `v0.2.0-rc2`. Diseñé y expandí la suite de pruebas automatizadas en PHPUnit a **64 pruebas y 234 aserciones (100% verde)** en 6 segundos. Corregí el defecto histórico de `POSTest.php` (reemplazando el payload inválido con clave `'cart'` por la estructura real `'items'`, agregando la precondición de turno abierto y verificando la aserción semántica sobre el mensaje de stock insuficiente). Creé la prueba de seguridad contra vulnerabilidades IDOR en turnos (`CajaTurnoSecurityTest::test_cajero_no_puede_ver_resumen_de_turno_de_otro_cajero`). Configuré el pipeline automatizado de Integración Continua en GitHub Actions (`.github/workflows/tests.yml`), levanté las 50 mediciones crudas de latencia ($p95 = 118\text{ ms}$ en búsqueda y $p95 = 289\text{ ms}$ en checkout) en `producto/semana-3/mediciones-calidad.md`, y mantuve la matriz de trazabilidad bidireccional `trazabilidad.csv`. |
| **¿Qué decisión puedo explicar y justificar?** | Decidí configurar el entorno de pruebas automatizadas en `phpunit.xml` utilizando **SQLite en memoria (`:memory:`)** para el pipeline de GitHub Actions, manteniendo MySQL en los entornos locales y de staging. Justificación técnica: Levantar un contenedor Docker con MySQL en GitHub Actions agrega entre 45 y 60 segundos de sobrecarga por commit. SQLite en memoria ejecuta nuestras 64 pruebas y 234 aserciones en solo 6 segundos, entregando retroalimentación instantánea al desarrollador antes de fusionar cualquier PR, mientras que las pruebas de staging validan tipos de datos específicos de MySQL. |
| **¿Qué evidencia obtuve o analicé?** | Analicé los registros crudos de 50 peticiones consecutivas en Google Chrome DevTools bajo condiciones estandarizadas de hardware, calculando los percentiles p95 que demuestran cumplimiento de los umbrales comprometidos ($118\text{ ms} \le 120\text{ ms}$ en búsqueda de catálogo y $289\text{ ms} \le 300\text{ ms}$ en checkout atómico). Analicé la salida del runner de GitHub Actions verificando la compilación limpia de Vite y la ejecución al 100% verde de la suite completa. |
| **¿Qué revisión hice al trabajo de otra persona?** | Realicé la revisión cruzada `REV-08` sobre `HandleInertiaRequests.php` (desarrollado por Leonel Ayala), verificando mediante la prueba automatizada `RoleSecurityTest::test_inertia_no_comparte_campos_sensibles` que las props compartidas en el DOM se restrinjan a `['id', 'name', 'email', 'role', 'negocio_id']` y no expongan hashes de contraseñas ni tokens de sesión. |
| **¿Qué aprendí o corregí?** | Aprendí que un test automatizado que aprueba por un error de validación genérico (como ocurría con `'cart'` en el POS) es un falso positivo peligroso que enmascara defectos críticos de negocio; la calidad de una prueba radica en su capacidad de refutar el comportamiento del software de forma determinista y semántica. |
| **¿Cuál es mi próxima acción?** | Diseñar scripts de pruebas de carga y estrés concurrente utilizando herramientas de benchmarking (K6 o JMeter) para simular 50 usuarios simultáneos durante el piloto de campo en los comercios del Maule. |

## Trazabilidad
* **Evidencia:** `.github/workflows/tests.yml` y suite `gestisoft-app/tests/Feature/CajaTurnoSecurityTest.php` | **Qué demuestra:** Pipeline de CI activo y blindaje contra accesos no autorizados e IDOR en turnos.
* **Evidencia:** `producto/semana-3/mediciones-calidad.md` | **Qué demuestra:** Verificación empírica con tabla de 50 muestras crudas de p95 para búsqueda y checkout.
* **Evidencia:** `producto/semana-3/trazabilidad.csv` | **Qué demuestra:** Trazabilidad bidireccional conectando necesidades, requisitos, decisiones arquitectónicas, PBIs y pruebas de QA.
