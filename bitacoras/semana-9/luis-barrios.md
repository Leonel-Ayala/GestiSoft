# Bitácora Individual - Luis Barrios

* **Rol / Cargo:** Arquitectura de Software y Seguridad
* **Equipo / Producto:** GestiSoft
* **Periodo registrado:** Semanas 6 a 9 (Reorientación y Ejecución Incremento Funcional 1)

## Registro de Aprendizaje y Contribución

| Pregunta | Respuesta personal |
|----------|--------------------|
| **¿Qué contribución significativa realicé?** | Diseñé la arquitectura de seguridad y control de acceso del Incremento 1. Definí e implementé el `RoleMiddleware` a nivel de kernel HTTP en Laravel (`bootstrap/app.php`), configuré los contratos de rutas protegidas en `routes/web.php` y documenté el ADR-02 (Arquitectura de Roles nativa vs paquete externo). Además, actualicé las instrucciones de instalación en el `README.md` resolviendo la brecha de reproducibilidad observada en la Demo 1. |
| **¿Qué decisión puedo explicar y justificar?** | Decidí registrar la decisión arquitectónica **ADR-02** para implementar una columna nativa `role` y Middlewares en vez de la librería `spatie/laravel-permission`. Justificación: El paquete creaba 5 tablas adicionales con múltiples consultas JOIN por cada petición, lo que arriesgaba degradar la latencia y violar el RNF-PERF-01 (< 1s). Nuestra solución nativa es liviana, segura y satisface al 100% el alcance. Además, decidí proteger las rutas a nivel de archivo de rutas y no en constructores para eliminar el riesgo RSK-04. |
| **¿Qué evidencia obtuve o analicé?** | Analicé la observación del profesor respecto a la reproducibilidad del software y corregí el `README.md` con las instrucciones exactas de ejecución. Analicé el paso de contratos HTTP (POST `/users`, GET `/inventory`) verificando que respondan HTTP 403 ante peticiones no autorizadas. |
| **¿Qué revisión hice al trabajo de otra persona?** | Revisé las Pull Requests de Leonel (Fullstack) sobre el `UserController.php` y las migraciones de `SoftDeletes`, verificando que ningún método permitiera escalamiento de privilegios ni elusión de los Global Scopes de `negocio_id`. |
| **¿Qué aprendí o corregí?** | Comprendí que la seguridad en aplicaciones web nunca debe ser cosmética (ocultar un botón en React es inútil si el endpoint backend no valida el rol en el servidor) y la importancia del modelo C4 para comunicar límites de contenedores y componentes. |
| **¿Cuál es mi próxima acción?** | Diseñar la arquitectura del token y sesión para la apertura/cierre de turnos de caja (PBI-03) garantizando transaccionalidad de dinero en el Incremento 2. |

## Trazabilidad
* **Evidencia:** `gestisoft-app/app/Http/Middleware/RoleMiddleware.php` y `gestisoft-app/bootstrap/app.php` | **Qué demuestra:** Intercepción y protección HTTP en el kernel.
* **Evidencia:** `docs/referencias/guia-semana6.md` (Sección 16: ADR-02 y Sección 12: C4 Componentes) | **Qué demuestra:** Justificación arquitectónica y diseño técnico.
