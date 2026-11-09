# Registro de Entrevista Anonimizada Nº 03

**Código de Registro:** ENT-03  
**Fecha:** 30 de Agosto de 2026  
**Entrevistador:** Rodrigo Bertolini (PO) y Luis Barrios (UI/UX)  
**Tipo de Negocio:** Tienda de Cartas Coleccionables (TCG), Juegos de Mesa y Figuras  
**Ubicación:** Quilpué, Chile  
**Perfil del Entrevistado:** Encargado de Tienda y Cajero Principal  
**Modalidad:** Presencial en mostrador durante horario de atención  

---

## 1. Contexto Operativo del Negocio
* **Naturaleza de los productos:** Cientos de productos con nombres largos y específicos (ej. *"Sobre Booster Pack Escarlata y Púrpura"*, *"Elite Trainer Box Corona Astral"*), muchos con código de barras y otros clasificados por SKU interno.
* **Comportamiento del comprador:** Los clientes suelen consultar precios de múltiples productos antes de decidir qué llevar, o agregan productos de impulso al momento de pagar.
* **Punto de fricción crítico:** Si el cajero debe salir del Punto de Venta a mirar el inventario para responder una duda, pierde la lista de productos que ya le había ingresado al cliente que está esperando.

---

## 2. Preguntas y Respuestas Clave

### P1: ¿Cuál es la mayor frustración en el día a día al atender en el punto de venta?
> *"Cuando tengo a tres personas esperando en la caja y el que está atendiendo me pregunta '¿cuánto vale este mazo?' o '¿te queda stock de la figura de Mewtwo?'. Si tengo que salirme de la pantalla de venta para revisar el catálogo de productos, el sistema actual me borra todo el carrito del cliente que estaba pagando. Tengo que volver a escanear todo desde cero. Es una pérdida de tiempo absurda."*
* **Hallazgo / Evidencia:** Falta de persistencia del estado transaccional en el frontend ante cambios de vista.
* **Necesidad derivada:** Carrito de ventas persistente en el navegador (`localStorage`) aislado por usuario y negocio, impidiendo la pérdida accidental de datos.

---

### P2: ¿Cómo buscan los productos cuando el cliente no trae la caja con código de barras en la mano?
> *"Muchas cartas sueltas o carpetas no tienen código pegado, así que tenemos que buscar por texto. Si el buscador se demora dos o tres segundos por cada letra que escribo, o si tengo que tomar el mouse para hacer clic en el botón 'Buscar', el ritmo de atención se desploma. Necesito escribir tres letras y que aparezca al instante con su stock disponible."*
* **Hallazgo / Evidencia:** Requisito de rendimiento RNF-PERF-01 (respuesta < 1 segundo) y búsqueda reactiva.
* **Solución aplicada:** Endpoint de búsqueda optimizado con limitación a 10 resultados (`POSController@search`) y atajo `F4` con foco automático.

---

### P3: ¿Qué medios de pago reciben y cómo calculan el cambio?
> *"Recibimos efectivo, tarjetas de débito/crédito y transferencias. Con el efectivo, la gente suele pagar con billetes de $20.000 para compras chicas de $4.500. Si el cajero está cansado a las 8 de la noche, puede equivocarse en el vuelto. El sistema debe calcular el vuelto automáticamente al instante y discriminar el IVA para los reportes."*
* **Hallazgo / Evidencia:** Cálculo automatizado de vuelto y desglose de IVA (19%) en modal accesible.
* **Criterio de aceptación satisfecho:** Modal de pago con tecla de acceso rápido `F8`, cálculo de vuelto en tiempo real y registro del medio de pago.

---

## 3. Síntesis y Conclusiones del Entrevistador
1. **Persistencia del Carrito:** El carrito de ventas debe sobrevivir al cambio de pestañas o recargas accidentales de la página.
2. **Búsqueda Instantánea con Autocompletado:** Soporte dual para escáner físico de códigos de barra (SKU exacto) y búsqueda difusa por nombre.
3. **Cálculo de Totales sin Fricción:** Cálculo exacto de total, monto neto, IVA (19%) y cálculo automático de vuelto en efectivo.

