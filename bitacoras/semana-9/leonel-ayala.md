# Bitácora Individual - Leonel Ayala

* **Rol / Cargo:** Full Stack / Base de Datos
* **Equipo / Producto:** GestiSoft
* **Periodo registrado:** Semanas 6 a 9 (Reorientación y Ejecución Incremento Funcional 1)

## Registro de Aprendizaje y Contribución

| Pregunta | Respuesta personal |
|----------|--------------------|
| **¿Qué contribución significativa realicé?** | Desarrollé la implementación de extremo a extremo del **PBI-04**: construí el controlador `UserController`, la interfaz React con Inertia para la gestión de usuarios, la inyección global de sesión (`HandleInertiaRequests`), resolví el SPIKE-02, corregí la falla de la Demo 1 implementando el Kardex con motivo obligatorio (`MovimientoStock`), e implementé el sistema de borrado lógico (*Soft Deletes*) en el modelo `User`. Además, implementé la segregación completa del Dashboard (ocultamiento en DOM y redirección forzada a `/pos` para cajeros) y apliqué mejoras de diseño UI/UX (accesibilidad en alertas, números tabulares, badges de stock y atajos de teclado visuales). |
| **¿Qué decisión puedo explicar y justificar?** | Decidí implementar **Soft Deletes (`deleted_at`)** en la tabla `users` en lugar de un `DELETE` tradicional. Si un cajero renuncia y el administrador lo elimina físicamente, las claves foráneas en las tablas de ventas e inventario provocarían un error de integridad o borrarían en cascada el historial de ventas del negocio. Con Soft Deletes, el usuario queda inhabilitado para iniciar sesión, pero los registros contables históricos se conservan intactos. |
| **¿Qué evidencia obtuve o analicé?** | Analicé el esquema relacional de MySQL asegurando que los IDs se generen a nivel de base de datos (`AUTO_INCREMENT`) para evitar condiciones de carrera, y comprobé que `HandleInertiaRequests` transmita el rol a React en memoria sin realizar consultas extras ni exponer hashes de contraseñas. |
| **¿Qué revisión hice al trabajo de otra persona?** | Revisé las pruebas automatizadas de Alan en `RoleSecurityTest.php` (10 tests) para asegurar que las aserciones validaran el borrado lógico (`assertSoftDeleted`), la imposibilidad del Admin de auto-eliminarse y las redirecciones hacia `/pos`. |
| **¿Qué aprendí o corregí?** | Aprendí a fondo la diferencia entre lógica de negocio en backend vs restricciones de integridad en base de datos, el ciclo de vida de transacciones concurrentes con `lockForUpdate` y el manejo seguro de estados en React/Inertia sin recargar la página. |
| **¿Cuál es mi próxima acción?** | Diseñar la tabla relacional `turnos_caja` y los modelos necesarios para soportar el arqueo inicial y final de caja para el Incremento 2. |

## Trazabilidad
* **Evidencia:** `gestisoft-app/app/Http/Controllers/UserController.php` y migración `add_deleted_at_to_users_table.php` | **Qué demuestra:** Implementación de CRUD con SoftDeletes.
* **Evidencia:** `gestisoft-app/app/Models/MovimientoStock.php` | **Qué demuestra:** Corrección de RF-09 / AC-07 de la Demo 1 con historial y auditoría.
