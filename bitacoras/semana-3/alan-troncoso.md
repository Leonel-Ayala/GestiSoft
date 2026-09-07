# Bitácora Individual - Alan Troncoso

* **Rol / Cargo:** Scrum Master y QA
* **Equipo / Producto:** GestiSoft
* **Periodo registrado:** Semanas 3 y 4 (Definición y Ejecución MVP)

## Registro de Aprendizaje y Contribución

| Pregunta | Respuesta personal |
|----------|--------------------|
| **¿Qué contribución significativa realicé?** | Estructuré el aseguramiento de la calidad (QA) del producto creando los Criterios de Aceptación bajo el estándar BDD (Dado/Cuando/Entonces). Además, coordiné el repositorio Git asegurando las integraciones correctas y armé la Matriz de Trazabilidad. |
| **¿Qué decisión puedo explicar y justificar?** | Decidí forzar la documentación y validación estricta de los "Casos Límite y Errores" (como el AC-05 de venta sin stock). Justifico esto porque el 80% de las fallas críticas de los sistemas en producción ocurre en escenarios no felices, y necesitábamos asegurar la regla de negocio. |
| **¿Qué evidencia obtuve o analicé?** | Analicé el documento de *Comprobación de preparación* (Readiness) y la *Matriz de Trazabilidad* para asegurar que ningún código subido estuviera huérfano, validando que todo desarrollo estuviera anclado a una Necesidad. |
| **¿Qué revisión hice al trabajo de otra persona?** | Como Scrum Master, actué como guardián de las ramas en Git. Revisé los flujos de integración del código de Leonel y Luis, exigiendo que no se fusionara a `main` nada que no comprobara antes pasar los criterios de aceptación. |
| **¿Qué aprendí o corregí?** | Aprendí que la trazabilidad es lo único que nos permite defender por qué construimos un producto. Si una funcionalidad técnica no tiene un dolor o evidencia conectada en mi matriz, no es necesaria para el negocio. |
| **¿Cuál es mi próxima acción?** | Preparar el ambiente y la automatización de test (PHPUnit/Pest) para que el equipo valide el cálculo de Cierres de Turno de la Semana 5 de manera automatizada sin hacerlo manual cada vez. |

## Trazabilidad
* **Evidencia:** `product/week3/traceability.csv` | **Qué demuestra:** Enlace directo de necesidad con prueba QA.
* **Evidencia:** `product/week3/acceptance.feature` | **Qué demuestra:** Cobertura completa de casos límites (Excepciones).
