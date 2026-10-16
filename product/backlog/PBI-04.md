# PBI-04: Módulo Administrador - Gestión de Cajeros y Roles

## 1. Definición del Ítem
- **ID:** PBI-04
- **Título:** Módulo Administrador: Gestión de cajeros y Roles
- **Historia de Usuario (Valor):** HU-05 - *Como dueño de PYME, quiero crear cuentas separadas para mis vendedores con accesos restringidos, para proteger los precios del inventario y el dinero de la caja.*
- **Evidencia y Necesidad:** Derivado de P01 (Miedo a manipulación de precios) → Satisface N-06 (Controlar accesos).
- **Responsable de Aclarar:** Leonel Ayala

## 2. Alcance
- **Incluye:** 
  - CRUD básico de cuentas de usuario dentro del tenant.
  - Asignación de rol "Administrador" o "Cajero".
  - Protección y bloqueo de rutas críticas (Inventario, Reportes, Cierre) para el rol "Cajero".
- **No Incluye:** 
  - Recuperación de contraseñas olvidadas por correo electrónico.

## 3. Requisitos y Aceptación
- **Requisitos Satisfechos:** RF-10, RF-11, RNF-SEC-01 (parcialmente)
- **Criterios de Aceptación:** AC-08 (Normal), AC-09 (Seguridad/Límite), AC-12 (Ocultamiento en DOM).
- **Pruebas Automatizadas:** `tests/Feature/RoleSecurityTest.php` (7 tests).
- **Mecanismos Clave:** `RoleMiddleware` (kernel HTTP), inyección de sesión en `HandleInertiaRequests`, y `SoftDeletes` en el modelo `User`.
- **Estado Actual:** Completado e integrado en el Incremento Funcional 1 (Semanas 6-9).

## 4. Justificación de Priorización (Criterios Rúbrica)
- **Valor:** Proporciona tranquilidad administrativa y disminuye el riesgo de fraude interno limitando quién puede modificar los precios.
- **Aprendizaje:** Introduce middlewares de autorización, validando que el sistema puede escalar a múltiples tipos de usuarios internos.
- **Riesgo:** Mitigado mediante `SPIKE-02` (inyección reactiva de sesión sin parpadeos) y `RoleMiddleware` probado exhaustivamente.
- **Dependencias:** Requiere el cimiento Multi-tenant (`SPIKE-01`) implementado para que los usuarios nazcan asociados a una PYME.
- **Estimación y Ejecución:** 5 Puntos de Historia. Desarrollado e integrado como objetivo central del Incremento Funcional 1.
