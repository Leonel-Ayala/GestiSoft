# Atributos de Calidad y Restricciones (Seguridad y Privacidad)

Este documento detalla los Requisitos No Funcionales (RNF) de calidad y seguridad, así como las Restricciones (RES) aplicables al MVP de **GestiSoft**. Según la rúbrica de excelencia, cada atributo cuenta con una condición, respuesta esperada y una medida clara y explícita para su verificación.

## Atributos de Calidad y Seguridad (RNF)

| ID | Tipo | Condición | Respuesta Requerida | Medida / Prueba Explícita | Fuente |
|----|------|-----------|---------------------|---------------------------|--------|
| **RNF-PERF-01** | Rendimiento | Búsqueda y adición de un SKU al carro en el POS. | Mostrar el producto y actualizar totales sin recarga completa de la vista (comportamiento reactivo vía Inertia.js/React). | **p95 ≤ 1s** de tiempo de respuesta. | N-02 |
| **RNF-ACC-01** | Accesibilidad | Operación de atención rápida en el mostrador. | Permitir las acciones de buscar productos y cobrar utilizando el teclado en su totalidad, sin dependencia del mouse. | **100% operabilidad mediante atajos de teclado** y `autofocus` funcional. | N-02 |
| **RNF-SEC-01** | Seguridad | Petición de lectura/escritura de datos hacia la Base de Datos. | Filtrar obligatoriamente toda consulta por el `negocio_id` del usuario autenticado para garantizar aislamiento Multi-Tenant. | **Prueba AC-SEC-01** (Uso de *Global Scopes* en Laravel; 0% filtración entre tenants). | N-03 |

## Restricciones del Proyecto (RES)

| ID | Tipo | Condición | Respuesta Requerida | Medida / Prueba Explícita | Fuente |
|----|------|-----------|---------------------|---------------------------|--------|
| **RES-01** | Restricción | Diseño, desarrollo y pruebas del MVP. | No utilizar integraciones reales con el SII (facturación electrónica) ni almacenar datos verídicos de clientes finales. | **0 datos sensibles expuestos** en bases de datos de prueba o desarrollo. | DEC-03 |

## Revisión de Exposición, Privacidad y Desarrollo Seguro

Para asegurar el aislamiento y evitar la exposición de secretos corporativos, se establecen los siguientes tratamientos para la manipulación de información. Todo uso de datos debe limitarse a ambientes simulados y exclusivos.

| Elemento de Información | ¿Se Necesita para el MVP? | Riesgo Asociado | Tratamiento y Control Estricto |
|-------------------------|---------------------------|-----------------|--------------------------------|
| **Datos financieros reales** | No | Alta sensibilidad ante accesos no autorizados. | Excluir del prototipo. Utilizar únicamente montos generados por *Seeders* de prueba. |
| **RUT / Identidad del cliente** | No | Exposición innecesaria de identificación personal. | Implementar el concepto de "Cliente Genérico" en cada transacción. No solicitar RUT ni DNI. |
| **ID del Negocio (`negocio_id`)**| Sí | **Fuga de datos (Alta gravedad):** Visualización cruzada de información entre distintas PYMEs. | **Aislamiento forzado** a nivel de modelo mediante *Global Scopes* de Laravel. Tratamiento estricto de entradas y URL paramétricas. |
