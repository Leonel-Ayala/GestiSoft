# PBI-03: Módulo Caja - Arqueo y Cierre de Turno

## 1. Definición del Ítem
- **ID:** PBI-03
- **Título:** Módulo Caja: Arqueo y cierre de turno
- **Historia de Usuario (Valor):** HU-02 - *Como administrador, quiero ver el total esperado al cerrar el turno para auditar descuadres de dinero.*
- **Evidencia y Necesidad:** Derivado de P01 (Descuadres y arqueos lentos) → Satisface N-01 (Auditar flujo de caja automáticamente).
- **Responsable de Aclarar:** Luis Barrios

## 2. Alcance
- **Incluye:** 
  - Sumatoria total de las ventas procesadas vinculadas al turno activo.
  - Bloqueo y validación para impedir cierre con ventas inconclusas.
- **No Incluye:** 
  - Apertura con declaración de saldo inicial en caja fuerte (sencillo).
  - Envío automático del reporte de cierre por correo electrónico al administrador.

## 3. Requisitos y Aceptación
- **Requisitos Satisfechos:** RF-06, RF-07
- **Criterios de Aceptación:** AC-01 (Normal), AC-02 (Excepción/Regla de negocio)

## 4. Justificación de Priorización (Criterios Rúbrica)
- **Valor:** Entrega seguridad financiera al administrador, reduciendo las pérdidas no rastreables y disminuyendo el tiempo de cuadratura al final del día.
- **Aprendizaje:** Valida que la agrupación lógica de transacciones por "Turno" satisface la necesidad de auditoría de los dueños, sin requerir hardware especial.
- **Riesgo:** Si bien es útil, no mitiga el riesgo de usabilidad principal (velocidad de venta). Operacionalmente puede suplirse temporalmente (calculando a mano o en excel los totales).
- **Dependencias:** Requiere que las ventas sean procesadas y guardadas exitosamente mediante el POS (**PBI-02**).
- **Estimación Preliminar:** 3 Puntos de Historia. *(Nota: Excluido del MVP de la Semana 4 por exceder la capacidad técnica del equipo)*.
