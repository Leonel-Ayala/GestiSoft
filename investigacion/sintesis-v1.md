# Síntesis de Investigación y Descubrimiento (Versión 1)

**Producto:** GestiSoft (SaaS POS & Retail)  
**Fecha de consolidación:** Septiembre de 2026  
**Responsables:** Rodrigo Bertolini (PO), Alan Troncoso (QA), Luis Barrios (UI/UX), Leonel Ayala (Backend)  

---

## 1. Resumen Ejecutivo
A través de tres entrevistas presenciales en profundidad y observaciones directas en terreno ([ENT-01](registros-anonimizados/entrevista-01-minimarket-abarrotes.md), [ENT-02](registros-anonimizados/entrevista-02-tienda-vestuario.md) y [ENT-03](registros-anonimizados/entrevista-03-bazar-coleccionables.md)), el equipo identificó los dolores críticos que enfrentan los pequeños comercios del sector retail en Chile. 

El diagnóstico confirmó que los sistemas tradicionales son lentos, dependen excesivamente del mouse, no ofrecen auditoría de caja en tiempo real y exponen datos confidenciales de costos a los empleados de mostrador.

---

## 2. Mapeo de Dolores (Problemas) y Evidencias en Terreno

| ID Dolor | Descripción del Problema | Negocio Fuente | Impacto en el Comercio | Necesidad Asociada |
| :---: | :--- | :--- | :--- | :---: |
| **P01** | **Cierres de caja lentos con descuadres frecuentes.** | ENT-01 (Minimarket), ENT-02 (Ropa) | Pérdida de 40 a 50 minutos diarios; diferencias de dinero no rastreables ($5.000 a $15.000). | **N-01** (Auditoría de turnos y caja ciega). |
| **O01** | **Lentitud en el mostrador por uso forzado del mouse.** | ENT-01 (Abarrotes), ENT-03 (Coleccionables) | Filas de espera en horas punta; fricción y errores de cobro al cambiar de ventanas. | **N-02** (Atajos de teclado 100% y escáner de código). |
| **P02** | **Venta de productos sin stock físico en bodega.** | ENT-01 (Abarrotes), ENT-03 (Coleccionables) | Ventas accidentales sin inventario real; devoluciones forzadas y molestia del cliente. | **N-05** (Validación de stock y prevención de saldo negativo). |
| **P03** | **Desconfianza al delegar la caja por falta de roles.** | ENT-02 (Vestuario) | El dueño no puede ausentarse; empleados tienen acceso a costos base y pueden alterar precios. | **N-06** (Control de roles estricto: Admin vs Cajero). |
| **RSK-03** | **Miedo a la fuga de datos confidenciales en la nube.** | ENT-01 (Minimarket), ENT-03 (Coleccionables) | Reticencia a adoptar SaaS por temor a que la competencia vea ventas o catálogos. | **N-03** (Aislamiento Multi-Tenant con Global Scopes). |

---

## 3. Perfiles de Usuario (Arquetipos)

### Perfil A: Dueño / Administrador de la PYME (El Garante del Negocio)
* **Objetivo:** Delegar la operación diaria del mostrador sin perder el control financiero ni exponer sus márgenes de ganancia.
* **Funcionalidades requeridas:**
  * Gestión de catálogo, precios e inventario.
  * Creación y administración de cuentas de cajeros (`/users`).
  * Auditoría de mermas y ajustes justificados de stock (Kardex).
  * Reportes de ventas y cierres de turno.

### Perfil B: Cajero / Empleado de Mostrador (El Operador Rápido)
* **Objetivo:** Cobrar de forma rápida, exacta y sin fricciones durante las horas punta.
* **Funcionalidades requeridas:**
  * Pantalla única de Punto de Venta (`/pos`).
  * Atajos de teclado: `F4` (buscar producto), `F8` (abrir modal de cobro), `Enter` (agregar al carrito), `Esc` (cerrar modal).
  * Carrito persistente que no se borre al consultar otras vistas.
  * Cálculo automático de IVA (19%) y cálculo instantáneo de vuelto en efectivo.

---

## 4. Decisiones de Producto Derivadas de la Investigación

1. **Enfoque Estricto en Retail:** Se descartaron módulos para gastronomía (mesas, propinas, comandas) para optimizar el rendimiento al 100% en ventas por mostrador de retail.
2. **Arquitectura Multi-Tenant Segura:** Implementación del trait `HasNegocio` en Laravel para garantizar aislamiento matemático de datos entre tiendas.
3. **Corte Vertical de Seguridad:** Priorización del control de roles en el servidor (`RoleMiddleware`) antes de incorporar módulos analíticos avanzados.

