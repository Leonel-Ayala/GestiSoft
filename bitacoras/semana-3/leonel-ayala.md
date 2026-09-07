# Bitácora Individual - Leonel Ayala

* **Rol / Cargo:** Full Stack / Base de Datos
* **Equipo / Producto:** GestiSoft
* **Periodo registrado:** Semanas 3 y 4 (Definición y Ejecución MVP)

## Registro de Aprendizaje y Contribución

| Pregunta | Respuesta personal |
|----------|--------------------|
| **¿Qué contribución significativa realicé?** | Diseñé el modelo relacional (SQL) e implementé la arquitectura de seguridad Multi-Tenant resolviendo el SPIKE-01. Me aseguré de que todos los controladores backend de Inventario y POS se comunicaran correctamente con la base de datos sin fricciones. |
| **¿Qué decisión puedo explicar y justificar?** | Decidí utilizar el patrón de diseño de **Global Scopes** nativo de Laravel para aislar los datos. Lo elegí en vez de un Middleware de rutas porque el *Global Scope* se inyecta directo en las consultas (Query Builder), haciendo imposible que un programador olvide filtrar el `negocio_id` accidentalmente. |
| **¿Qué evidencia obtuve o analicé?** | Analicé el Riesgo **RSK-03** (Exposición de Datos). Comprobé mediante pruebas manuales de vulnerabilidad (IDOR) que modificando los IDs en la URL, se obtenía un error 403, probando la efectividad del aislamiento. |
| **¿Qué revisión hice al trabajo de otra persona?** | Revisé las Pull Requests de Luis (Frontend) para confirmar que las llamadas API (Requests) no enviaran variables que intentaran sobrescribir el ID del Tenant inyectado en el Backend. |
| **¿Qué aprendí o corregí?** | Comprendí en profundidad el concepto de *Insecure Direct Object Reference* (IDOR) y el valor de aplicar políticas de seguridad "por diseño" (Secure by Design) directamente en la capa de datos. |
| **¿Cuál es mi próxima acción?** | Modelar la estructura de la tabla de transacciones y cierres de turno (Arqueos) que requerirá el PBI-03 para el siguiente ciclo. |

## Trazabilidad
* **Evidencia:** `product/backlog/SPIKE-01.md` | **Qué demuestra:** Resolución arquitectónica del aislamiento.
* **Evidencia:** Criterio `AC-SEC-01` en `acceptance.feature` | **Qué demuestra:** La regla de privacidad técnica superada.
