# ADR-01: Arquitectura Multi-Tenant con Global Scope (HasNegocio)

- **Estado:** Aceptado (2026-10-15)
- **Contexto:** GestiSoft debe atender múltiples comercios de forma aislada, garantizando que ningún usuario acceda a datos de otro negocio (RSK-01).
- **Decisión:** Implementar aislamiento lógico mediante la columna `negocio_id` en todas las tablas transaccionales, complementado con el trait `HasNegocio` que aplica automáticamente un Eloquent Global Scope `where('negocio_id', auth()->user()->negocio_id)` y asigna el `negocio_id` en el evento `creating`.
- **Consecuencias:** Prevención automática de fugas de datos entre comercios a nivel de ORM.
- **Evidencia:** `MultiTenantSecurityTest`.
