# PBI-01: Módulo Inventario - Gestión de Productos y Stock Base

## 1. Definición del Ítem
- **ID:** PBI-01
- **Título:** Módulo Inventario: Gestión de productos y Stock Base
- **Historia de Usuario (Valor):** HU-03 - *Como administrador, quiero registrar y ajustar el stock de mis productos para evitar vender artículos agotados.*
- **Evidencia y Necesidad:** Derivado de P01 (Ventas de artículos sin bodega) → Satisface N-05 (Mantener control exacto del stock).
- **Responsable de Aclarar:** Rodrigo Bertolini

## 2. Alcance
- **Incluye:** 
  - Crear productos / SKUs.
  - Definir cantidad de stock inicial.
  - Ajustar stock de forma manual por deterioro o conteo.
- **No Incluye:** 
  - Carga masiva de inventario mediante planillas Excel o CSV.
  - Control de lotes de vencimiento.

## 3. Requisitos y Aceptación
- **Requisitos Satisfechos:** RF-08, RF-09
- **Criterios de Aceptación:** AC-06, AC-07

## 4. Justificación de Priorización (Criterios Rúbrica)
- **Valor:** Permite al administrador poblar su sistema de manera estructurada, obteniendo control inmediato sobre las existencias reales, evitando ventas irreales.
- **Aprendizaje:** Valida que el proceso de alta manual de un SKU responde a las expectativas y velocidades requeridas por los dueños de negocios observados.
- **Riesgo:** Reduce la fricción operativa y asegura la calidad de los datos base antes de exponerlos a una interfaz de alto tráfico (POS).
- **Dependencias:** 
  - Requiere: Arquitectura Multi-tenant validada (**SPIKE-01**).
  - Es pre-requisito para: **PBI-02** (El POS reactivo no puede operar sin SKUs y stock definido previamente).
- **Estimación Preliminar:** 3 Puntos de Historia.
