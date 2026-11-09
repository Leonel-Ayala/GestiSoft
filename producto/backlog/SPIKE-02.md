# SPIKE-02: Inyección Global del Estado de Autenticación y Rol (Inertia.js)

## 1. Definición del Ítem
- **ID:** SPIKE-02
- **Título:** Investigación e implementación de estado global de roles desde Laravel hacia React vía Inertia.
- **Necesidad Técnica:** El sistema requiere que el componente Frontend (React) sepa de manera instantánea si el usuario es "Admin" o "Cajero", para ocultar condicionalmente menús (ej. Gestión de Usuarios, Costos).
- **Responsable:** Leonel Ayala

## 2. Objetivo de Aprendizaje
Determinar la forma más segura y óptima de transmitir los datos del perfil (en particular el `role` y `tenant_id`) a través de *Inertia.js Shared Data*, sin exponer contraseñas ni datos sensibles en el objeto global de React, y sin incurrir en peticiones AJAX adicionales.

## 3. Riesgos e Incertidumbres (Mitigación)
- **Riesgo:** Si pasamos todo el objeto `$request->user()` por defecto, podríamos estar exponiendo tokens, hashes de contraseñas u otros campos privados al frontend (React DevTools).
- **Incertidumbre:** ¿Cómo se configura esto nativamente en la arquitectura de Laravel 11 con React + Inertia?

## 4. Evidencia Esperada y Límite de Tiempo
- **Límite de tiempo (Timebox):** 3 horas.
- **Artefacto Entregable:** Modificación comprobada en `app/Http/Middleware/HandleInertiaRequests.php` donde el método `share` incluya exclusivamente el `id`, `name`, y `role` del usuario activo.
- **Criterio de Éxito:** Un componente React puede leer `auth.user.role` usando `usePage().props` y esconder botones visualmente sin demoras.

## 5. Trazabilidad
- Deriva de la implementación de permisos y roles detallada en el **PBI-04**.
- Responde a la observación de la rúbrica (OBS-02) que demanda control de privilegios.
