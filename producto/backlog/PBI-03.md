# PBI-03: Módulo Caja — Arqueo Ciego y Cierre de Turno

## 1. Definición del Ítem
- **ID:** PBI-03
- **Título:** Módulo Caja: Apertura, Arqueo Ciego y Auditoría de Turno
- **Historia de Usuario (Valor):** *Como **dueño/administrador**, quiero que el cajero declare el efectivo contado **sin ver el total esperado** (arqueo ciego) y que el sistema calcule el descuadre, para auditar la caja sin depender de la honestidad del conteo.*
- **Evidencia y Necesidad:** Derivado del problema P01 (descuadres de dinero, temor al robo y arqueos manuales lentos) $\rightarrow$ Satisface la necesidad de negocio N-01 (auditar flujo de caja de forma íntegra y transparente).
- **Responsable:** Leonel Ayala (Backend) y Luis Barrios (Frontend/UX)

## 2. Alcance del Incremento 2
- **Incluye:**
  - Apertura de turno con fondo inicial en gaveta (`monto_inicial`).
  - Bloqueo obligatorio del POS si la caja se encuentra cerrada (`HTTP 422`).
  - Vinculación atómica y serializada de cada venta al turno activo del cajero.
  - Cierre de caja mediante **Arqueo Ciego**: el cajero declara únicamente el efectivo físico contado sin acceso visual al saldo acumulado.
  - Cálculo automático e inmutable de la diferencia o descuadre (`monto_declarado - total_esperado`) en base de datos.
  - Auditoría administrativa con desglose por medios de pago (Efectivo, Débito, Crédito, Transferencia).
  - Vista mensual por defecto (`periodo=mes`) y conmutador para consulta histórica completa (`periodo=historico`).
  - Emisión de Acta de Arqueo formal imprimible adaptada para papel de mostrador (`@media print`).
- **No Incluye (Postergado a Incrementos Posteriores):**
  - Retiros parciales de efectivo durante el turno (drops de seguridad).
  - Múltiples cajas físicas concurrentes por sucursal.
  - Conciliación bancaria automatizada con pasarelas de pago.

## 3. Requisitos y Criterios de Aceptación
- **Requisitos Satisfechos:** RF-06 (Control de Apertura y Turnos), RF-07 (Arqueo y Cierre Ciego).
- **Criterios de Aceptación Cubiertos:**
  - `AC-CAJA-01`: Apertura de turno con monto inicial válido.
  - `AC-CAJA-02`: Bloqueo del POS cuando la caja está cerrada.
  - `AC-CAJA-03`: Arqueo ciego exacto sin descuadre.
  - `AC-CAJA-04`: Detección precisa de descuadre faltante o sobrante.
  - `AC-CAJA-05`: Inmutabilidad del turno cerrado tras el arqueo.
  - `AC-CAJA-06`: Auditoría administrativa con filtros por fecha, mes y cajero.
  - `AC-CAJA-07`: Rechazo de ítems duplicados en checkout (DEF-12).
  - `AC-CAJA-08`: Validación de medio de pago contra lista cerrada (DEF-13).
  - `AC-CAJA-09`: Rechazo de ventas concurrentes sobre turnos ya cerrados (DEF-14).

## 4. Priorización y Capacidad
- **Estimación:** 8 Puntos de Historia.
- **Historial de Priorización:** En Semana 4 fue excluido del MVP inicial por capacidad del equipo; repriorizado en la Semana 13 a raíz de la retroalimentación de la Demo 2 (OBS-18) para dotar de valor real y seguridad financiera a los comerciantes.
- **Estado Actual:** **Implementado y estabilizado en el Incremento 2** (PR #18 y correcciones DEF-11 a DEF-19).
