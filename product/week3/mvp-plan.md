# Objetivo, Alcance y Exclusiones del MVP (Semana 4)

Este documento define las fronteras del primer incremento ejecutable (MVP) a presentar en la primera demostración y defensa, asegurando un alcance realista y justificado técnicamente en función del valor, el riesgo y la capacidad del equipo.

## Objetivo del MVP

**Hipótesis de valor y aprendizaje:** Comprobar que es posible proporcionar una experiencia de venta rápida y 100% operable por teclado (POS), gestionando inventario en tiempo real, sobre una arquitectura segura (Multi-Tenant) que aísle completamente los datos de cada PYME. La demostración del MVP será exitosa si se logra ejecutar un flujo completo de venta reactiva sin interrupciones, validando stock y verificando que un *tenant* no puede acceder a los datos de otro.

## Alcance del MVP (Inclusiones)

Para cumplir con el objetivo principal, se ha delimitado una **sección vertical del trabajo** que aborda el riesgo arquitectónico y el valor central operativo. El MVP incluye estrictamente los siguientes ítems del *Product Backlog*:

1. **SPIKE-01: Arquitectura Multi-Tenant (0 pts).** Implementación de los cimientos de seguridad mediante *Global Scopes* para garantizar el aislamiento de la base de datos (RNF-SEC-01). Es el riesgo prioritario (RSK-03).
2. **PBI-01: Módulo Inventario - Gestión de productos y Stock Base (3 pts).** Habilita la creación de SKUs y disponibilidad inicial para soportar las ventas (HU-03).
3. **PBI-02: Módulo POS - Ingreso ágil, control de cantidades y vuelto (5 pts).** Es el núcleo de la propuesta de valor (HU-01), permitiendo venta veloz por teclado sin recargas (RNF-PERF-01, RNF-ACC-01).

**Total de esfuerzo comprometido:** 8 Puntos de Historia (más investigación arquitectónica inicial).

## Exclusiones Justificadas

Para garantizar un producto robusto, ejecutable y sin fallos críticos en la primera demostración, se han excluido explícitamente los siguientes ítems, fundamentados en la **capacidad real del equipo** y la necesidad de foco:

| Ítem Excluido | Justificación de la Exclusión | Impacto en el MVP |
|---------------|-------------------------------|-------------------|
| **PBI-03: Módulo Caja (Arqueo y Cierre)** | **Capacidad de equipo agotada.** El esfuerzo combinado de SPIKE-01, PBI-01 y PBI-02 (8 pts) agota el *sprint/timebox* disponible. Integrar el cierre de caja comprometería la calidad y testeo del POS. | El MVP asume un único turno "abierto" de forma perpetua en esta fase. No afecta la validación de venta rápida. |
| **PBI-04: Gestión de Cajeros y Roles** | **Foco en el camino principal.** La creación de usuarios introduce lógica de autenticación y autorización compleja (middlewares) que desvía recursos técnicos de la interacción reactiva (React/Inertia) crítica del PBI-02. | Se utilizará un usuario estático "Administrador" (*Seeder*) para la demostración. El aislamiento de tenant prevalece sobre los roles internos. |
| **PBI-05: Dashboard Estadístico** | **Falta de madurez de datos.** Las gráficas carecen de valor si el flujo de venta no está afianzado. El equipo priorizó asegurar el ingreso de datos (POS) antes de construir su explotación visual. | Ninguno. Se abordará en una iteración futura cuando exista masa crítica de transacciones registradas. |

## Dependencias Aprobadas

El plan asume que no se utilizarán integraciones reales del Servicio de Impuestos Internos (SII) ni datos verídicos de clientes (Restricción **RES-01**).
