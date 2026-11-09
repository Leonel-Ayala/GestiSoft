# Registro de Entrevista Anonimizada Nº 01

**Código de Registro:** ENT-01  
**Fecha:** 28 de Agosto de 2026  
**Entrevistador:** Rodrigo Bertolini (Product Owner) y Alan Troncoso (QA)  
**Tipo de Negocio:** Minimarket y Almacén de Barrio (Sector Retail de Conveniencia)  
**Ubicación:** Región de Maule, Chile  
**Perfil del Entrevistado:** Dueña y Administradora General (Propietaria con más de 12 años en el rubro)  
**Modalidad:** Presencial en el local comercial (Observación directa + Entrevista semiestructurada)  

---

## 1. Contexto Operativo del Negocio
* **Horario de atención:** Lunes a sábado de 08:30 a 21:00 hrs.
* **Flujo de clientes:** Picos intensos de atención entre las 12:30 - 14:30 hrs y 18:30 - 20:30 hrs (hasta 45 personas por hora en mostrador).
* **Personal:** 2 empleados de apoyo en mostrador (turnos rotativos) y la dueña encargada de compras y cierre.
* **Herramientas actuales:** Cuaderno físico para registrar deudas/fiados, calculadora manual y un software POS local antiguo instalado en una máquina de escritorio lenta.

---

## 2. Preguntas y Respuestas Clave

### P1: ¿Cómo gestiona actualmente la venta y cobro en momentos de alta afluencia?
> *"En las horas punta se hace una fila que llega hasta la calle. El sistema que tenemos nos obliga a buscar el producto con el mouse, hacer clic en tres ventanas distintas para poner la cantidad y luego hacer clic en cobrar. Si el mouse falla o el vendedor se distrae, el cliente se impacienta. Lo ideal sería pasar el código de barras y apretar una sola tecla para cobrar en efectivo."*
* **Hallazgo / Evidencia:** **O01** (Demoras en el mostrador por navegación lenta con mouse).
* **Necesidad derivada:** **N-02** (Venta rápida operable 100% por teclado con atajos directos).

---

### P2: ¿Cómo realizan el cuadre o arqueo de caja al final de la jornada?
> *"El cierre es una pesadilla diaria. Nos toma entre 40 y 50 minutos contar todas las monedas, revisar los váucher de tarjetas y contrastarlo con lo que dice el cuaderno o el sistema. Casi todos los días tenemos diferencias: a veces faltan $4.000, otras veces sobran $2.000. No sé si es error al dar vuelto o si alguien tomó dinero."*
* **Hallazgo / Evidencia:** **P01** (Cierres lentos y descuadres de caja recurrentes).
* **Necesidad derivada:** **N-01** (Auditoría automática de ventas y control de turnos de caja).

---

### P3: ¿Qué ocurre cuando un producto se acaba físicamente en los estantes?
> *"Pasa muy seguido con bebidas o abarrotes de alta rotación. El cliente llega a la caja con el producto, pero el vendedor no sabe si en bodega queda más para reponer. O peor: a veces cobramos un encargo y cuando vamos a buscarlo a la bodega, no hay stock. Terminamos pidiendo disculpas y devolviendo dinero."*
* **Hallazgo / Evidencia:** Falta de inventario en tiempo real sincronizado con la venta.
* **Necesidad derivada:** **N-05** (Validación estricta de stock; impedir registrar ventas con stock negativo).

---

### P4: Si adoptara una solución en la nube (SaaS), ¿cuáles serían sus mayores temores?
> *"Me da miedo que si el sistema está en internet, los negocios del frente puedan ver cuánto vendo, qué productos compro o a qué precios vendo. Necesito la total seguridad de que mi información es completamente privada e invisible para otros."*
* **Hallazgo / Evidencia:** Riesgo de fuga o cohabitación de datos en sistemas multi-cliente.
* **Necesidad derivada:** **N-03 / RSK-03** (Arquitectura Multi-Tenant con estricto aislamiento de base de datos mediante Global Scopes).

---

## 3. Síntesis y Conclusiones del Entrevistador
1. **Prioridad 1:** Interfaz de Punto de Venta ultrarrápida sin dependencia del mouse (teclas de función directas como F4 para buscar y F8 para cobrar).
2. **Prioridad 2:** Bloqueo de ventas cuando el stock llega a cero.
3. **Prioridad 3:** Trazabilidad estricta de caja mediante turnos claros y cálculo de descuadres.

