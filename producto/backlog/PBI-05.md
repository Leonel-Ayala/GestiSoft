# PBI-05: Módulo Administrador - Dashboard Estadístico

## 1. Definición del Ítem
- **ID:** PBI-05
- **Título:** Módulo Administrador: Dashboard Estadístico
- **Historia de Usuario (Valor):** HU-06 - *Como administrador, quiero visualizar un panel con gráficos de mis ventas y productos más populares, para saber en qué inventario debo invertir más dinero.*
- **Evidencia y Necesidad:** Derivado de P01 (Ceguera comercial, uso de cuadernos) → Satisface N-07 (Visualizar rendimiento comercial gráficamente).
- **Responsable de Aclarar:** Rodrigo Bertolini
- **Estado:** **Postergado al Incremento 3.**
- **Motivo de Postergación:** La evidencia empírica de H-01 y las entrevistas con comerciantes priorizan de forma unánime el control de caja y el arqueo ciego (PBI-03) para mitigar el riesgo de descuadre y permitir la delegación. Asimismo, la reportería estadística requiere de un historial acumulado de turnos de caja cerrados y ventas consolidadas (dependencia de datos de negocio).

## 2. Alcance (Para Incremento 3)
- **Incluye:** 
  - Panel principal con tarjetas de totales consolidados por periodo.
  - Gráfico visual mostrando los "Top 5" productos con mayor volumen de venta.
  - Tratamiento del "Estado Vacío" (Empty State) para negocios nuevos.
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
- **Dependencias:** Depende directamente del historial de ventas y turnos que generan el **PBI-02** y el **PBI-03**. Sin transacciones previas, este ítem no provee valor demostrable.
- **Estimación Preliminar:** 5 Puntos de Historia. Postergado justificadamente al Incremento 3.
