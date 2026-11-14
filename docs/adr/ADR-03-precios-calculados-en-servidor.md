# ADR-03: Cálculo Autoritativo de Precios, Totales e Impuestos en Servidor

- **Estado:** Aceptado (2026-11-05)
- **Contexto:** En aplicaciones web/SPA, los valores monetarios enviados desde el cliente pueden ser adulterados en tránsito (OBS-12 / C1).
- **Decisión:** El cliente POS envía únicamente el arreglo de `product_id` y `quantity`. En `POSController@checkout`, el servidor consulta los precios vigentes bloqueando filas (`lockForUpdate`), calcula subtotales, neto, IVA (19%) y total general.
- **Consecuencias:** Se descartan de forma estricta los precios enviados por el cliente.
- **Evidencia:** `POSTest::test_venta_ignora_precio_enviado_por_cliente`.
