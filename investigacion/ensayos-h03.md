# Medición Automatizada y Estimación KLM de Apertura y Cierre de Caja (H-03)

- **Hipótesis H-03:** *El proceso de apertura y cierre ciego de caja es lo suficientemente ágil y ergonómico como para realizarse en menos de 60 segundos por operación en el mostrador.*
- **Fecha de ejecución:** 2026-11-15 03:35:13
- **Versión:** commit 13efbf9
- **Método:** `php artisan test --group=h03` (5 ensayos por operación) + `scripts/estimar-klm-h03.php`
- **Datos crudos:** [h03-tiempos-sistema.csv](../producto/semana-14/mediciones/h03-tiempos-sistema.csv) · **Resumen:** [h03-resumen.txt](../producto/semana-14/mediciones/h03-resumen.txt)

---

## 1. Modelo de Estimación KLM (Keystroke-Level Model)

Para estimar el tiempo del operador humano sin requerir cronometraje manual no determinista, se aplicó el modelo estándar KLM (Card, Moran y Newell) con parámetros de digitador promedio:
* **K (Keystroke):** 0,28 s
* **M (Preparación mental):** 1,35 s
* **Apertura de turno:** `M` (1,35 s) + `F2` (0,28 s) + escribir "50000" (5 × 0,28 s = 1,40 s) + `Enter` (0,28 s) = **3,31 s**.
* **Cierre con arqueo ciego:** `M` (1,35 s) + `F9` (0,28 s) + `M` (contar y recordar monto, 1,35 s) + escribir "53000" (5 × 0,28 s = 1,40 s) + `Enter` (0,28 s) = **4,66 s**.

---

## 2. Registro de Tiempos de los Ensayos Automatizados

### Operación: Apertura de Turno (POST /caja/abrir)

| Ensayo # | Tiempo Sistema (s) | Estimado KLM (s) | Total Estimado (s) | Umbral Máximo | ¿Cumple? |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | 0.4863 | 3.31 | 3.7963 | $\le 60\text{ s}$ | CUMPLE |
| 2 | 0.0038 | 3.31 | 3.3138 | $\le 60\text{ s}$ | CUMPLE |
| 3 | 0.0028 | 3.31 | 3.3128 | $\le 60\text{ s}$ | CUMPLE |
| 4 | 0.0034 | 3.31 | 3.3134 | $\le 60\text{ s}$ | CUMPLE |
| 5 | 0.0028 | 3.31 | 3.3128 | $\le 60\text{ s}$ | CUMPLE |

* **Promedio:** Sistema = 0.0998 s | Total estimado = **3.4098 s**
* **Máximo:** Sistema = 0.4863 s | Total estimado = **3.7963 s** (holgadamente $\le 60\text{ s}$)

### Operación: Cierre con Arqueo Ciego (POST /caja/cerrar)

| Ensayo # | Tiempo Sistema (s) | Estimado KLM (s) | Total Estimado (s) | Umbral Máximo | ¿Cumple? |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | 0.0111 | 4.66 | 4.6711 | $\le 60\text{ s}$ | CUMPLE |
| 2 | 0.0053 | 4.66 | 4.6653 | $\le 60\text{ s}$ | CUMPLE |
| 3 | 0.0068 | 4.66 | 4.6668 | $\le 60\text{ s}$ | CUMPLE |
| 4 | 0.0054 | 4.66 | 4.6654 | $\le 60\text{ s}$ | CUMPLE |
| 5 | 0.0051 | 4.66 | 4.6651 | $\le 60\text{ s}$ | CUMPLE |

* **Promedio:** Sistema = 0.0067 s | Total estimado = **4.6667 s**
* **Máximo:** Sistema = 0.0111 s | Total estimado = **4.6711 s** (holgadamente $\le 60\text{ s}$)

---

## 3. Limitaciones Técnicas Declaradas

* El tiempo del sistema se midió en proceso mediante el runner de PHPUnit sobre SQLite en memoria, sin latencia de red ni renderizado de navegador.
* El tiempo del cajero corresponde a una estimación analítica mediante el modelo KLM y no a una observación etnográfica presencial.
* No se incluye el tiempo de conteo físico del dinero en efectivo de la gaveta, el cual varía según la cantidad física de billetes y monedas en el mostrador.
* El test ejecuta los atajos de teclado `F2`, `F9` y `Enter` verificados en `gestisoft-app/resources/js/Pages/POS/Index.jsx`.
