# Verificación de Insumos (Semana 2 -> Semana 3)

| Insumo | Estado | Ubicación / enlace | Decisión o uso en Semana 3 |
|--------|--------|--------------------|----------------------------|
| **Evidencia y registros** | Listo | `research/registros-anonimizados/` | Sustentar necesidades N-01 (Caja) y N-02 (Agilidad POS). |
| **Síntesis de hallazgos** | Listo | `research/sintesis-v1.md` | Priorizar el módulo POS sobre las cotizaciones. |
| **Problema y visión** | Listo | `product/vision-v1.md` | Mantener el resultado esperado enfocado en Retail y Comercio. |
| **Alcance y exclusiones** | Listo | `product/scope-success-v1.md` | Integración con SII (facturación electrónica) permanece fuera. |
| **Riesgos prioritarios** | Revisar | `risk/registro-v1.csv` | Convertir el riesgo de mezcla de datos (Multi-tenant) en SPIKE-01. |

## Decisiones de Entrada
| ID | Decisión vigente | Evidencia | Qué podría hacerla cambiar |
|----|------------------|-----------|----------------------------|
| **DEC-01** | Priorizar velocidad por teclado en el POS sobre uso del mouse. | O01 (Demora de 15s extra por venta manual). | Evidencia de que el local usa pantallas 100% táctiles sin teclado físico. |
| **DEC-02** | Excluir funcionalidades ajenas al comercio retail (ej. restaurantes). | Definición SaaS del proyecto. | Un pivote forzado hacia el rubro gastronómico. |
| **DEC-03** | Aislamiento estricto de base de datos desde el MVP. | RSK-03 (Exposición de datos). | Reducción de alcance a una aplicación monousuario (Desktop). |
