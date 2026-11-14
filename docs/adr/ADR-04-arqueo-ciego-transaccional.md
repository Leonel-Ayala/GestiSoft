# ADR-04: Arqueo Ciego Transaccional para Cierre de Caja

- **Estado:** Aceptado (2026-11-10)
- **Contexto:** Si el cajero conoce el monto esperado en caja antes de contar el dinero físico, se facilita el calce forzado o la sustracción de sobrantes (OBS-18 / PBI-03).
- **Decisión:** El cajero declara exclusivamente el monto físico contado (`monto_declarado`) sin conocer el `total_esperado`. El backend, en una transacción con bloqueo de fila (`lockForUpdate`), calcula la diferencia (`monto_declarado - total_esperado`), congela el turno como `cerrado` e inmutable, y genera el acta de arqueo.
- **Consecuencias:** Auditoría transparente y desacoplada del operador.
- **Evidencia:** `CajaTurnoSecurityTest`, `TurnoCajaTest`.
