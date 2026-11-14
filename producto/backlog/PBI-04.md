# PBI-04: Módulo Administrador - Gestión de Cajeros y Roles

## 1. Definición del Ítem
- **ID:** PBI-04
- **Título:** Módulo Administrador: Gestión de cajeros y Roles
- **Historia de Usuario (Valor):** HU-05 - *Como dueño de PYME, quiero crear cuentas separadas para mis vendedores con accesos restringidos, para proteger los precios del inventario y el dinero de la caja.*
- **Evidencia y Necesidad:** Derivado de P01 (Miedo a manipulación de precios) → Satisface N-06 (Controlar accesos).
- **Responsable de Aclarar:** Leonel Ayala

## 2. Alcance
- **Incluye:** 
  - Gestión de cuentas de usuario dentro del negocio (`negocio_id`).
  - Creación de usuarios operativos con rol `cajero` desde la interfaz web administrativa bajo política de mínimo privilegio (**ADR-06**).
  - Protección y bloqueo de rutas críticas (Inventario, Usuarios, Dashboard) para el rol `cajero` (retornando `HTTP 403`).
  - Redirección automática de cajeros hacia `/pos` al intentar acceder al Dashboard o iniciar sesión.
  - Optimización de interfaces (UI/UX) con badges de rol, atajos de teclado visuales, accesibilidad y números tabulares.
- **No Incluye:** 
  - Creación de administradores adicionales desde la interfaz web (restringido por **ADR-06** a seeders/registro inicial del comercio).
  - Recuperación de contraseñas olvidadas por correo electrónico.

## 3. Requisitos y Aceptación
- **Requisitos Satisfechos:** RF-10, RF-11, RNF-SEC-01, RNF-SEC-02, RNF-ACC-02
- **Criterios de Aceptación:** AC-08 (Normal), AC-09 (Seguridad/Límite), AC-12 (Ocultamiento en DOM), **AC-USR-01** (Política de mínimo privilegio en creación de usuarios, ADR-06 / DEF-16).
- **Pruebas Automatizadas:** `tests/Feature/RoleSecurityTest.php` (13 tests, grupo de regresión).
- **Mecanismos Clave:** `CheckRole` middleware (alias `role:admin`), redirecciones de ruta en `web.php`, lista blanca en `HandleInertiaRequests`, `SoftDeletes` en el modelo `User` y política **ADR-06**.
- **Estado Actual:** Completado en Incremento 1 y estabilizado en Incremento 2 con la política de mínimo privilegio ADR-06.

## 4. Justificación de Priorización (Criterios Rúbrica)
- **Valor:** Proporciona tranquilidad administrativa y disminuye el riesgo de fraude interno limitando quién puede modificar los precios.
- **Aprendizaje:** Introduce middlewares de autorización, validando que el sistema puede escalar a múltiples tipos de usuarios internos.
- **Riesgo:** Mitigado mediante `SPIKE-02` (inyección reactiva de sesión sin parpadeos) y `RoleMiddleware` probado exhaustivamente.
- **Dependencias:** Requiere el cimiento Multi-tenant (`SPIKE-01`) implementado para que los usuarios nazcan asociados a una PYME.
- **Estimación y Ejecución:** 5 Puntos de Historia. Desarrollado e integrado como objetivo central del Incremento Funcional 1.
