# SPIKE-02: Inyección Global del Estado de Autenticación y Rol (Inertia.js)

## 1. Definición del Ítem
- **ID:** SPIKE-02
- **Título:** Investigación e implementación de estado global de roles desde Laravel hacia React vía Inertia.
- **Necesidad Técnica:** El sistema requiere que el componente Frontend (React) sepa de manera instantánea si el usuario es "Admin" o "Cajero", para ocultar condicionalmente menús (ej. Gestión de Usuarios, Inventario).
- **Responsable:** Leonel Ayala

## 2. Objetivo de Aprendizaje
Determinar la forma más segura y óptima de transmitir los datos del perfil (en particular el `role` y `negocio_id`) a través de *Inertia.js Shared Data*, sin exponer contraseñas ni datos sensibles en el objeto global de React, y sin incurrir en peticiones AJAX adicionales.

## 3. Riesgos e Incertidumbres (Mitigación)
- **Riesgo:** Si pasamos todo el objeto `$request->user()` por defecto, podríamos estar exponiendo tokens, hashes de contraseñas u otros campos privados al frontend (inspeccionables en React DevTools o `window.__inertia.props`).
- **Incertidumbre:** ¿Cómo se configura esto nativamente en la arquitectura de Laravel 13 con React + Inertia?

## 4. Evidencia Esperada y Límite de Tiempo
- **Límite de tiempo (Timebox):** 3 horas.
- **Artefacto Entregable:** Modificación comprobada en `app/Http/Middleware/HandleInertiaRequests.php` donde el método `share` incluya exclusivamente `$request->user()?->only(['id', 'name', 'email', 'role', 'negocio_id'])`.
- **Criterio de Éxito:** Un componente React puede leer `auth.user.role` usando `usePage().props` y esconder botones visualmente sin demoras y sin exponer campos privados.

## 5. Trazabilidad
- Deriva de la implementación de permisos y roles detallada en el **PBI-04**.
- Responde a la observación de la rúbrica (OBS-21 / C4) que demanda protección de privacidad y datos de usuario.

## 6. Resultado y Decisión (Cerrado el 2026-11-12)
- **Hallazgo:** Al retornar `$request->user()` directamente en `HandleInertiaRequests@share`, Inertia serializaba el modelo Eloquent completo en el HTML renderizado, exponiendo campos internos como `password` (hash bcrypt), `remember_token` y marcas de tiempo de verificación de correo.
- **Decisión:** Establecer una lista blanca explícita de atributos seguros en el método `share`: `['id', 'name', 'email', 'role', 'negocio_id']`.
- **Evidencia Automatizada:** Test `RoleSecurityTest::test_inertia_no_comparte_campos_sensibles` (PR #18).
- **Efecto en el Trabajo:** Cierra de forma definitiva el riesgo **RSK-14** y el defecto **DEF-07**.
