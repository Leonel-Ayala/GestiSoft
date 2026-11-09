# Registro de Riesgos del Proyecto (Versión 1)

**Producto:** GestiSoft (SaaS POS & Retail)  
**Semana de Línea Base:** Semana 3 (Actualizado en Semana 6 e Incremento 1)  
**Líder de QA y Riesgos:** Alan Troncoso  
**Archivo estructurado:** [`registro-v1.csv`](registro-v1.csv)  

---

## 1. Criterios de Evaluación de Riesgos

* **Probabilidad:** Baja (1), Media (2), Alta (3)
* **Impacto:** Menor (1), Moderado (2), Alto (3), Crítico (4)
* **Nivel de Severidad:**  
  * **Crítico / Alto:** Requiere acción de mitigación obligatoria antes de liberar el incremento (Spike técnico o bloqueo de release).
  * **Medio:** Monitoreo constante y validación en revisiones de código cruzadas (*Code Reviews*).
  * **Bajo:** Aceptación informada.

---

## 2. Matriz Consolidada de Riesgos

| ID | Categoría | Descripción del Riesgo | Probabilidad | Impacto | Nivel | Estrategia | Acción de Mitigación / Contingencia | Responsable | Estado |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- | :---: |
| **RSK-01** | Técnico | **Filtración de datos entre comercios:** Al compartir una única BD MySQL, una consulta mal armada podría exponer productos o ventas de otra tienda. | Media | Crítico | **Alto** | Mitigar | Creación del Trait `HasNegocio` con *Global Scopes* automáticos en Laravel. Validado en test `MultiTenantSecurityTest.php`. | Leonel Ayala | **Mitigado** |
| **RSK-02** | Usabilidad | **Pérdida de foco en el POS:** Al mostrar alertas o errores en horas punta, el foco se pierde obligando al cajero a usar el mouse y retrasando la fila. | Alta | Alto | **Alto** | Mitigar | Manejo de `autofocus` persistente con React `useRef`, atajos `[F4]` buscar, `[F8]` cobrar y cierre con `[Esc]`. | Luis Barrios | **Mitigado** |
| **RSK-03** | Seguridad | **Riesgo comercial por desconfianza en la nube:** Comerciantes temen adoptar el SaaS por miedo a que la competencia acceda a sus márgenes o catálogo. | Alta | Crítico | **Alto** | Evitar | Aislamiento forzado en el servidor, validación de sesiones con tokens seguros y cifrado de contraseñas con Bcrypt. | Rodrigo Bertolini | **Mitigado** |
| **RSK-04** | Seguridad | **Falsa sensación de seguridad (Visual vs Backend):** Ocultar menús en React pero olvidar proteger la ruta en Laravel, permitiendo acceso forzado por URL. | Media | Crítico | **Alto** | Mitigar | Implementación del `RoleMiddleware` en el Kernel HTTP; cualquier acceso no autorizado devuelve código `HTTP 403 Forbidden`. | Alan Troncoso | **Mitigado** |
| **RSK-05** | Operativo | **Bloqueo accidental del Administrador:** Un dueño modifica su propio rol a Cajero o se auto-elimina, dejando el negocio sin administración. | Media | Alto | **Medio** | Evitar | Validación en `UserController@destroy` que impide expresamente que un usuario autenticado pueda eliminarse a sí mismo. | Luis Barrios | **Mitigado** |
| **RSK-06** | Rendimiento | **Degradación del POS ante catálogos masivos:** Si una tienda carga más de 2.000 productos, la búsqueda reactiva podría violar el requisito `RNF-PERF-01` (p95 ≤ 1s). | Media | Alto | **Medio** | Mitigar | Endpoint de búsqueda limitado a 10 resultados concurrentes (`POSController@search`) e indexación única de SKU por tenant. | Leonel Ayala | **Controlado** |

---

## 3. Seguimiento en el Ciclo Ágil
* Todo riesgo con nivel **Alto** o **Crítico** generó una decisión arquitectónica (**ADR**), un experimento técnico (**SPIKE**) o una prueba automatizada en la suite de pruebas unitarias/funcionales.
* Ningún Pull Request se aprueba en el repositorio si compromete las medidas de mitigación descritas en esta matriz.

