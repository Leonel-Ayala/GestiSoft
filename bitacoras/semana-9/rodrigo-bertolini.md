# Bitácora Individual - Rodrigo Bertolini

* **Rol / Cargo:** Product Owner (PO)
* **Equipo / Producto:** GestiSoft
* **Periodo registrado:** Semanas 6 a 9 (Reorientación y Ejecución Incremento Funcional 1)

## Registro de Aprendizaje y Contribución

| Pregunta | Respuesta personal |
|----------|--------------------|
| **¿Qué contribución significativa realicé?** | Lideré la reorientación del producto a partir de la retroalimentación de la primera defensa (Nota 5.9). Transformé las observaciones de los docentes en el objetivo central del Incremento 1, priorizando el PBI-04 (Gestión de Usuarios y Roles) y el SPIKE-02 para mitigar el riesgo de seguridad en mostrador antes que construir reportes. Gestioné la justificación estratégica de postergaciones (PBI-03 y PBI-05). |
| **¿Qué decisión puedo explicar y justificar?** | Decidí priorizar el PBI-04 (Roles de usuario) por encima del PBI-03 (Arqueo de caja). Justificación: El análisis de riesgo RSK-04 demostró que construir arqueos sin separación de perfiles permitía que un cajero manipulara sus propios reportes de turno. La seguridad y segregación de funciones condicionaba el valor real de la caja. |
| **¿Qué evidencia obtuve o analicé?** | Analicé las observaciones de la rúbrica de la Demo 1 (brechas en RF-09/AC-07 y falta de separación de perfiles). Actualicé la matriz de trazabilidad incorporando la columna de Decisiones (`DEC-01` a `DEC-05`) y redacté las secciones de reorientación en `guia-semana6.md` sincronizando necesidades, hipótesis de valor H-01 y señal observable 403. |
| **¿Qué revisión hice al trabajo de otra persona?** | Revisé los criterios de aceptación AC-08, AC-09 y AC-12 elaborados por Alan (QA) y las vistas frontend desarrolladas por Leonel para asegurar que las opciones de "Inventario" y "Usuarios" no se renderizaran en el DOM para perfiles restringidos. |
| **¿Qué aprendí o corregí?** | Aprendí a usar la retroalimentación como motor de adaptación ágil en lugar de justificar defensivamente los errores. Comprendí cómo formular una hipótesis refutable (H-01) con una señal de éxito observable y medible en lugar de asumir supuestos sin contrastar. |
| **¿Cuál es mi próxima acción?** | Con la base de roles y seguridad blindada, coordinar el inicio del Incremento 2 priorizando el PBI-03 (Arqueo y Cierre de Turno ciego) y el PBI-05 (Dashboard estadístico). |

## Trazabilidad
* **Evidencia:** `docs/referencias/guia-semana6.md` (Secciones 2, 4, 5 y 7) | **Qué demuestra:** Reorientación basada en feedback, hipótesis H-01 y refinamiento del Product Backlog.
* **Evidencia:** `product/backlog/PBI-04.md` y `product/week3/traceability.csv` | **Qué demuestra:** Justificación de priorización de roles y enlace con DEC-04 en estado Listo.
