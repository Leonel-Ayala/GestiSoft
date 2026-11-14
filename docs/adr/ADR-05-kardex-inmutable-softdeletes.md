# ADR-05: Kardex Inmutable con SoftDeletes y Restricción Referencial

- **Estado:** Aceptado (2026-11-12)
- **Contexto:** La eliminación de un producto con historial de ventas o movimientos rompía la integridad referencial y borraba el Kardex histórico (OBS-20 / C3).
- **Decisión:** Habilitar el trait `SoftDeletes` en el modelo `Product` y configurar `restrictOnDelete()` en la clave foránea `movimiento_stocks.product_id`.
- **Consecuencias:** Los productos "eliminados" se ocultan del catálogo activo pero su historial de movimientos y ventas permanece intacto y auditable para siempre.
- **Evidencia:** `InventoryTest::test_eliminar_producto_conserva_kardex`.
