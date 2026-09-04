# Fuentes, Necesidades y Glosario Operativo

## Fuentes y Necesidades

| ID | Fuente | Evidencia o restricción | Necesidad / resultado | Confianza |
|----|--------|-------------------------|-----------------------|-----------|
| **N-01** | Usuario | P01: Cierres de caja toman 45 minutos y presentan descuadres. | Auditar las ventas y el flujo de caja del turno automáticamente. | Alta |
| **N-02** | Operación | O01: Demoras en el mostrador por navegación lenta. | Ingresar artículos a la venta rápidamente usando atajos de teclado o códigos. | Alta |
| **N-03** | Riesgo | Riesgo propio de arquitectura SaaS multi-tenant. | Aislar la información para que una PYME no vea datos de otra. | Alta |
| **N-04** | Proyecto | La primera fase culmina con una base ejecutable. | Demostrar comportamiento y calidad desde Semana 4. | Alta |
| **N-05** | Usuario | P01: Falta de un registro centralizado; ventas accidentales sin stock. | Registrar, ajustar y mantener el control exacto del stock y precios. | Alta |
| **N-06** | Usuario | P01: Dueño no quiere que los vendedores alteren precios o stock. | Controlar los accesos y restringir funciones operativas según el cargo. | Alta |
| **N-07** | Usuario | P01: Cuesta saber qué productos se venden más mirando cuadernos. | Visualizar el rendimiento de las ventas gráficamente para decisiones. | Alta |

## Prueba de Necesidad

| Comprobación | Sí / No | Evidencia o corrección |
|--------------|---------|------------------------|
| **La necesidad describe un resultado, no una pantalla o tecnología** | Sí | N-02 pide "ingresar rápidamente", no exige una GUI; N-05 exige "mantener control". |
| **Existe una fuente identificable** | Sí | O01, P01 y restricciones técnicas del proyecto. |
| **La confianza es explícita** | Sí | Todas fueron evaluadas como Alta tras la investigación en terreno. |
| **Sabemos qué decisión podría cambiar** | Sí | Integrar el inventario cambió las prioridades del MVP. |

## Glosario Operativo

| Término | Definición acordada | Ejemplo / límite | Responsable |
|---------|---------------------|------------------|-------------|
| **Turno de Caja** | Periodo de operación asignado a un usuario desde apertura hasta cierre. | Turno Mañana (08:00 - 15:00); requiere monto inicial. | Alan Troncoso |
| **Arqueo** | Cuadratura que compara las ventas en sistema con el conteo físico. | Diferencia $0 (Cuadrada) o -$5.000 (Descuadre). | Rodrigo Bertolini |
| **Tenant** | Inquilino o PYME individual que utiliza la plataforma SaaS. | Identificador único (`negocio_id`) en base de datos. | Leonel Ayala |
| **Venta Rápida** | Interfaz del POS diseñada para operar sin recargar la página. | Uso de teclado para buscar SKUs. | Luis Barrios |
