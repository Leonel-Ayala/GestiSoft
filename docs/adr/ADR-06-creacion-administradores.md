# ADR-06: Política de creación de usuarios administradores

- **Estado:** Aceptado (2026-11-14)
- **Contexto:** Observación de la Demo 2 (criterio 12): `UserController::store()` admitía rol `admin` además de `cajero` desde el formulario web administrativo sin una política explícita ni justificación de alcance. Catalogado como OBS-29 y DEF-16.
- **Alternativas evaluadas:**
  - **Opción A (Recomendada por seguridad - Mínimo Privilegio):** La interfaz web de usuarios restringe la creación exclusivamente a usuarios operativos con rol `cajero`. El rol `admin` se provisiona únicamente mediante el registro inicial del negocio o seeders controlados del sistema.
  - **Opción B:** Permitir la creación de administradores secundarios desde la interfaz, documentando el caso de uso en PBI-04 y ampliando la matriz de pruebas.
- **Decisión:** Se adopta la **Opción A** (principio de mínimo privilegio). Al impedir la creación de administradores adicionales desde la interfaz web cotidiana, se elimina la superficie de escalamiento horizontal o vertical de privilegios en caso de sesión administrativa desatendida o comprometida, mitigando directamente RSK-14.
- **Consecuencias:**
  - En backend: `UserController::store()` remueve `role` del input validado y asigna de forma determinista `'role' => 'cajero'`.
  - En frontend: `Users/Create.jsx` reemplaza el selector de rol por un indicador visual informativo fijo de rol "Cajero" (ADR-06).
  - En pruebas: Se agrega `RoleSecurityTest::test_admin_no_puede_crear_otro_admin_desde_formulario`.
- **Condición de revisión:** Se reconsiderará si en futuras fases se requiere una estructura jerárquica con múltiples administradores o roles intermedios (ej. Supervisor de Sucursal).
- **Evidencia:** `RoleSecurityTest::test_admin_no_puede_crear_otro_admin_desde_formulario`.
