# ADR-07: Registro obligatorio en Kardex para toda variación de stock (Ventas y Ajustes)

- **Estado:** Aceptado (2026-11-14)
- **Contexto:** En el checkout del POS se descontaba el stock del modelo `Product`, pero no se generaba un registro en la tabla `movimiento_stocks` (Kardex). Como consecuencia, el historial de movimientos no permitía reconstruir el saldo de inventario a partir de la suma de diferencias (DEF-11 / RSK-18).
- **Alternativas evaluadas:**
  - **Opción A:** Registrar movimientos de Kardex exclusivamente en ajustes manuales de inventario y compras, asumiendo las ventas implícitas en la tabla `ventas`.
  - **Opción B (Adoptada):** Garantizar que toda mutación de stock (alta inicial, ajuste manual, merma y venta en POS) inserte de forma atómica una fila en `movimiento_stocks` con `diferencia = -cantidad_vendida` y motivo `"Venta #<id>"`.
- **Decisión:** Se adopta la **Opción B**. Dentro de la misma transacción de base de datos (`DB::beginTransaction()`), por cada ítem vendido se crea un `MovimientoStock` que registra `cantidad_anterior`, `cantidad_nueva`, `diferencia = -$detalle['quantity']` y `user_id = auth()->id()`.
- **Consecuencias:**
  - El invariante de inventario se cumple estrictamente: `Product::stock == MovimientoStock::sum('diferencia')`.
  - Si la venta falla o se cancela, el rollback transaccional anula tanto la venta como el movimiento en el Kardex.
  - Trazabilidad total de auditoría para cada producto vendido.
- **Evidencia:** `POSTest::test_venta_registra_movimiento_en_kardex`, `POSTest::test_stock_coincide_con_suma_de_kardex_tras_alta_ajuste_y_venta`, `POSTest::test_si_falla_la_venta_no_queda_movimiento_de_kardex`.
