# PBI-02: Módulo POS - Ingreso Ágil, Control de Cantidades y Vuelto

## 1. Definición del Ítem
- **ID:** PBI-02
- **Título:** Módulo POS: Ingreso ágil, control de cantidades y vuelto
- **Historia de Usuario (Valor):** HU-01 - *Como cajero, quiero ingresar productos mediante SKU y calcular el vuelto automáticamente para atender velozmente en hora punta.*
- **Evidencia y Necesidad:** Derivado de O01 (Demoras en el mostrador por navegación) → Satisface N-02 (Ingresar artículos rápidamente).
- **Responsable de Aclarar:** Leonel Ayala

## 2. Alcance
- **Incluye:** 
  - Input con autofocus permanente.
  - Listar ítems y sumar cantidades de productos repetidos.
  - Validación en tiempo real del stock disponible.
  - Cálculo de vuelto automático.
- **No Incluye:** 
  - Conexión con impresoras térmicas para boletas.
  - Integración con dispositivos de pago Transbank.

## 3. Requisitos y Aceptación
- **Requisitos Satisfechos:** RF-01 al RF-05, RNF-PERF-01, RNF-ACC-01
- **Criterios de Aceptación:** AC-03 (Normal), AC-04 (Alterno), AC-05 (Excepción)

## 4. Justificación de Priorización (Criterios Rúbrica)
- **Valor:** Es el corazón de la propuesta de valor. Soluciona el problema de lentitud en la atención, permitiendo a la PYME vender eficientemente y mejorar la experiencia de su cliente.
- **Aprendizaje:** Permite confirmar si la experiencia reactiva y operada exclusivamente por teclado es realmente más veloz que la alternativa actual de la PYME (mouse).
- **Riesgo:** Presenta un alto riesgo de usabilidad (UX); si el POS no es fluido y libre de recargas de página, el sistema será rechazado por los cajeros.
- **Dependencias:** Requiere que el catálogo de productos exista y esté poblado (**PBI-01**).
- **Estimación Preliminar:** 5 Puntos de Historia.
