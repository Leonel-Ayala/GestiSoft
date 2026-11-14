# ADR-02: Control de Acceso Basado en Roles (RBAC) con Atributo Role

- **Estado:** Aceptado (2026-10-18)
- **Contexto:** Se requiere segregar funciones entre el dueño/administrador y los operadores de caja.
- **Decisión:** Incluir la columna `role` ('admin', 'cajero') en el modelo `User`, protegida mediante el middleware `CheckRole` (`role:admin`).
- **Consecuencias:** Cajeros no pueden ingresar a inventario ni gestión de usuarios; administradores tienen acceso global dentro de su negocio.
- **Evidencia:** `RoleSecurityTest`.
