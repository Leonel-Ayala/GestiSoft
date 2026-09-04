# Requisitos Funcionales

Este documento lista los Requisitos Funcionales (RF) para el proyecto **GestiSoft**, derivados de las necesidades validadas y estructurados para asegurar su singularidad, falta de ambigüedad y verificabilidad (según la rúbrica de evaluación). 

Se utiliza el estándar de redacción: `[ID] El producto debe [comportamiento observable] cuando [condición relevante], para satisfacer [necesidad].`

| ID | Necesidad | Requisito Funcional | Fuente | Verificación Prevista |
|----|-----------|---------------------|--------|-----------------------|
| **RF-01** | N-02 | El producto debe **agregar un ítem a la venta activa** al ingresar su SKU exacto en la interfaz POS, sin requerir clics adicionales. | O01 | AC-03; T-02 |
| **RF-02** | N-02 | El producto debe **incrementar la cantidad (+1) automáticamente** si se ingresa un SKU que ya existía previamente en el carro de compras activo. | O01 | AC-04 |
| **RF-03** | N-01 | El producto debe **advertir visualmente y bloquear la adición** al carro si el SKU ingresado no cuenta con stock disponible. | P01 | AC-05 |
| **RF-04** | N-02 | El producto debe **calcular y mostrar el vuelto exacto** a entregar cuando se ingresa el monto pagado en efectivo. | P01 | T-04 |
| **RF-05** | N-01 | El producto debe **registrar la transacción, descontar el inventario y vaciar el carro** al confirmar la venta exitosamente. | O01 | T-05 |
| **RF-06** | N-01 | El producto debe **calcular y exhibir la suma total de ingresos** del turno activo al momento de solicitar el cierre de caja. | P01 | AC-01 |
| **RF-07** | N-01 | El producto debe **impedir el cierre del turno** y mostrar una advertencia operativa si existe una venta en curso sin confirmar o anular. | P01 | AC-02 |
| **RF-08** | N-05 | El producto debe **permitir registrar un nuevo SKU** indicando explícitamente nombre, precio de venta y cantidad de stock inicial. | P01 | AC-06 |
| **RF-09** | N-05 | El producto debe **permitir ajustar manualmente la cantidad de stock** de un producto existente, registrando el cambio efectuado. | P01 | AC-07 |
| **RF-10** | N-06 | El producto debe **permitir al administrador crear credenciales de acceso** para nuevos empleados, asignándoles el rol de "Cajero". | P01 | AC-08 |
| **RF-11** | N-06 | El producto debe **bloquear el acceso al módulo de Inventario y Cierre de Caja** si el usuario autenticado tiene asignado únicamente el rol de "Cajero". | P01 | AC-09 |
| **RF-12** | N-07 | El producto debe **calcular y mostrar el total de ingresos generados** en los últimos 7 días de operación y en fechas específicas que el administrador defina. | P01 | AC-10 |
| **RF-13** | N-07 | El producto debe **renderizar un gráfico visual** (ej. barras o líneas) con el "Top 5" de productos más vendidos en el mes actual. | P01 | AC-10, AC-11 |

## Revisión de Calidad del Requisito

Todos los requisitos presentados cumplen con los siguientes criterios de calidad (evaluados con "Sí"):
- **Necesario:** Derivado directamente de una necesidad validada (N-01 a N-07).
- **Singular:** Cada RF define un único comportamiento atómico (no mezcla validaciones y reportes en una sola línea).
- **No ambiguo:** Se utilizan términos precisos del glosario (SKU, POS, Turno, Cajero).
- **Factible:** Implementable dentro de las restricciones de Laravel 11, React (Inertia.js) y Tailwind CSS.
- **Verificable:** Cada RF cuenta con Criterios de Aceptación (AC) o Pruebas Previstas (T) directamente asociadas.
