# PBI-05: Módulo Administrador - Dashboard Estadístico

## 1. Definición del Ítem
- **ID:** PBI-05
- **Título:** Módulo Administrador: Dashboard Estadístico
- **Historia de Usuario (Valor):** HU-06 - *Como administrador, quiero visualizar un panel con gráficos de mis ventas y productos más populares, para saber en qué inventario debo invertir más dinero.*
- **Evidencia y Necesidad:** Derivado de P01 (Ceguera comercial, uso de cuadernos) → Satisface N-07 (Visualizar rendimiento comercial gráficamente).
- **Responsable de Aclarar:** Rodrigo Bertolini

## 2. Alcance
- **Incluye:** 
  - Panel principal con tarjetas de totales.
  - Gráfico visual mostrando los "Top 5" productos con mayor volumen de venta.
  - Tratamiento del "Estado Vacío" (Empty State).
- **No Incluye:** 
  - Exportación de reportes a PDF o Excel.
  - Filtros complejos o agrupaciones por rangos de fechas personalizados.

## 3. Requisitos y Aceptación
- **Requisitos Satisfechos:** RF-12, RF-13
- **Criterios de Aceptación:** AC-10 (Normal), AC-11 (Estado vacío/Límite)

## 4. Justificación de Priorización (Criterios Rúbrica)
- **Valor:** Agrega inteligencia de negocios y facilita decisiones estratégicas de compra, elevando el valor percibido del software SaaS frente a los sistemas manuales.
- **Aprendizaje:** Valida el uso de librerías de gráficos en el frontend (React) y optimización de agregaciones SQL en Laravel.
- **Riesgo:** Posee bajo riesgo arquitectónico pero depende enteramente de que el resto del sistema funcione y genere datos.
- **Dependencias:** Depende directamente del historial de ventas que genera el **PBI-02**. Sin transacciones previas, este ítem no provee valor demostrable.
- **Estimación Preliminar:** 5 Puntos de Historia. *(Nota: Excluido del MVP de la Semana 4 por dependencia de masa de datos y priorización)*.
