# Reporte de Mediciones y Atributos de Calidad — Semana 14 (GestiSoft)

- **Versión evaluada:** `v0.2.0-rc2` (Incremento 2)
- **Fecha de ejecución:** 2026-11-14 16:48:40
- **Responsables:** Alan Troncoso (QA Lead / Automatización) y Luis Barrios (UI-UX)
- **Script de automatización:** `scripts/medir-latencia.php`
- **Comando ejecutado:** `php scripts/medir-latencia.php --n=50`
- **Archivo de datos crudos (CSV):** [mediciones/latencias-20261114-1648.csv](mediciones/latencias-20261114-1648.csv)
- **Archivo de resumen:** [mediciones/latencias-20261114-1648-resumen.txt](mediciones/latencias-20261114-1648-resumen.txt)

> **Nota de rectificación metodológica (C12):** El reporte preliminar de la Semana 13 contenía estadísticas inconsistentes (la tabla indicaba mín 48 ms / prom 78 ms cuando el recálculo aritmético de las 50 muestras crudas daba mín 65 ms / prom 83,1 ms). En cumplimiento de la rúbrica de la Semana 14, se descarta el registro manual y se reemplaza íntegramente por mediciones automatizadas reproducibles generadas por script con cálculo de percentiles bajo el método nearest-rank (`ceil(p/100 * n)`).

---

## 1. Entorno de Medición

- **Intérprete:** PHP 8.5.12 (CLI Visual C++ 2022 x64) sobre Windows 11 (WINNT).
- **Modo de ejecución:** Laravel Kernel Request Dispatcher (`$app->handleRequest()`, medición de ciclo completo de petición HTTP, middleware, routing, controladores y persistencia).
- **Motor de Base de Datos:** SQLite in-memory (conmutación reproducible documentada en T-1.9 ante ausencia de demonio MySQL local).
- **Procesador y recursos:** 12 hilos lógicos / 16 GB RAM.

---

## 2. Resultados de Latencia y Cumplimiento de Umbrales (RNF-PERF)

Los umbrales unificados de calidad comprometidos para el Punto de Venta en mostrador son:
1. **Búsqueda reactiva de productos:** $p95 \le 150\text{ ms}$
2. **Estado de caja / consulta de turno:** $p95 \le 300\text{ ms}$
3. **Checkout transaccional con arqueo y Kardex:** $p95 \le 500\text{ ms}$

| Operación | Muestras ($n$) | Mínimo | Promedio | Percentil 90 ($p90$) | Percentil 95 ($p95$) | Máximo | Umbral $p95$ | Cumplimiento |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Búsqueda de productos (`GET /pos/search`)** | 50 | 2.28 ms | 4.83 ms | 4.77 ms | **10.77 ms** | 71.65 ms | $\le 150.00\text{ ms}$ | **CUMPLE** |
| **Estado de caja (`GET /caja/estado`)** | 50 | 2.20 ms | 2.40 ms | 2.54 ms | **2.87 ms** | 5.53 ms | $\le 300.00\text{ ms}$ | **CUMPLE** |
| **Checkout POS (`POST /pos/checkout`)** | 50 | 3.42 ms | 8.94 ms | 5.45 ms | **6.63 ms** | 246.76 ms | $\le 500.00\text{ ms}$ | **CUMPLE** |

*Cálculo de percentiles según estándar NIST Nearest-Rank: para $n = 50$, $p90 = \text{muestra } 45$ y $p95 = \text{muestra } 48$.*

---

## 3. Checklist de Accesibilidad y Operatividad por Teclado (RNF-ACC)

El módulo de Punto de Venta (`resources/js/Pages/POS/Index.jsx`) implementa atajos de teclado globales y gestión de foco accesible para permitir una venta completa sin manipular el ratón:

| Flujo / Acción | Atajo Teclado | Implementación en Código (`POS/Index.jsx`) | Estado |
| :--- | :---: | :--- | :---: |
| **Apertura de turno** | `F2` | Despliega modal de apertura de caja cuando el turno está cerrado. | **Verificado** |
| **Buscador de productos** | `F4` | Enfoca automáticamente `searchInputRef` para teclear SKU o nombre. | **Verificado** |
| **Modal de cobro** | `F8` | Abre diálogo de pago con carrito activo y turno abierto. | **Verificado** |
| **Cierre de caja / Arqueo** | `F9` | Abre modal de arqueo ciego para declarar efectivo físico. | **Verificado** |
| **Confirmar venta** | `Enter` | Despacha el checkout si el monto recibido cubre el total. | **Verificado** |
| **Cerrar modales** | `Escape` | Cierra cualquier modal activo y retorna foco a la búsqueda. | **Verificado** |

---

## 4. Limitaciones Conocidas del Banco de Pruebas

1. **Entorno local:** Las mediciones fueron tomadas en banco de pruebas local de desarrollo. No incorporan la latencia de red WAN de clientes remotos (típicamente 30–80 ms adicionales en conexiones móviles o residenciales).
2. **Carga mono-hilo:** La serie de 50 peticiones se ejecutó de forma secuencial. Aunque refleja la fluidez de un mostrador estándar, no somete la base de datos a contención concurrente de múltiples cajas simultáneas.
