# GUÍA ESTRATÉGICA Y GUIÓN DE PRESENTACIÓN - TERCERA DEMOSTRACIÓN Y DEFENSA
## GestiSoft: Evolución, Calidad y Estabilización (Versión Candidata v0.2.0-rc3)

* **Asignatura:** Taller de Desarrollo de Software (INF524) – Facultad de Ingeniería UCM
* **Docentes Evaluadores:** Héctor Tejo Uval y Jerman Espíndola Sandoval
* **Equipo Evaluado:** Grupo 6
* **Distribución Oficial de Roles para la Presentación:**
  * **Rodrigo Bertolini (Product Owner / Backend Lead):** FASE 1 completa (Aprendizaje, Valor de Negocio, Alcance, Backlog y Requisitos), Apertura de la DEMOSTRACIÓN EN VIVO (bloqueo sin turno, apertura de caja y contexto de negocio), Riesgos (RSK-01 a RSK-18), Próximos Pasos y Cierre Institucional.
  * **Luis Barrios (Frontend Lead / UI-UX):** Explicación de la **Arquitectura Frontend y Diseño Visual / UI-UX** (Componentes React 18, Inertia.js, Ergonomía de Mostrador con estado local en carrito sin peticiones al servidor, Atajos de Teclado [F2, F4, F8, F9], Arqueo Ciego ADR-04, Acta Oficial Imprimible `@media print` y Selector de Períodos de Auditoría) y Conducción en la DEMOSTRACIÓN EN VIVO de la operativa de mostrador por teclado, arqueo ciego y acta.
  * **Leonel Ayala (Full Stack / Base de Datos Lead):** Explicación de la **Arquitectura Backend / Base de Datos** (C4 Contenedores, Persistencia Transaccional, Recálculo Seguro C1, Inmutabilidad Kardex SoftDeletes C3, ADR-06 principio de mínimo privilegio en usuarios y Reproducibilidad) y Conducción en la DEMOSTRACIÓN EN VIVO de concurrencia (`lockForUpdate`), trazabilidad de venta en Kardex y auditoría de cajas (mes vs histórico).
  * **Alan Troncoso (Scrum Master / QA, Seguridad y Automatización Lead):** FASE 4 completa de **QA y Verificación Cuantitativa** (Batería de 76 pruebas / 306 aserciones, Suite de Regresión con 24 tests, Atributos de Calidad p95 reales con script cronometrado, Seguridad RBAC/IDOR, Matriz de Trazabilidad CSV con 41 filas, Pipeline CI en GitHub Actions y Definition of Done) y Verificación en la DEMOSTRACIÓN EN VIVO de seguridad y suites de tests en terminal.
* **Tiempo Total:** 20 minutos (12 min diapositivas + 8 min demostración en vivo) + Ronda de preguntas individuales.

---

## 1. Matriz de Slides y Mapeo Exhaustivo con la Rúbrica S14

| Slide # | Título en la Presentación | Criterio Rúbrica INF524 | Expositor Asignado | Tabla Exacta a Proyectar | Documento Fuente Oficial |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **01** | Portada Corporativa y Versión Candidata | **Criterio 4** | **Rodrigo Bertolini** | Ficha Técnica Oficial del Entregable | [README.md](../README.md) (Tag `v0.2.0-rc3`) |
| **02** | Contexto del Negocio y Dolor Financiero | **Criterio 2** | **Rodrigo Bertolini** | Matriz de Entrevistas de Descubrimiento (`ENT-01`, `ENT-02`, `ENT-03`) | `investigacion/registros-anonimizados/` |
| **03** | Separador FASE 1: Aprendizaje, Valor y Alcance | **Criterios 1 al 8** | **Rodrigo Bertolini** | Hoja de Ruta FASE 1 (Criterios 1 al 8 de la Rúbrica) | `guia-semana14.md` Secciones 1 a 8 |
| **04** | Retroalimentación 2ª Defensa y Mitigaciones C1-C4 | **Criterio 1** | **Rodrigo Bertolini** | Tabla Literal de Retroalimentación (`OBS-18` a `OBS-30`) | `guia-semana14.md` Sección 1 |
| **05** | Retrospectiva del Equipo (Compromisos Verificables) | **Criterio 1** | **Rodrigo Bertolini** | Matriz de Retrospectiva (Mantener, Corregir, Detener, Comenzar) | `docs/acuerdo-equipo.md` y retrospectiva |
| **06** | Objetivo Incremento 2 e Hipótesis (H-01, H-03, H-04) | **Criterio 2** | **Rodrigo Bertolini** | Tabla Literal de Hipótesis y Señales Observables | `guia-semana14.md` Sección 2.2 |
| **07** | Alcance, Límites (Incluye/Posterga/Excluye) | **Criterio 3** | **Rodrigo Bertolini** | Tabla Literal de Límites del Alcance del Incremento 2 | `guia-semana14.md` Sección 3.1 |
| **08** | Flujo Operativo de Caja y Arqueo Ciego | **Criterio 5 y 6** | **Rodrigo Bertolini** | Fases del Recorrido Operativo de Caja y Mecanismos de Control | `guia-semana14.md` Sección 5 |
| **09** | Refinamiento del Product Backlog (PBI-03 y Defectos P0) | **Criterio 3** | **Rodrigo Bertolini** | Tabla Literal de Product Backlog Refinado y Priorizado | `guia-semana14.md` Sección 3.2 |
| **10** | Criterios de Aceptación BDD (Normal, Bordes, Errores) | **Criterios 7 y 8** | **Rodrigo Bertolini** | Catálogo Consolidado de Criterios de Aceptación BDD | `guia-semana14.md` Secciones 7 y 8 |
| **11** | Separador FASE 2: Arquitectura y Decisiones | **Criterios 4, 14 y 15** | **Leonel Ayala** | Hoja de Ruta FASE 2 (Arquitectura, Repositorio y Decisiones) | `guia-semana14.md` Secciones 4, 14 y 15 |
| **12** | Modelo C4 Contenedores y Persistencia de Datos | **Criterio 15 (y C5)** | **Leonel Ayala** | Matriz de Contenedores C4 y Responsabilidades de Persistencia | `guia-semana14.md` Sección 15 |
| **13** | Drivers Arquitectónicos y Arquitectura Visual / UX | **Criterio 15** | **Luis Barrios** | Tabla de Drivers Arquitectónicos (`DA-06` a `DA-11`) | `guia-semana14.md` Sección 15 |
| **14** | Registros de Decisión Arquitectónica (ADR-01 a ADR-07) | **Criterio 15** | **Leonel Ayala & Luis Barrios** | Catálogo Consolidado de Decisiones Arquitectónicas (ADR) | `guia-semana14.md` Sec. 15 y `docs/adr/` |
| **15** | Pila Tecnológica, Reproducibilidad y Configuración | **Criterio 4** | **Leonel Ayala** | Tabla de Stack Tecnológico y Procedimiento Reproducible | [README.md](../README.md) y `guia-semana14.md` |
| **16** | Organización del Equipo, Responsabilidades y Sprints | **Criterio 14** | **Rodrigo Bertolini** | Matriz de Responsabilidades Técnicas y Roles del Equipo | `guia-semana14.md` Sección 14 |
| **17** | Separador FASE 3: Demostración en Vivo del Software | **Criterios 17-20** | **Los 4 Integrantes** | Pauta Cronometrada de la Demostración Funcional en Vivo | `guia-semana14.md` Sección 16.1 |
| **18** | Separador FASE 4: QA, Mediciones y Trazabilidad | **Criterios 9 a 13, 15 y 16** | **Alan Troncoso** | Hoja de Ruta FASE 4 (QA, Calidad, Seguridad y Estabilización) | `guia-semana14.md` Secciones 9 a 16 |
| **19** | Batería de Pruebas Automatizadas y Regresión (76 Tests) | **Criterio 9 y 10** | **Alan Troncoso** | Tabla Literal de Regresión y Resumen de Suite (76 tests) | `guia-semana14.md` Secciones 9 a 10 |
| **20** | Atributos de Calidad con Mediciones Reales (p95 y H-03) | **Criterio 12** | **Alan Troncoso** | Tabla Literal de Mediciones de Atributos de Calidad | `guia-semana14.md` Sección 12 |
| **21** | Seguridad y Privacidad Verificables (RBAC, C1, C4, IDOR, ADR-06) | **Criterio 13** | **Alan Troncoso** | Matriz de Controles de Seguridad Proporcionales al Riesgo | `guia-semana14.md` Sección 13 |
| **22** | Matriz de Trazabilidad Bidireccional (CSV) | **Criterio 15 (y C10)** | **Alan Troncoso** | Muestra de Matriz de Trazabilidad Bidireccional (41 filas) | [producto/semana-14/trazabilidad.csv](../producto/semana-14/trazabilidad.csv) |
| **23** | Repositorio, CI en GitHub Actions y Plantilla PR | **Criterio 14** | **Alan Troncoso** | Tabla Literal de Pull Requests e Integración Continua | `guia-semana14.md` Sección 14 |
| **24** | Definition of Done (6 Dimensiones) y Estabilización | **Criterio 11** | **Alan Troncoso** | Tabla Literal de Definition of Done (6 Dimensiones) | `guia-semana14.md` Sección 11 |
| **25** | Gestión de Riesgos Actualizados (RSK-07 al RSK-18) | **Criterio 15** | **Rodrigo Bertolini** | Tabla Literal de Riesgos Vigentes del Proyecto | `riesgos/registro-riesgos-v1.md` / `registro-v1.csv` |
| **26** | Versión Candidata, Limitaciones Honestas y Próximos Pasos | **Criterio 16** | **Rodrigo Bertolini** | Tabla Literal de Balance de Estado y Limitaciones Técnicas | `guia-semana14.md` Secciones 16.2 y 16.3 |
| **27** | Portada de Cierre y Ronda de Preguntas Técnicas | **Criterio 16** | **Rodrigo Bertolini (Apertura)** | Tabla Literal de Comprobación Final (Anexo A) | `guia-semana14.md` Anexo A |

---

## 2. Guión Detallado por Slide (Contenido, Documentos y Speech Técnico)

---

### SLIDE 01: Portada Corporativa y Versión Candidata
* **Expositor:** Rodrigo Bertolini (Product Owner)
* **Criterio de la Rúbrica S14:** **Criterio 4** (Producto ejecutable y versión candidata reproducible).
* **Documento Fuente Oficial:** [README.md](../README.md) y [guia-semana14.md](./guia-semana14.md) Sección 4.
* **Elementos Visuales:** Logo oficial de GestiSoft, versión destacada `v0.2.0-rc3`, datos institucionales UCM y equipo evaluado.

#### 📊 Tabla Exacta para la Diapositiva:
| Parámetro del Entregable | Valor Oficial en el Repositorio |
| :--- | :--- |
| **Nombre del Producto** | GestiSoft (Sistema Web SaaS de POS, Gestión Comercial e Inventario para Retail) |
| **Incremento Funcional** | Incremento 2: Evolución, Calidad y Estabilización |
| **Versión Candidata Oficial** | `v0.2.0-rc3` (Tag y Release formal en GitHub) |
| **Asignatura / Carrera** | Taller de Desarrollo de Software (INF524) – Escuela de Ingeniería Civil Informática UCM |
| **Docentes Evaluadores** | Prof. Héctor Tejo Uval y Prof. Jerman Espíndola Sandoval |
| **Equipo de Trabajo (Grupo 6)** | Rodrigo Bertolini (PO), Luis Barrios (UI-UX), Leonel Ayala (Full Stack/BD), Alan Troncoso (QA/CI) |
| **Estado de Pruebas y CI** | 76 pruebas pasando al 100% en verde (306 aserciones, 24 de regresión) en GitHub Actions |

* **Puntos Clave para Explicar la Tabla:**
  * Destacar que la entrega está formalmente congelada en la etiqueta `v0.2.0-rc3` y respaldada por un Release público.
  * Resaltar la distribución técnica de roles del equipo (PO, UX, Backend, QA) con titularidad verificable.

* **Guión del Expositor (Rodrigo):**
  > *"Estimados profesores Héctor Tejo y Jerman Espíndola. Como Grupo 6, presentamos la Tercera Demostración y Defensa de GestiSoft, nuestro sistema web de gestión comercial, inventario y punto de venta diseñado para PYMEs del retail local. Hoy defendemos el cierre del Incremento Funcional 2 bajo nuestra versión candidata `v0.2.0-rc3`. A lo largo de esta presentación y en la demostración en vivo, evidenciamos cómo convertimos cada una de las observaciones de la segunda defensa en soluciones de ingeniería verificables: integridad financiera en servidor, arqueo ciego de caja, inmutabilidad de Kardex, trazabilidad automática de ventas a movimientos de inventario y una batería de 76 pruebas automatizadas con suite de regresión integradas en GitHub Actions."*

---

### SLIDE 02: Contexto del Negocio y Dolor Financiero
* **Expositor:** Rodrigo Bertolini (Product Owner)
* **Criterio de la Rúbrica S14:** **Criterio 2** (Objetivo, hipótesis de valor y señal de éxito).
* **Documento Fuente Oficial:** [investigacion/registros-anonimizados/](../investigacion/registros-anonimizados/) (`entrevista-01`, `02`, `03`) y [guia-semana14.md](./guia-semana14.md) Sección 2.1.
* **Elementos Visuales:** Iconos de los 3 tipos de comercios evaluados y resumen del dolor operativo del efectivo.

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `investigacion/registros-anonimizados/`):
| Registro | Tipo de negocio y ubicación | Dolor detectado (hallazgo) | Necesidad derivada |
| :---: | :--- | :--- | :---: |
| **ENT-01** | Minimarket y almacén de barrio · Región del Maule | P01: cierres de caja lentos (40–50 min) y descuadres recurrentes. | **N-01** (control de turnos y auditoría de ventas) |
| **ENT-02** | Tienda de vestuario y calzado urbano · Viña del Mar | OBS-02: no puede delegar la caja sin exponer costos/márgenes ni arriesgar cambios de precio. | **N-06** (segregación de funciones admin/cajero) |
| **ENT-03** | Tienda de cartas coleccionables (TCG) · Quilpué | Pérdida del carrito al cambiar de vista y búsqueda lenta en catálogos con nombres largos. | Carrito persistente aislado por usuario y negocio; RNF-PERF-01 |

* **Puntos Clave para Explicar la Tabla:**
  * Explicar que el problema raíz de los comercios entrevistados en Maule y Valparaíso es el descontrol del efectivo y la imposibilidad de delegar la caja con tranquilidad.
  * Mapear cada comercio a las necesidades registradas en el backlog del sistema (`N-01`, `N-06` y persistencia en `localStorage`).

* **Guión del Expositor (Rodrigo):**
  > *"Durante el proceso de descubrimiento con pequeños comercios de las regiones del Maule y Valparaíso, detectamos que el dolor más crítico no radicaba en la falta de analítica predictiva, sino en el descontrol del dinero en efectivo y el temor a dejar solos a los empleados operando la caja. En el cuaderno y la calculadora no existe trazabilidad entre lo cobrado y lo vendido, y los sistemas tradicionales permiten alterar precios o inventario sin justificación. GestiSoft resuelve este problema dotando a la PYME de separación de roles y cuadratura ciega de caja."*

---

### SLIDE 03: Separador FASE 1: Aprendizaje, Valor de Negocio y Alcance
* **Expositor:** Rodrigo Bertolini (Product Owner)
* **Criterio de la Rúbrica S14:** **Introducción a la FASE 1** (Criterios 1 al 8 de la Rúbrica de Evaluación Grupal).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Secciones 1 a 8.
* **Elementos Visuales:** Banner institucional: *FASE 1: Aprendizaje de la 2ª Defensa, Valor de Negocio y Alcance Refinado*.

#### 📊 Tabla Exacta para la Diapositiva:
| Slide | Tema Abordado en la Presentación | Sección en `guia-semana14.md` | Criterio Rúbrica S14 |
| :---: | :--- | :--- | :--- |
| **Slide 04** | Retroalimentación de la 2.ª Defensa y Mitigaciones C1 a C4 | Sección 1 (OBS-18 a OBS-30) | C1: Retroalimentación y evolución |
| **Slide 05** | Retrospectiva del Equipo (Compromisos Verificables) | Sección 2.1 (Retrospectiva) | C2: Compromisos de proceso |
| **Slide 06** | Objetivo del Incremento 2 e Hipótesis (H-01, H-03, H-04) | Sección 2.2 (Hipótesis y señales) | C2: Objetivo, hipótesis y señal |
| **Slide 07** | Alcance y Límites (Incluye / Posterga / Excluye) | Sección 3.1 (Límites del alcance) | C3: Alcance y límites claros |
| **Slide 08** | Flujo Operativo de Caja y Arqueo Ciego | Sección 4 (Flujo de valor) | C5 y C6: Corte vertical e integridad |
| **Slide 09** | Refinamiento del Product Backlog (PBI-03 y Defectos P0) | Sección 3.2 (Backlog priorizado) | C3: Backlog refinado por valor |
| **Slide 10** | Criterios de Aceptación BDD (Normal, Alternativo y Error) | Secciones 7 y 8 (Criterios BDD) | C7 y C8: Criterios de aceptación |

* **Puntos Clave para Explicar la Tabla:**
  * Explicar que la Fase 1 cubre de forma directa y trazable los primeros 8 criterios de la rúbrica de evaluación.

* **Guión del Expositor (Rodrigo):**
  > *"Comenzamos con la Fase 1, donde revisamos cómo transformamos la retroalimentación docente en decisiones formales de producto, alcance y refinamiento del backlog con estricta trazabilidad."*

---

### SLIDE 04: Retroalimentación de la Segunda Defensa y Mitigaciones C1 a C4
* **Expositor:** Rodrigo Bertolini (Product Owner)
* **Criterio de la Rúbrica S14:** **Criterio 1** (Retroalimentación de la segunda defensa y evolución del producto).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 1: "Retroalimentación de la 2.ª defensa y evolución del producto (C1)".
* **Elementos Visuales:** Matriz oficial de observaciones `OBS-18` a `OBS-30` con foco en las 4 vulnerabilidades críticas resueltas.

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `guia-semana14.md` Sección 1):
| ID | Criterio S12 | Hecho Observable en la Defensa | Decisión y Acción Correctiva en GestiSoft | Artefacto Modificado | Enlace a PR / Commit | Estado |
| :---: | :---: | :--- | :--- | :--- | :---: | :---: |
| **OBS-18** | 10 | **C5:** Ausencia de control de turnos de caja y arqueo ciego en punto de venta. | Implementación completa del módulo de turnos de caja, bloqueo de POS sin caja y arqueo ciego. | `TurnoCaja.php`, `CajaController.php` | [PR #15–#17 y #18](https://github.com/Leonel-Ayala/GestiSoft/pull/18) | **Cerrado** |
| **OBS-19** | 8 y 12 | **C1:** El método `checkout()` aceptaba importes y precios desde el cliente (vulnerabilidad de manipulación). | Recálculo obligatorio en servidor: `lockForUpdate()`, catálogo de BD, cálculo de neto, IVA y vuelto en backend. | [ADR-03](adr/ADR-03-precios-calculados-en-servidor.md), `POSController.php` | [PR #18](https://github.com/Leonel-Ayala/GestiSoft/pull/18) | **Cerrado** |
| **OBS-20** | 8 y 9 | **C2:** `required_if:stock,!=X` inoperante; actualización de stock y Kardex no eran atómicos. | Uso de `Rule::requiredIf(fn() => →nuevo != →anterior)` y envoltura en `DB::transaction()` con reversión ante fallos. | `ProductController.php`, `InventoryTest.php` | [PR #18](https://github.com/Leonel-Ayala/GestiSoft/pull/18) | **Cerrado** |
| **OBS-21** | 12 | **C3:** Clave foránea con `cascadeOnDelete()` borraba el Kardex contable al eliminar productos. | Adopción de `SoftDeletes` en `Product` y cambio de claves foráneas a `restrictOnDelete()`. | [ADR-05](adr/ADR-05-kardex-inmutable-softdeletes.md), migraciones BD | [PR #18](https://github.com/Leonel-Ayala/GestiSoft/pull/18) | **Cerrado** |
| **OBS-22** | 4 y 12 | **C4:** `HandleInertiaRequests` compartía el modelo `User` completo exponiendo hashes en el cliente. | Minimización selectiva de props compartidas a solo `['id', 'name', 'email', 'role', 'negocio_id']`. | `HandleInertiaRequests.php`, [SPIKE-02](../producto/backlog/SPIKE-02.md) | [PR #18](https://github.com/Leonel-Ayala/GestiSoft/pull/18) | **Cerrado** |
| **OBS-23** | 9 y 10 | `POSTest` enviaba `'cart'` en lugar de `'items'`, aprobando por un fallo ajeno de validación. | Corrección del payload del test, apertura previa de turno y comprobación explícita del mensaje de error. | `tests/Feature/POSTest.php` | [PR #18](https://github.com/Leonel-Ayala/GestiSoft/pull/18) | **Cerrado** |
| **OBS-24** | 10 y 14 | Ausencia de pipeline de CI y falta de registros reproducibles de pruebas en la entrega. | Pipeline de CI en GitHub Actions configurado con **PHP 8.4**, Node 22, paso de regresión y suite completa. | `.github/workflows/tests.yml` | [Commit 5172c47](https://github.com/Leonel-Ayala/GestiSoft/commit/5172c47d7f50927005e425e0662f3f1c52c3a9e3) | **Cerrado** |
| **OBS-29** | 12 | **C5:** `UserController@store` admitía rol `admin` desde formulario web sin política explícita. | **ADR-06 (Opción A):** Formulario web restringido estrictamente a creación de cajeros (mínimo privilegio). | `UserController.php`, `ADR-06` | [PR #19](https://github.com/Leonel-Ayala/GestiSoft/pull/19) | **Cerrado** |

* **Puntos Clave para Explicar la Tabla:**
  * Destacar que las 13 observaciones (`OBS-18` a `OBS-30`) están 100% cerradas en el código y enlazadas a sus respectivos PRs.
  * Resaltar con énfasis las mitigaciones de las correcciones críticas: C1 (ADR-03), C2 (Rule::requiredIf), C3 (ADR-05), C4 (SPIKE-02) y C5 (ADR-06).

* **Guión del Expositor (Rodrigo):**
  > *"En la segunda defensa se detectaron vulnerabilidades y defectos relevantes en el Incremento 1. Diseñamos un plan de correcciones riguroso: en C1 eliminamos la confianza en el cliente para precios y totales; en C2 corregimos el validador de motivo en inventario asegurando transaccionalidad; en C3 incorporamos SoftDeletes para que el borrado de un producto no destruya el historial del Kardex contable; y en C4 minimizamos las props de Inertia para proteger atributos sensibles. Cada corrección cuenta con su prueba de integración específica."*

---

### SLIDE 05: Retrospectiva del Equipo (Compromisos Verificables)
* **Expositor:** Rodrigo Bertolini (Product Owner)
* **Criterio de la Rúbrica S14:** **Criterio 1** (Retroalimentación de la 2.ª defensa, retrospectiva y evolución del proceso).
* **Documento Fuente Oficial:** [docs/acuerdo-equipo.md](../docs/acuerdo-equipo.md) y retrospectiva del equipo.
* **Elementos Visuales:** Matriz de 4 cuadrantes con compromisos concretos y verificables en el repositorio.

#### 📊 Tabla Exacta para la Diapositiva:
| Dimensión de la Retrospectiva | Compromiso del Equipo Grupo 6 | Evidencia Concreta en el Repositorio |
| :--- | :--- | :--- |
| **Mantener (Lo que funcionó)** | Cohesión del equipo, comunicación regular y diseño de arquitectura guiado por drivers (ADR-01 a ADR-07). | 7 ADRs aprobados, commits regulares y distribución equitativa de tareas. |
| **Corregir (Lo que falló en Demo 2)** | Ausencia de verificación de hipótesis con usuarios, estimaciones optimistas sin base empírica y pruebas desincronizadas. | Validación de H-01 en laboratorio con protocolo estructurado y mediciones crudas automatizadas. |
| **Detener (Malas prácticas eliminadas)**| Desarrollar código sin trazabilidad, asumir requerimientos sin consulta a comerciantes y postergar integración de CI. | Erradicación de ramas huérfanas; flujo estricto de PRs con CI obligatorio antes de mergear. |
| **Comenzar (Nuevas prácticas S14)** | Pruebas automatizadas en cada cambio, catalogación exhaustiva de defectos (DEF-01 al DEF-19) y validación de turno activo en `POSController`. | 76 tests automatizados verdes, matriz de defectos cerrada y bloqueo de ventas sin turno y recálculo en backend (ADR-03). |

* **Puntos Clave para Explicar la Tabla:**
  * Demostrar madurez del equipo: no limitarse a "hacer más reuniones", sino adoptar prácticas ingenieriles verificables en git.
  * Mostrar cómo la retrospectiva guio la priorización del Incremento 2 hacia la estabilidad y el control financiero.

* **Guión del Expositor (Rodrigo):**
  > *"Tras la Segunda Defensa, realizamos una retrospectiva profunda como equipo. Identificamos que nuestro mayor error fue asumir supuestos sin validación empírica y permitir que las pruebas quedaran rezagadas respecto al desarrollo. Para este incremento, transformamos nuestros acuerdos en compromisos verificables: detuvimos el desarrollo sin pruebas, comenzamos a catalogar cada defecto antes de codificar y mantuvimos una arquitectura orientada a drivers."*

---

### SLIDE 06: Objetivo del Incremento 2 e Hipótesis Refutables (H-01, H-03, H-04)
* **Expositor:** Rodrigo Bertolini (Product Owner)
* **Criterio de la Rúbrica S14:** **Criterio 2** (Objetivo, hipótesis de valor y señal de éxito).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 2.2: "Hipótesis de Valor y Señales Observables".
* **Elementos Visuales:** Tabla de hipótesis refutables con señales observables, evidencia de laboratorio y declaración honesta de límites.

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `guia-semana14.md` Sección 2.2):
| ID | Hipótesis Refutable | Señal Observable | Evidencia Obtenida | Qué Falta Validar | Decisión Derivada |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **H-01** | Si el sistema restringe al cajero para que no vea ni modifique inventario, precios ni usuarios, el dueño confiará en dejarlo solo operando la terminal de cobro. | El servidor ignora precios enviados por el cliente (`POSTest::test_venta_ignora_precio_enviado_por_cliente`), con evaluación →\ge 4/5→. | **Evidencia de laboratorio:** Ensayos de role-playing sobre 3 perfiles comerciales (minimarket, boutique, bazar) basados en la entrevista inicial y descubrimiento, más verificación automatizada de controles (tests RBAC HTTP 403, recálculo C1 e inmutabilidad de Kardex). | Confianza real de delegación en uso real (propuesto para el Incremento 3). | Mantener RBAC estricto y proponer piloto en uso real con comercios para el Incremento 3. |
| **H-03** | Si el POS exige apertura de caja obligatoria con fondo inicial y navegación por teclado, se evitan ventas huérfanas y se mantiene una atención ágil (≤ 60 s). | 0 ventas registradas sin turno de caja en la suite de pruebas; tiempo de apertura y cierre ≤ 60 s. | **Mediciones de laboratorio y modelo:** 0 ventas huérfanas en tests. Tiempos medidos en backend (`H03TiemposCajaTest`) más estimación de interacción humana mediante modelo KLM: apertura 3.41 s promedio (3.80 s máximo); cierre con arqueo ciego 4.67 s promedio (4.67 s máximo). Ambas bajo el umbral de 60 s. | Medición con cronómetro en mostrador real con cajeros reales en hora punta. | Mantener el flujo de apertura/cierre; declarar el uso de KLM como estimación de tiempo humano y proponer medición en terreno para el Incremento 3. |
| **H-04** | Si el cierre de caja se realiza mediante arqueo ciego (el cajero no ve el monto esperado por el sistema), se previene el ajuste artificial del efectivo. | El servidor calcula la diferencia de forma inmutable; el cliente no recibe el total esperado antes del cierre; el acta refleja faltantes o sobrantes reales. | **Pruebas automatizadas y de interfaz:** `TurnoCajaTest` verifica que la diferencia se calcula en el servidor como `monto_declarado - total_esperado` y que un turno cerrado no admite modificaciones ni recalcula totales. | Observación de comportamiento de cajeros bajo presión de entrega de turno. | Mantener el diseño de arqueo ciego (ADR-04) y el acta de cierre con CSS `@media print`. |

* **Puntos Clave para Explicar la Tabla:**
  * Destacar el estricto cumplimiento del Criterio 2 de la rúbrica: se presenta la hipótesis refutable, la evidencia obtenida y se declara con precisión lo aún no validado (piloto de campo para Inc 3).

* **Guión del Expositor (Rodrigo):**
  > *"La hipótesis H-01 nace de la entrevista inicial a un minimarket cercano (ENT-01) y el mismo dolor apareció en ENT-02: es un problema común de los pequeños comercios. Por eso la validamos con role-playing basado en esos perfiles y con tests de los controles; la confianza en uso real queda como piloto del Incremento 3 (RSK-17). Formulamos además H-03 sobre velocidad en mostrador bajo 60 segundos y H-04 sobre consistencia contable al cierre."*

---

### SLIDE 07: Alcance, Límites (Incluye / Posterga / Excluye) y Priorización
* **Expositor:** Rodrigo Bertolini (Product Owner)
* **Criterio de la Rúbrica S14:** **Criterio 3** (Alcance y Product Backlog refinado - Límites claros).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 3.1: "Límites del Alcance del Incremento 2".
* **Elementos Visuales:** Matriz formal de los 3 límites del alcance con su justificación técnica y de negocio.

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `guia-semana14.md` Sección 3.1):
| Límite de Alcance | Capacidades y Componentes Implementados en el Incremento 2 | Justificación Técnica y de Negocio |
| :---: | :--- | :--- |
| **INCLUYE** | • **Módulo PBI-03 (Caja):** Apertura de turno con fondo inicial (`monto_inicial`), bloqueo de POS sin turno, cierre con arqueo ciego (ADR-04) y conciliación por medio de pago.<br>• **Auditoría de Cajas:** Historial de turnos con filtro mensual por defecto (`periodo=mes`) y conmutador a histórico completo.<br>• **Acta Oficial:** Vista imprimible de acta de cierre con CSS `@media print` y casillas de firma física.<br>• **Estabilización C1-C4:** Recálculo en backend (ADR-03), validación de motivo en ajustes (C2), SoftDeletes en Kardex (ADR-05) y minimización de props Inertia (C4).<br>• **Kardex en Ventas:** Inserción atómica de `MovimientoStock` en cada venta de POS (ADR-07). | Resuelve directamente el dolor crítico de descontrol de efectivo y falta de cuadratura en gaveta manifestado en las entrevistas de descubrimiento. |
| **POSTERGA** | • Retiros parciales de efectivo durante la jornada (sangrías / retiros menores de caja).<br>• Dashboard gerencial con gráficos analíticos y tendencias de venta históricas ([PBI-05](../producto/backlog/PBI-05.md)). | Se priorizó garantizar la consistencia financiera de la gaveta antes de sumar analítica avanzada. Postergado formalmente para el Incremento 3. |
| **EXCLUYE** | • Integración directa con hardware de terminales bancarios (API Transbank / POS físico).<br>• Control electrónico de gavetas de dinero por puerto serial/USB.<br>• Facturación electrónica directa con el Servicio de Impuestos Internos (SII). | Dependencias de hardware y servicios externos fuera del alcance pedagógico del MVP web SaaS en entorno académico. |

* **Puntos Clave para Explicar la Tabla:**
  * Justificar por qué se priorizó PBI-03 (caja y arqueo ciego) por sobre PBI-05 (dashboard): los dueños necesitan cuadrar su gaveta antes de ver gráficos de tendencias.

* **Guión del Expositor (Rodrigo):**
  > *"Establecimos los límites del Incremento 2 con estricto criterio de valor. Priorizamos PBI-03 (cierre de caja, arqueo ciego y acta formal) y postergamos el dashboard analítico (PBI-05). La justificación es directa: los comerciantes no necesitan gráficos de tendencias si al final de la jornada no tienen certeza de cuánto dinero en billetes físicos hay en su gaveta. Excluimos integraciones bancarias externas para no incorporar dependencias de hardware ajenas al alcance pedagógico y técnico del MVP."*

---

### SLIDE 08: Flujo Operativo de Caja y Arqueo Ciego
* **Expositor:** Rodrigo Bertolini (Product Owner)
* **Criterio de la Rúbrica S14:** **Criterio 5 y 6** (Corte vertical funcional e integridad de estados).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 5: "Corte vertical del Incremento 2 (C5)" y Sección 6 (C6).
* **Elementos Visuales:** Diagrama de estados de la caja (Cerrada → Abierta → Cuadrada/Descuadrada) y capturas del modal de arqueo ciego.

#### 📊 Tabla Exacta para la Diapositiva:
| Fase del Flujo Operativo | Operación en Mostrador | Control y Seguridad en Backend | Invariantes de Estado Garantizadas |
| :--- | :--- | :--- | :--- |
| **1. Apertura de Caja** | Cajero ingresa monto inicial de sencillo en modal (`POST /cajas`, atajo `[F2]` abre el modal). | Valida monto →\ge 0→, asocia `user_id` y `negocio_id` y verifica que no exista turno abierto previo. | Caja pasa a estado `abierta`; habilitación atómica del Punto de Venta (`AC-CAJA-01`). |
| **2. Operación de Mostrador** | Venta con ítems por código/SKU, cálculo tributario en servidor y venta registrada (`POST /pos/checkout`, atajos `[F4]` buscar, `[F8]` cobro). | Recalcula total desde BD ignorando frontend, aplica `lockForUpdate` en stock y vincula `turno_caja_id`. | Stock decrementado en Kardex (`AC-KARDEX-02`), venta registrada vinculada al turno (`AC-07-REV`). |
| **3. Arqueo Ciego de Cierre** | Cajero cuenta efectivo físico y digita total en modal sin saldo visible (`POST /cajas/{id}/cerrar`, atajo `[F9]`). | Backend calcula en privado: →Diferencia} = Declarado} - (Inicial} + Ventas})→. | Turno pasa a `cerrado` permanentemente; totales se congelan y no admiten recálculo (`AC-CAJA-05`). |
| **4. Acta y Auditoría** | Generación inmediata de acta oficial de cierre con desglose por canal de pago (`GET /cajas/{id}`). | Emisión de vista imprimible estandarizada (`@media print`) con resumen para el administrador. | Trazabilidad inmutable; auditoría muestra sólo turnos del mes por defecto (`AC-CAJA-06`). |

* **Puntos Clave para Explicar la Tabla:**
  * Explicar el principio del **Arqueo Ciego (ADR-04)**: el cajero nunca ve el total esperado del sistema para evitar que "ajuste" los billetes antes de declarar.
  * Resaltar la inmutabilidad: un turno cerrado jamás puede reabrirse ni alterar sus totales.
  * Destacar los atajos de teclado del flujo: `[F2]` abrir turno, `[F4]` enfocar buscador, `[F8]` cobrar y `[F9]` cerrar caja.

* **Guión del Expositor (Rodrigo):**
  > *"El corte vertical de este incremento cubre el ciclo completo del dinero en el punto de venta. Comienza con la apertura donde el cajero declara su fondo inicial. Durante el día, cada venta queda atómicamente asociada al turno y descuenta el stock directamente en el Kardex. Al terminar la jornada, el cajero realiza un arqueo ciego sin conocer el monto teórico del sistema; el backend calcula la diferencia exacta y congela el turno de forma inmutable, emitiendo un acta imprimible con validez legal interna."*

---

### SLIDE 09: Refinamiento del Product Backlog (PBI-03 y Defectos P0)
* **Expositor:** Rodrigo Bertolini (Product Owner)
* **Criterio de la Rúbrica S14:** **Criterio 3** (Alcance y Product Backlog refinado - Backlog priorizado).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 3.2: "Product Backlog Refinado y Priorizado".
* **Elementos Visuales:** Tabla del Sprint Backlog priorizada por valor y riesgo con trazabilidad a PRs y tests.

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `guia-semana14.md` Sección 3.2):
| Prioridad | ID Ítem | Tipo | Descripción Resumida | Estimación (PH) | Estado en S14 | Evidencia Verificable |
| :---: | :---: | :---: | :--- | :---: | :---: | :--- |
| **1** | **PBI-03** | Historia | Apertura, arqueo ciego y auditoría de turnos de caja | 8 PH | **Implementado** | [PR #18](https://github.com/Leonel-Ayala/GestiSoft/pull/18) / `TurnoCajaTest.php` |
| **2** | **C1 / DEF-04** | Defecto | Recálculo forzado de precios e IVA en servidor | 3 PH | **Corregido** | [ADR-03](adr/ADR-03-precios-calculados-en-servidor.md) / `POSTest.php` |
| **3** | **C2 / DEF-05** | Defecto | Validación obligatoria de motivo en ajuste de inventario | 2 PH | **Corregido** | `ProductController.php` / `InventoryTest.php` |
| **4** | **C3 / DEF-06** | Defecto | SoftDeletes en Product para preservar Kardex | 3 PH | **Corregido** | [ADR-05](adr/ADR-05-kardex-inmutable-softdeletes.md) / `InventoryTest.php` |
| **5** | **C4 / DEF-07** | Defecto | Minimización de datos sensibles de usuario en Inertia | 2 PH | **Corregido** | [SPIKE-02](../producto/backlog/SPIKE-02.md) / `RoleSecurityTest.php` |
| **6** | **REG-02 / DEF-08** | Defecto | Corrección de payload en prueba histórica de POS | 1 PH | **Corregido** | `POSTest.php` (payload corregido con `items`) |
| **7** | **DEF-11** | Defecto | Kardex obligatorio en ventas POS (ADR-07) | 2 PH | **Corregido** | [ADR-07](adr/ADR-07-kardex-en-ventas.md) / `POSTest.php` |
| **8** | **DEF-12** | Defecto | Rechazo de ítems duplicados en el checkout | 1 PH | **Corregido** | `POSController.php` / `POSTest.php` |
| **9** | **DEF-13** | Defecto | Lista cerrada de medios de pago autorizados | 1 PH | **Corregido** | `POSController.php` / `POSTest.php` |
| **10** | **DEF-14** | Defecto | Rechazo de venta si turno cerrado concurrentemente | 2 PH | **Corregido** | `POSController.php` / `TurnoCajaTest.php` |
| **11** | **PBI-05** | Historia | Dashboard de métricas y tendencias de ventas | 8 PH | **Postergado** | Postergado para Incremento 3 |

* **Puntos Clave para Explicar la Tabla:**
  * Destacar cómo las observaciones de la 2ª defensa se priorizaron como defectos P0 no negociables que debían cerrarse antes del entregable.

* **Guión del Expositor (Rodrigo):**
  > *"El refinamiento del backlog combinó entrega de valor con estabilización técnica. Las correcciones de integridad fueron tratadas como defectos P0 no negociables que debían quedar resueltos antes de dar por completado el módulo de cajas PBI-03. La capacidad del equipo se volcó a blindar la base de datos y la consistencia transaccional antes de dar paso a la versión candidata."*

---

### SLIDE 10: Criterios de Aceptación BDD (Normal, Alternativo y Error)
* **Expositor:** Rodrigo Bertolini (Product Owner)
* **Criterio de la Rúbrica S14:** **Criterios 7 y 8** (Criterios de aceptación: recorrido normal, alternativos, errores y bordes).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Secciones 7 y 8.
* **Elementos Visuales:** Especificaciones en formato BDD (Dado / Cuando / Entonces) respaldadas por métodos de prueba físicos.

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `guia-semana14.md` Secciones 7 y 8):
| ID | Tipo | Dado (Precondición) | Cuando (Acción) | Entonces (Resultado Observable) | Prueba Automatizada (`guia-semana14.md`) |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **AC-CAJA-01** | Normal | Usuario cajero con caja en estado cerrado. | Envía POST a `/caja/abrir` con `monto_inicial = 50000`. | Crea registro en `turnos_caja` abierto, inicializa saldo y habilita POS. | `CajaTurnoSecurityTest::test_cajero_puede_abrir_turno_con_monto_inicial_valido` |
| **AC-CAJA-02** | Normal | Cajero no tiene turno de caja abierto. | Intenta venta enviando POST a `/pos/checkout`. | Servidor rechaza con error de validación (redirección y sesión con errores); no altera stock ni BD. | `CajaTurnoSecurityTest::test_checkout_del_pos_bloqueado_si_no_hay_turno_abierto` |
| **AC-CAJA-03** | Normal | Turno abierto con fondo →50.000 y ventas →15.000. | Cajero declara →65.000 en arqueo ciego. | Turno pasa a cerrado, diferencia=0 y emite Acta Oficial. | `TurnoCajaTest::test_cierre_de_caja_calcula_diferencia_correctamente_sin_descuadre` |
| **AC-KARDEX-02**| Normal | Producto con stock 5 y turno de caja abierto. | Cajero confirma venta de 2 unidades en POS. | Stock baja a 3, inserta fila en `movimiento_stocks` (Venta #ID). | `POSTest::test_stock_coincide_con_suma_de_kardex_tras_alta_ajuste_y_venta` |
| **AC-CAJA-04** | Alternativo| Turno con total esperado de →50.000 en efectivo. | Cajero declara →47.000 en arqueo de cierre. | Registra diferencia de -→3.000; auditoría destaca faltante en rojo. | `TurnoCajaTest::test_cierre_de_caja_detecta_descuadre_faltante` |
| **AC-CAJA-05** | Borde | Turno con estado cerrado y diferencia calculada. | Se ejecutan operaciones o `sincronizarTotales()`. | Sistema no modifica total esperado ni diferencia (inmutable). | `TurnoCajaTest::test_turno_cerrado_no_recalcula_totales` |
| **AC-CAJA-06** | Alternativo| Turnos en meses anteriores y mes actual. | Administrador ingresa a `/cajas` sin parámetros. | Vista acota turnos al mes actual (`periodo=mes`) y ofrece histórico. | `CajaTurnoSecurityTest::test_filtro_por_defecto_cajas_muestra_mes_actual_y_permite_historico` |
| **AC-CAJA-07** | Error | Producto con stock 1 en carrito. | Petición envía el mismo `product_id` duplicado. | Validación `items.*.product_id: distinct` (DEF-12) rechaza sin sobreventa. | `POSTest::test_items_duplicados_no_permiten_sobreventa` |
| **AC-CAJA-08** | Error | Producto disponible y caja abierta. | Checkout con medio inválido ('Cheque', 'efectivo'). | Servidor rechaza con error de validación por lista cerrada de 4 medios (DEF-13). | `POSTest::test_medio_de_pago_invalido_es_rechazado` |
| **AC-CAJA-09** | Concurrencia| Pantalla de venta cargada en mostrador. | Turno cerrado concurrentemente por auditoría. | Rechaza la venta si el turno está cerrado; la re-lectura con bloqueo no se prueba en concurrencia real (limitación 16.3).| `TurnoCajaTest::test_venta_rechazada_si_turno_se_cerro` |
| **AC-SEC-03** | Seguridad | Usuario administrador autenticado. | Consulta rutas no implementadas (GET `/users/{id}/edit`). | Responde 404/405 controlado y nunca error 500 (DEF-15). | `RoleSecurityTest::test_rutas_no_implementadas_no_responden_500` |
| **AC-USR-01** | Seguridad | Administrador en formulario `/users/create`. | Envía payload con `role=admin`. | Backend fuerza rol cajero por mínimo privilegio (ADR-06 / DEF-16). | `RoleSecurityTest::test_admin_no_puede_crear_otro_admin_desde_formulario` |

* **Puntos Clave para Explicar la Tabla:**
  * Mostrar que cubrimos tanto el camino feliz como desvíos, errores de entrada, concurrencia y seguridad de privilegios.

* **Guión del Expositor (Rodrigo):**
  > *"Formalizamos criterios BDD verificables tanto para el camino feliz como para escenarios de error y desvíos prioritarios. Definimos precondiciones, acciones y resultados observables en respuestas HTTP y persistencia en base de datos. Cada uno de estos criterios se encuentra respaldado por una prueba automatizada en PHPUnit."*

---

### SLIDE 11: Separador FASE 2: Arquitectura y Decisiones
* **Expositor:** Leonel Ayala (Full Stack / Base de Datos Lead)
* **Criterio de la Rúbrica S14:** **Introducción a la FASE 2** (Criterios 9 al 16 de la Rúbrica).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 15.
* **Elementos Visuales:** Banner institucional: *FASE 2: Arquitectura de Sistema, Drivers y Decisiones de Ingeniería*.

#### 📊 Tabla Exacta para la Diapositiva:
| Slide | Tema Arquitectónico Central | Sección en `guia-semana14.md` | Criterio Rúbrica S14 |
| :---: | :--- | :--- | :--- |
| **Slide 12** | Modelo C4 Contenedores y Persistencia de Datos | Sección 15 (Persistencia ACID) | C9 y C15: Estructura y persistencia |
| **Slide 13** | Drivers Arquitectónicos y Arquitectura Visual / UX | Sección 15 (DA-06 a DA-11) | C10 y C15: Drivers y ergonomía UX |
| **Slide 14** | Registros de Decisión Arquitectónica (ADR-01 a ADR-07) | Sección 15 (Catálogo ADRs) | C15: Trazabilidad de decisiones |
| **Slide 15** | Pila Tecnológica, Reproducibilidad y Configuración | Sección 4 (Versión reproducible) | C4: Stack y reproducibilidad |
| **Slide 16** | Organización del Equipo, Responsabilidades y Sprints | Sección 14 (Revisión y roles) | C14 y C17-20: Gobernanza técnica |

* **Puntos Clave para Explicar la Tabla:**
  * Presentar la estructura de la Fase 2, dividiendo con claridad la persistencia backend (Leonel) del diseño de interfaz (Luis).

* **Guión del Expositor (Leonel):**
  > *"Pasamos a la Fase 2. Junto a Luis Barrios expondremos la arquitectura del sistema, los drivers que guiaron nuestras decisiones técnicas y cómo garantizamos la persistencia e integridad de los datos."*

---

### SLIDE 12: Modelo C4 Contenedores y Persistencia de Datos
* **Expositor:** Leonel Ayala (Full Stack / Base de Datos Lead)
* **Criterio de la Rúbrica S14:** **Criterio 15 (y C5)** (Diseño de arquitectura, C4 y persistencia transaccional).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 15 y diagramas de arquitectura.
* **Elementos Visuales:** Diagrama C4 de Contenedores oficial mostrando Single Page Application, Web Application, Base de Datos Relacional y capas de seguridad.

#### 📊 Tabla Exacta para la Diapositiva:
| Contenedor C4 | Tecnología y Versión | Responsabilidad en GestiSoft | Mecanismo de Integridad / Seguridad |
| :--- | :--- | :--- | :--- |
| **Single Page App** | React 18 + Inertia.js | Renderizado de interfaz reactiva, atajos de teclado y modales; estado local (`useState`) persistido en `localStorage` por usuario y negocio (necesidad de ENT-03). | Sin almacenamiento local de secretos; props filtradas por `HandleInertiaRequests`. |
| **Web Application** | Laravel 11 (PHP ≥ 8.3 / CI PHP 8.4) | Lógica de negocio de turnos, arqueos, autorización RBAC y transacciones de venta. | `RoleMiddleware`, Global Scope `HasNegocio` y validación en controladores. |
| **Base de Datos** | MySQL 8.0 (InnoDB) / SQLite | Persistencia relacional, historial inmutable de Kardex y soporte transaccional ACID. | `lockForUpdate()` en checkout, llaves foráneas y borrado lógico vía `SoftDeletes`. |

* **Puntos Clave para Explicar la Tabla:**
  * Explicar el desacoplamiento limpio entre la SPA y la API sin recurrir a APIs REST con tokens expuestos (Inertia.js mantiene la sesión segura basada en cookies HTTP-only).
  * Enfatizar la integridad transaccional ACID en la base de datos: las operaciones de dinero e inventario corren dentro de `DB::transaction()`.

* **Guión del Expositor (Leonel):**
  > *"Nuestra arquitectura sigue el estándar C4 Contenedores. En el frontend tenemos una Single Page Application con React e Inertia.js que gestiona el mostrador de forma ágil sin recargas. En el backend, Laravel 11 ejecuta la lógica de negocio y aplica las políticas de seguridad. Toda operación que comprometa dinero o stock se ejecuta dentro de transacciones de base de datos con bloqueos pesimistas, asegurando persistencia ACID y previniendo inconsistencias incluso bajo alta demanda."*

---

### SLIDE 13: Drivers Arquitectónicos y Arquitectura Visual / UX
* **Expositor:** Luis Barrios (Frontend Lead / UI-UX)
* **Criterio de la Rúbrica S14:** **Criterios 10 y 15** (Drivers de calidad y diseño frontend).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 15 ("Arquitectura, riesgos y decisiones (C15)").
* **Elementos Visuales:** Cuadro de drivers arquitectónicos y ergonomía visual de componentes.

#### 📊 Tabla Exacta para la Diapositiva:
| ID Driver (`guia-semana14.md` Sec. 15) | Driver Arquitectónico | Requerimiento / Escenario Técnico | Decisión Arquitectónica Adoptada | Artefacto y Componente |
| :---: | :--- | :--- | :--- | :--- |
| **DA-06** | Concurrencia en Mostrador | Apertura de caja y cobro simultáneo sin deadlocks. | `lockForUpdate()` en filas y `DB::transaction(..., 3)`. | `POSController.php` / Modal Apertura |
| **DA-07** | Transparencia de Arqueo | Prevenir cuadres artificiales de dinero en gaveta. | **ADR-04**: Arqueo ciego; cliente no recibe saldo teórico. | `TurnoCaja.php` / Modal `[F9]` Arqueo |
| **DA-08** | Aislamiento Multi-Tenant | Segregación estricta de datos entre tiendas en misma BD. | Trait `HasNegocio` con Global Scope automático en Eloquent. | `HasNegocio.php` / Todas las consultas |
| **DA-09** | Accesibilidad de Mostrador | Atención rápida en mostrador retail sin usar ratón. | Navegación 100% por atajos de teclado y foco persistente. | `Pages/POS/Index.jsx` (`RNF-ACC-01`) |
| **DA-10** | Inmutabilidad Contable | Eliminación de productos no debe destruir Kardex. | **ADR-05**: SoftDeletes y foreign key `restrictOnDelete`. | `Product.php` / Kardex contable |
| **DA-11** | Privacidad y Mínimo Privilegio | Evitar fuga de contraseñas y escalamiento de admin. | Whitelist de 5 props en Inertia y rol cajero fijo (ADR-06).| `HandleInertiaRequests` / `/users/create` |

* **Puntos Clave para Explicar la Tabla:**
  * Destacar cómo cada driver arquitectónico responde directamente a una necesidad o restricción del mundo real en mostrador.

* **Guión del Expositor (Luis):**
  > *"Desde el punto de vista arquitectónico del frontend y UX, el driver DA-10 exigía eliminar la fricción en el mostrador. Decidimos aislar el estado del carrito exclusivamente en memoria local de React (`useState`): esto permite añadir o quitar productos a 60 cuadros por segundo sin emitir peticiones AJAX innecesarias. Diseñamos modales con bloqueo de interacción para la apertura y el arqueo ciego, y dotamos al sistema de navegación completa por teclado para que el cajero opere sin tocar el mouse."*

---

### SLIDE 14: Registros de Decisión Arquitectónica (ADR-01 a ADR-07)
* **Expositor:** Leonel Ayala y Luis Barrios
* **Criterio de la Rúbrica S14:** **Criterio 15** (Arquitectura, riesgos y trazabilidad de decisiones).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 15 ("Catálogo de Decisiones Arquitectónicas") y carpeta `docs/adr/`.
* **Elementos Visuales:** Matriz de los 7 ADRs formales del sistema.

#### 📊 Tabla Exacta para la Diapositiva:
| ID ADR (`guia-semana14.md` Sec. 15) | Título de la Decisión | Driver Origen | Alternativa Descartada (y Razón) | Consecuencia y Evidencia Técnica |
| :---: | :--- | :---: | :--- | :--- |
| **ADR-01** | Multi-Tenant con Global Scope | DA-08 | BD física separada por comercio (descartada por costo y sobrecarga en SaaS). | Aislamiento garantizado con `negocio_id`; validado en `MultiTenantSecurityTest`. |
| **ADR-02** | RBAC con campo `role` enum | DA-11 | Paquete externo Spatie Permissions (descartada por sobreingeniería en MVP). | Middleware `RoleMiddleware` ligero; respuestas HTTP 403 inmediatas sin sobrecarga. |
| **ADR-03** | Recálculo de Precios en Servidor | C1 / DA-06 | Confiar en precios enviados por JavaScript (descartada por riesgo de fraude). | Backend re-lee precios en BD con `lockForUpdate()`; ignora importes del payload. |
| **ADR-04** | Arqueo Ciego y Acta Imprimible | DA-07 | Mostrar saldo esperado al cajero (descartada: facilita encubrir descuadres). | Cajero cuenta a ciegas; backend calcula diferencia; acta formal con `@media print`. |
| **ADR-05** | Kardex con SoftDeletes | C3 / DA-10 | Borrado físico en cascada (descartada: viola normativa tributaria contable). | `deleted_at` oculta producto del POS pero preserva registros históricos en Kardex. |
| **ADR-06** | Mínimo Privilegio en Usuarios | DEF-16 / DA-11 | Selector de rol libre en interfaz (descartada: riesgo de escalamiento de privilegios).| UI solo permite crear cajeros; administradores creados por seeders controlados. |
| **ADR-07** | Kardex Atómico en Ventas | DEF-11 / DA-10 | Descontar stock sin Kardex (descartada: rompe la ecuación stock = ∑ Kardex). | Inserción atómica obligatoria de `MovimientoStock` en cada venta de POS. |

* **Puntos Clave para Explicar la Tabla:**
  * Leonel explica ADR-01, 02, 03, 05, 06 y 07 (backend y base de datos).
  * Luis explica ADR-04 (arqueo ciego en mostrador y directivas `@media print`).

* **Guión del Expositor (Leonel & Luis):**
  > *(Leonel):* *"Formalizamos 7 registros de decisión arquitectónica. En ADR-03 resolvimos C1 trasladando el recálculo al backend; en ADR-05 protegimos el Kardex con SoftDeletes; en ADR-06 implementamos la opción de mínimo privilegio: la UI solo permite crear cajeros, reservando la creación de administradores a seeders controlados; y en ADR-07 garantizamos que cada venta impacte atómicamente el Kardex contable."*  
  > *(Luis):* *"En ADR-04 aseguramos la integridad del arqueo ciego impidiendo que el cliente conozca el monto esperado antes de contar los billetes. Además, diseñamos el comprobante del Acta Oficial de Cierre utilizando CSS `@media print` para que al imprimir en PDF se omitan menús y botones, emitiendo un documento legal formal con firmas de responsabilidad."*

---

### SLIDE 15: Pila Tecnológica, Reproducibilidad y Configuración
* **Expositor:** Leonel Ayala (Full Stack / Base de Datos Lead)
* **Criterio de la Rúbrica S14:** **Criterio 4** (Producto ejecutable y versión candidata reproducible).
* **Documento Fuente Oficial:** [README.md](../README.md) y [guia-semana14.md](./guia-semana14.md) Sección 4.
* **Elementos Visuales:** Diagrama del stack tecnológico y tabla de reproducción paso a paso.

#### 📊 Tabla Exacta para la Diapositiva:
| Componente (`README.md`) | Versión Oficial | Función en GestiSoft | Comando Reproducible de Instalación |
| :--- | :---: | :--- | :--- |
| **Lenguaje Backend** | PHP ≥ 8.3 (CI 8.4) | Lógica de negocio, controladores y reglas contables. | `php -v` |
| **Framework Backend** | Laravel 13 | Enrutamiento, ORM Eloquent, middlewares y testing. | `composer install` |
| **Librería Frontend** | React 18 + Inertia.js | Componentes interactivos SPA y comunicación por props. | `npm ci` |
| **Framework CSS** | Tailwind CSS | Estilos visuales, badges de estado y `@media print`. | `npm run build` |
| **Base de Datos Dev/CI** | SQLite 3 (`:memory:`) | Ejecución rápida de la suite de 76 pruebas en CI. | `DB_CONNECTION=sqlite php artisan test` |
| **Base de Datos Producción** | MySQL 8 (InnoDB) | Persistencia transaccional ACID con bloqueos de fila. | `php artisan migrate:fresh --seed` |

* **Puntos Clave para Explicar la Tabla:**
  * Destacar que el README fue corregido integralmente y cualquier evaluador puede reproducir la instalación ejecutando 5 comandos estándar.

* **Guión del Expositor (Leonel):**
  > *"Corregimos integralmente el README del proyecto para permitir reproducir la instalación paso a paso. Cualquier evaluador puede clonar el repositorio y levantar el entorno ejecutando cinco comandos estándar: `composer install`, `npm ci`, copia del `.env`, migración con seeders temáticos y compilación de Vite. Los seeders generan tres empresas listas con credenciales operativas de administrador y cajero."*

---

### SLIDE 16: Metodología de Desarrollo y Organización del Equipo
* **Expositor:** Rodrigo Bertolini (Product Owner)
* **Criterio de la Rúbrica S14:** **Criterio 14** (Gobernanza del repositorio, CI, flujo de integración y roles técnicos).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 14 y `docs/acuerdo-equipo.md`.
* **Elementos Visuales:** Organigrama técnico con roles, responsabilidades y evidencias trazables en git.

#### 📊 Tabla Exacta para la Diapositiva:
| Integrante | Rol Oficial en el Equipo | Área Técnica Asignada | Artefactos Principales a Cargo | Evidencia propia para C17–C20 |
| :--- | :--- | :--- | :--- | :--- |
| **Rodrigo Bertolini** | Product Owner / Backend Lead | Backlog, entrevistas de usuario, validación H-01, lógica TurnoCaja y matriz de riesgos. | `PBI-03`, `TurnoCaja.php`, `validacion-h01.md`, `registro-riesgos-v1.md` | `TurnoCaja.php`, `validacion-h01.md`, `registro-v1.csv` |
| **Luis Barrios** | Frontend Lead / UI-UX Lead | Ergonomía de mostrador, componentes React, atajos de teclado, arqueo ciego y actas. | `POS/Index.jsx`, `Caja/Index.jsx`, `@media print`, `RNF-ACC-01` | `POS/Index.jsx`, `Caja/Index.jsx` |
| **Leonel Ayala** | Full Stack / Base de Datos Lead | Persistencia transaccional, recálculo C1, migraciones SoftDeletes C3, ADR-06 y concurrencia. | `POSController.php`, `Product.php`, migraciones BD, `docs/adr/` | `POSController.php`, `docs/adr/`, migraciones |
| **Alan Troncoso** | Scrum Master / QA & CI Lead | Suite 76 tests, suite regresión (24 tests), mediciones p95, seguridad RBAC/IDOR y CI. | `.github/workflows/tests.yml`, `mediciones-calidad.md`, `trazabilidad.csv` | `tests.yml`, `trazabilidad.csv`, `H03TiemposCajaTest.php` |

* **Puntos Clave para Explicar la Tabla:**
  * Demostrar que el equipo operó con titularidad técnica especializada, garantizando que cada integrante domina su área y respalda su contribución con evidencias físicas en el repositorio.
  * Los 4 criterios individuales (C17 contribución, C18 dominio del flujo y pruebas, C19 decisiones de calidad y riesgo, C20 defensa autónoma) se evalúan a cada integrante.

* **Guión del Expositor (Rodrigo):**
  > *"Como Product Owner, organicé el trabajo del equipo bajo Scrum dividiendo la entrega en cortes verticales completos. Cada integrante asumió la titularidad técnica de su área, asegurando que ninguna funcionalidad se diera por cerrada sin pasar por desarrollo, pruebas automatizadas y revisión en equipo."*

---

### SLIDE 17: Separador FASE 3: Demostración en Vivo del Software
* **Expositor:** Conducida de forma distribuida por los 4 Integrantes
* **Criterio de la Rúbrica S14:** **Criterio 16** (demostración coordinada) y evidencia para los **criterios 17–20**.
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 16.1 ("Guion Repartido de la Demostración en Vivo").
* **Elementos Visuales:** Cronograma y pauta de la demostración funcional en vivo (8 minutos).

#### 📊 Tabla Exacta para la Diapositiva:
| Bloque y Tiempo | Expositor a Cargo (`guia-semana14.md` Sec. 16.1) | Flujo Operativo en Pantalla | Mecanismo Técnico Demostrado |
| :---: | :--- | :--- | :--- |
| **Min 0:00 - 2:00** | **Rodrigo Bertolini** | Bloqueo de POS y Apertura de Caja con →50.000. | Modal bloqueante sin turno activo (`AC-CAJA-02`); inicialización de saldo en BD. |
| **Min 2:00 - 4:00** | **Luis Barrios** | Venta ágil por teclado (`F4`, `F8`), cobro, Arqueo Ciego (`F9`) y Acta. | Operación 100% por teclado, arqueo sin saldo visible y comprobante `@media print`. |
| **Min 4:00 - 6:00** | **Leonel Ayala** | Verificación de Kardex en BD, ADR-06 en `/users` y filtro mensual `/cajas`. | Fila en `movimiento_stocks` con motivo `Venta #ID`, rol fijo cajero y filtro de auditoría. |
| **Min 6:00 - 8:00** | **Alan Troncoso** | Intento 403 Forbidden a inventario y ejecución de suites en consola. | Protección RBAC/IDOR y ejecución en vivo de regresión (24 tests) y completa (76 tests). |

* **Puntos Clave para Explicar la Tabla:**
  * Dejar claro a la comisión evaluadora cómo se estructuran los 8 minutos de demo para que evalúen individualmente a los 4 expositores.

* **Guión del Expositor (Rodrigo):**
  > *"Damos inicio a la Fase 3 de Demostración Funcional en Vivo. Cada uno de los 4 integrantes conducirá una parte especializada del flujo demostrando dominio operativo e integración técnica."*

---

### SLIDE 18: Separador FASE 4: QA, Mediciones y Trazabilidad
* **Expositor:** Alan Troncoso (Scrum Master / QA Lead)
* **Criterio de la Rúbrica S14:** **Introducción a la FASE 4** (Criterios 9 al 16 de la Rúbrica).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Secciones 9 a 16.
* **Elementos Visuales:** Banner institucional: *FASE 4: Verificación Cuantitativa, Atributos de Calidad, Trazabilidad y Cierre*.

#### 📊 Tabla Exacta para la Diapositiva:
| Slide | Dimensión de Calidad y Verificación | Sección en `guia-semana14.md` | Criterio Rúbrica S14 |
| :---: | :--- | :--- | :--- |
| **Slide 19** | Batería de Pruebas Automatizadas y Regresión | Sección 9 (Regresión) y Sección 10 (Evidencia) | C9 y C10: Regresión y pruebas |
| **Slide 20** | Atributos de Calidad con Mediciones Reales | Sección 12 (Atributos de Calidad Medibles) | C12: Atributos de calidad medibles |
| **Slide 21** | Seguridad y Privacidad Verificables | Sección 13 (Seguridad y Privacidad) | C13: Seguridad y privacidad |
| **Slide 22** | Matriz de Trazabilidad Bidireccional (CSV) | Archivo `producto/semana-14/trazabilidad.csv` | C10: Trazabilidad de pruebas |
| **Slide 23** | Repositorio, CI en GitHub Actions y PR | Sección 14 (Repositorio, CI y Revisión) | C14: Repositorio y CI |
| **Slide 24** | Definition of Done (6 Dimensiones) | Sección 11 (Definition of Done) | C11: DoD y estabilización |
| **Slide 25** | Gestión de Riesgos Actualizados (RSK-07 a 18) | Sección 15 y `registro-riesgos-v1.md` | C15: Riesgos y arquitectura |
| **Slide 26** | Versión Candidata, Limitaciones y Próximos Pasos | Sección 16 (Demostración, Limitaciones y Balance) | C16: Limitaciones y próximos pasos |

* **Puntos Clave para Explicar la Tabla:**
  * Presentar la estructura de la Fase 4 como el cierre formal donde se sustenta la calidad del software con cifras auditadas.

* **Guión del Expositor (Alan):**
  > *"Concluida la demostración funcional, asumo la presentación de la Fase 4 para sustentar con evidencia cuantitativa y empírica la calidad, seguridad, trazabilidad y reproducibilidad del sistema."*

---

### SLIDE 19: Batería de Pruebas Automatizadas y Regresión (76 Tests)
* **Expositor:** Alan Troncoso (Scrum Master / QA Lead)
* **Criterio de la Rúbrica S14:** **Criterios 9 y 10** (Regresión del Incremento 1 y Pruebas automatizadas).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 9 ("Regresión del Incremento 1") y Sección 10 ("Pruebas automatizadas y evidencia").
* **Elementos Visuales:** Captura y ejecución en vivo de la terminal con las 76 pruebas pasando en verde.

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `guia-semana14.md` Sección 9):
| Área Funcional (`guia-semana14.md` Sec. 9) | Riesgo de Regresión Evaluado | Prueba de Regresión Automatizada | Resultado en CI |
| :--- | :--- | :--- | :---: |
| **Multi-Tenant** | Filtración de catálogo o ventas entre comercios | `MultiTenantSecurityTest` (todos los métodos) | **Pasa (Verde)** |
| **Control de Roles (RBAC)** | Acceso no autorizado de cajeros a administración | `RoleSecurityTest` (todos los métodos) | **Pasa (Verde)** |
| **Inventario y Kardex** | Modificación de existencias sin motivo o pérdida de Kardex | `InventoryTest` (todos los métodos) | **Pasa (Verde)** |
| **Integridad de Precios POS** | Manipulación de precios enviados desde el navegador | `POSTest::test_venta_ignora_precio_enviado_por_cliente` | **Pasa (Verde)** |
| **Control de Stock POS** | Sobreventa de productos agotados | `POSTest::test_no_se_puede_vender_producto_sin_stock` | **Pasa (Verde)** |
| **Validación de Efectivo** | Venta confirmada con monto recibido menor al total | `POSTest::test_efectivo_insuficiente_es_rechazado` | **Pasa (Verde)** |
| **Kardex en Ventas** | Invariante de inventario stock = →\sum→ Kardex | `POSTest::test_stock_coincide_con_suma_de_kardex_tras_alta_ajuste_y_venta` | **Pasa (Verde)** |

* **Resumen Oficial de la Suite (`guia-semana14.md` Sección 10):**
  * **Suite de Regresión Dedicada:** `cd gestisoft-app; php artisan test --group=regresion` → **24 passed (92 assertions)**.
  * **Suite Completa del Sistema:** `cd gestisoft-app; php artisan test` → **76 passed (306 assertions)** al 100% verde en ~17.6 s.
  * **Trazabilidad Física:** 40 referencias exactas a métodos de prueba validadas por `scripts/validar-trazabilidad.php`.

* **Puntos Clave para Explicar la Tabla:**
  * Destacar el grupo formal `#[Group('regresion')]` con 24 tests que protegen las funcionalidades del Incremento 1.
  * Mencionar la corrección histórica de `POSTest.php` (reemplazo de `'cart'` por `'items'` y columna `'monto_inicial'`).

* **Guión del Expositor (Alan):**
  > *"Hoy acreditamos una batería de 76 pruebas automatizadas con 306 aserciones ejecutándose al 100% verde en ~17.6 segundos en el pipeline de CI. Además, creamos un grupo formal de regresión con 24 pruebas etiquetadas que verifican que ninguna de las correcciones previas sufra regresión. Corregimos el test histórico de POS reemplazando el payload 'cart' por 'items', corregimos 'monto_apertura' por 'monto_inicial', y añadimos pruebas de inmutabilidad de Kardex, bloqueo de efectivo insuficiente y protección contra IDOR en turnos."*

---

### SLIDE 20: Atributos de Calidad con Mediciones Reales (p95 y H-03)
* **Expositor:** Alan Troncoso (Scrum Master / QA Lead)
* **Criterio de la Rúbrica S14:** **Criterio 12** (Atributos de calidad medibles).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 12: "Atributos de calidad medibles (C12)".
* **Elementos Visuales:** Tabla literal de mediciones de latencia crudas generadas por `scripts/medir-latencia.php` y `scripts/estimar-klm-h03.php`.

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `guia-semana14.md` Sección 12):
| Atributo | Operación Evaluada | Muestras (→n→) | Mínimo | Promedio | Percentil 95 (→p95→) | Umbral Comprometido | Cumplimiento |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Rendimiento** | Búsqueda reactiva (`/pos/search`) | 50 | 2.28 ms | 4.83 ms | **10.77 ms** | ≤ 150.00 ms | **CUMPLE** |
| **Rendimiento** | Estado de caja (`/caja/estado`) | 50 | 2.20 ms | 2.40 ms | **2.87 ms** | ≤ 300.00 ms | **CUMPLE** |
| **Rendimiento** | Checkout POS (`/pos/checkout`) | 50 | 3.42 ms | 8.94 ms | **6.63 ms** | ≤ 500.00 ms | **CUMPLE** |
| **Eficiencia** | Apertura de turno (H-03, KLM) | 5 ensayos | 3.31 s | 3.41 s | **3.80 s (máx)** | ≤ 60.00 s | **CUMPLE** |
| **Eficiencia** | Cierre con arqueo ciego (H-03, KLM) | 5 ensayos | 4.67 s | 4.67 s | **4.67 s (máx)** | ≤ 60.00 s | **CUMPLE** |
| **Accesibilidad** | Operación completa por teclado | 6 flujos | — | — | — | 100% operable sin ratón | **CUMPLE** |

* **Puntos Clave para Explicar la Tabla:**
  * Subrayar que los datos provienen de un script cronometrado reproducible con 50 muestras crudas en backend, no de estimaciones superficiales.
  * Para H-03, explicar la combinación de tests automatizados con el modelo Keystroke-Level Model (KLM).

* **Guión del Expositor (Alan):**
  > *"Reemplazamos cualquier dato sintético por mediciones crudas obtenidas mediante scripts formales de cronometraje en backend con 50 ejecuciones reales. La búsqueda por catálogo arrojó un percentil p95 de 10.77 milisegundos, la consulta de estado de caja cerró en 2.87 milisegundos (umbral 300 ms) y el checkout atómico transaccional en 6.63 milisegundos (umbral 500 ms). Asimismo, para la hipótesis H-03 validamos la velocidad de mostrador combinando tests automatizados con el modelo KLM de interacción humana: apertura en 3.80 segundos y cierre en 4.67 segundos, cumpliendo holgadamente el umbral de 60 segundos."*

---

### SLIDE 21: Seguridad y Privacidad Verificables (RBAC, C1, C4, IDOR, ADR-06)
* **Expositor:** Alan Troncoso (Scrum Master / QA Lead)
* **Criterio de la Rúbrica S14:** **Criterio 13** (Seguridad y privacidad verificables).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 13: "Seguridad, privacidad y desarrollo seguro (C13)".
* **Elementos Visuales:** Matriz de controles de seguridad proporcionales al riesgo.

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `guia-semana14.md` Sección 13):
| Control de Seguridad | Amenaza o Vulnerabilidad Mitigada | Mecanismo Técnico Implementado | Prueba Automatizada de Verificación |
| :--- | :--- | :--- | :--- |
| **Aislamiento Multi-Tenant** | Filtración de datos de catálogo o ventas entre comercios. | Trait `HasNegocio` inyecta automáticamente `WHERE negocio_id = ?`. | `MultiTenantSecurityTest` (1 test verde: `test_un_usuario_no_puede_ver_los_productos_de_otro_negocio`) |
| **Control de Acceso RBAC** | Cajero accede a inventario o administración de usuarios. | Middleware `RoleMiddleware` intercepta y retorna HTTP 403. | `RoleSecurityTest::test_cajero_no_puede_acceder_a_inventario_retorna_403` y `test_cajero_no_puede_acceder_a_gestion_de_usuarios_retorna_403` |
| **Integridad Financiera (C1)**| Alteración de precios unitarios o totales desde el navegador. | Recálculo seguro en backend desde base de datos con `lockForUpdate()`. | `POSTest::test_venta_ignora_precio_enviado_por_cliente` |
| **Minimización de Datos (C4)**| Exposición de hashes de contraseñas o tokens en el DOM. | Whitelist selectiva en `HandleInertiaRequests` (solo 5 atributos no sensibles). | `RoleSecurityTest::test_inertia_no_comparte_campos_sensibles` |
| **Protección Anti-IDOR** | Cajero consulta o cierra turnos de caja de otros cajeros. | `CajaTurnoSecurityTest` comprueba pertenencia estricta por `user_id`. | `CajaTurnoSecurityTest::test_cajero_no_puede_ver_resumen_de_turno_de_otro_cajero` |
| **Mínimo Privilegio (ADR-06)**| Escalamiento de privilegios creando administradores no fiscalizados. | Formulario `/users/create` fuerza en servidor la asignación del rol `cajero`.| `RoleSecurityTest::test_admin_no_puede_crear_otro_admin_desde_formulario` |

* **Puntos Clave para Explicar la Tabla:**
  * Demostrar que la seguridad se construyó en profundidad (capa de datos, capa HTTP y capa de serialización DOM).
  * Destacar el paso del middleware `RoleMiddleware` para bloquear accesos no autorizados con código HTTP 403.

* **Guión del Expositor (Alan):**
  > *"Acreditamos seguridad en profundidad verificable. Bloqueamos las rutas administrativas a cajeros con código 403 usando `RoleMiddleware`; eliminamos la sobreexposición en Inertia protegiendo los hashes de contraseña en el DOM; protegemos los turnos contra vulnerabilidades IDOR entre cajeros; aplicamos el principio de mínimo privilegio en usuarios mediante ADR-06; y prevenimos condiciones de carrera con bloqueos pesimistas en base de datos."*

---

### SLIDE 22: Matriz de Trazabilidad Bidireccional (CSV)
* **Expositor:** Alan Troncoso (Scrum Master / QA Lead)
* **Criterio de la Rúbrica S14:** **Criterio 15 (y C10)** (Trazabilidad bidireccional y verificación automatizada).
* **Documento Fuente Oficial:** [producto/semana-14/trazabilidad.csv](../producto/semana-14/trazabilidad.csv) y `scripts/validar-trazabilidad.php`.
* **Elementos Visuales:** Extracto representativo de las 41 filas auditadas de la matriz CSV.

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `producto/semana-14/trazabilidad.csv`):
| ID_fila | Evidencia/Observación | Necesidad | Decisión(DEC/ADR) | Requisito(RF/RNF) | Criterio(AC) | Prueba(archivo::método) | PR | Estado |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| **FILA-01** | `OBS-18` (Falta control caja) | **N-01** | `ADR-04` (Arqueo ciego) | `RF-06` (Apertura caja) | `AC-CAJA-01` | `CajaTurnoSecurityTest::test_cajero_puede_abrir_turno_con_monto_inicial_valido` | #17 | Verificado |
| **FILA-02** | `OBS-18` (Operación sin caja) | **N-01** | `ADR-04` (Arqueo ciego) | `RF-06` (Bloqueo POS) | `AC-CAJA-02` | `CajaTurnoSecurityTest::test_checkout_del_pos_bloqueado_si_no_hay_turno_abierto` | #17 | Verificado |
| **FILA-03** | `OBS-18` (Arqueo transparente) | **N-01** | `ADR-04` (Arqueo ciego) | `RF-07` (Cierre ciego) | `AC-CAJA-03` | `TurnoCajaTest::test_cierre_de_caja_calcula_diferencia_correctamente_sin_descuadre` | #16 | Verificado |
| **FILA-10** | `REV-07` (Conciliación canales)| **N-01** | `ADR-04` (Totales canal) | `RF-07` (Sincronización)| `AC-07-REV` | `TurnoCajaTest::test_se_vincula_una_venta_al_turno_y_sincroniza_totales_por_metodo_de_pago` | #16 | Verificado |
| **FILA-11** | `DEF-11` (Venta sin Kardex) | **N-05** | `ADR-07` (Kardex ventas) | `RF-09` (Kardex integral)| `AC-KARDEX-02` | `POSTest::test_stock_coincide_con_suma_de_kardex_tras_alta_ajuste_y_venta` | #19 | Verificado |
| **FILA-12** | `OBS-19` (C1 Precios cliente) | **N-02** | `ADR-03` (Precios servidor)| `RF-04` (Recálculo IVA) | `AC-SEC-POS-01`| `POSTest::test_venta_ignora_precio_enviado_por_cliente` | #18 | Verificado |
| **FILA-13** | `OBS-20` (C3 SoftDeletes) | **N-05** | `ADR-05` (SoftDeletes) | `RF-09` (Auditoría perma)| `AC-SEC-KARDEX-01`| `InventoryTest::test_eliminar_producto_conserva_kardex` | #18 | Verificado |
| **FILA-15** | `OBS-29` (C5 Creación admin) | **N-06** | `ADR-06` (Privilegios) | `RF-11` (Gestión usuarios)| `AC-USR-01` | `RoleSecurityTest::test_admin_no_puede_crear_otro_admin_desde_formulario` | #19 | Verificado |

* **Puntos Clave para Explicar la Tabla:**
  * Explicar el encadenamiento bidireccional completo: Dolor → Necesidad → Decisión → Requisito → Criterio → Test físico.
  * Mencionar que el script `scripts/validar-trazabilidad.php` audita automáticamente las 41 filas con 40 tests físicos verificados.

* **Guión del Expositor (Alan):**
  > *"Como responsable de QA, mantengo actualizada nuestra matriz de trazabilidad bidireccional en `producto/semana-14/trazabilidad.csv`. Cada una de las 41 filas está auditada automáticamente por un script linter que verifica que los métodos de prueba referenciados existan físicamente en el código fuente. Contamos con 40 tests físicos verificados y cero errores de consistencia."*

---

### SLIDE 23: Repositorio, CI en GitHub Actions y Plantilla PR
* **Expositor:** Alan Troncoso (Scrum Master / QA Lead)
* **Criterio de la Rúbrica S14:** **Criterio 14** (Repositorio, CI y revisión por pares).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 14: "Repositorio, CI y revisión por pares (C14)" y [.github/workflows/tests.yml](../.github/workflows/tests.yml).
* **Elementos Visuales:** Captura de la tabla de PRs de la guía y del pipeline de GitHub Actions en verde.

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `guia-semana14.md` Sección 14):
| PR # | Contenido | Integró | Revisión previa | CI |
| :---: | :--- | :--- | :--- | :---: |
| [#15](https://github.com/Leonel-Ayala/GestiSoft/pull/15)–[#17](https://github.com/Leonel-Ayala/GestiSoft/pull/17) | Modelo TurnoCaja, módulo de caja y UI de arqueo ciego | Leonel Ayala | Revisión en equipo | Sin CI automático (previo a workflow) |
| [#18](https://github.com/Leonel-Ayala/GestiSoft/pull/18) | Correcciones C1-C4, mitigaciones de observaciones y pruebas asociadas | Leonel Ayala | Revisión en equipo | 2/2 checks verde |
| [#19](https://github.com/Leonel-Ayala/GestiSoft/pull/19) | Grupo `regresion` (24 tests) y suite completa (76 tests / 306 aserciones) | Leonel Ayala | Revisión en equipo | 2/2 checks verde |
| [#20](https://github.com/Leonel-Ayala/GestiSoft/pull/20) | Correcciones finales de estabilización S14 y alineación documental | Leonel Ayala | Revisión en equipo | 2/2 checks verde |

* **Puntos Clave para Explicar la Tabla:**
  * Destacar que la suite de regresión corre como un paso explícito y separado en el pipeline antes de la suite completa.

* **Guión del Expositor (Alan):**
  > *"Acreditamos integración continua activa: configuramos el pipeline de GitHub Actions que ejecuta el build de Vite, la suite de regresión con `--group=regresion` y la suite completa de 76 pruebas en SQLite en memoria en cada commit y Pull Request. Además, estandarizamos la plantilla obligatoria de PR exigiendo justificación, checklist y evidencia de pruebas verdes."*

---

### SLIDE 24: Definition of Done (6 Dimensiones) y Estabilización
* **Expositor:** Alan Troncoso (Scrum Master / QA Lead)
* **Criterio de la Rúbrica S14:** **Criterio 11** (Definition of Done y estabilización).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 11: "Definition of Done y estabilización (C11)".
* **Elementos Visuales:** Matriz de las 6 dimensiones de la DoD y estado de cumplimiento.

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `guia-semana14.md` Sección 11):
| Dimensión DoD | Condición Comprometida | Evidencia Verificable | Estado |
| :--- | :--- | :--- | :---: |
| **1. Funcionalidad** | Corte vertical completo: apertura, cobro, arqueo ciego, conciliación y acta imprimible. | Demostración en vivo + persistencia en tablas `turnos_caja` y `ventas`. | **Cumplido** |
| **2. Pruebas Automatizadas** | 100% de tests unitarios y de integración pasando en verde; suite de regresión dedicada. | Salida de CI: 76 tests / 306 aserciones en verde (`.github/workflows/tests.yml`). | **Cumplido** |
| **3. Calidad y Rendimiento** | Latencias bajo umbrales unificados generadas mediante script reproducible. | [mediciones-calidad.md](../producto/semana-14/mediciones-calidad.md) (p95 = 10.77 ms búsqueda, 6.63 ms checkout). | **Cumplido** |
| **4. Seguridad y Privacidad** | Confianza cero en cliente (C1), inmutabilidad de auditoría (C3), RBAC, props limpias (C4). | [ADR-03](adr/ADR-03-precios-calculados-en-servidor.md), [ADR-05](adr/ADR-05-kardex-inmutable-softdeletes.md), [ADR-06](adr/ADR-06-creacion-administradores.md). | **Cumplido** |
| **5. Integración Continua** | Pipeline en GitHub Actions que se ejecuta en cada PR y commit a `main`; el equipo no fusiona con el CI en rojo. | Archivo `.github/workflows/tests.yml` y plantilla de PR `.github/pull_request_template.md`. | **Cumplido** |
| **6. Documentación** | Guía de Semana 14 como fuente única, matriz de trazabilidad y riesgos actualizados. | [trazabilidad.csv](../producto/semana-14/trazabilidad.csv), [registro-riesgos-v1.md](../riesgos/registro-riesgos-v1.md). | **Cumplido** |

* **Puntos Clave para Explicar la Tabla:**
  * Resaltar que un ítem solo se considera "Done" cuando cumple simultáneamente las 6 dimensiones de ingeniería.

* **Guión del Expositor (Alan):**
  > *"Nuestra Definition of Done no se limita a que el código compile; exige el cumplimiento estricto de seis dimensiones de ingeniería de software. Un ítem solo se considera 'Done' cuando cuenta con valor validado, pruebas de regresión verdes, verificación de seguridad y reproducibilidad documentada."*

---

### SLIDE 25: Gestión de Riesgos Actualizados (RSK-07 al RSK-18)
* **Expositor:** Rodrigo Bertolini (Product Owner)
* **Criterio de la Rúbrica S14:** **Criterio 15** (Arquitectura, riesgos y trazabilidad de decisiones).
* **Documento Fuente Oficial:** [riesgos/registro-riesgos-v1.md](../riesgos/registro-riesgos-v1.md) y [guia-semana14.md](./guia-semana14.md) Sección 15.
* **Elementos Visuales:** Semáforo de riesgos prioritarios mostrando 11 riesgos mitigados y 1 riesgo abierto transparente (RSK-17).

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `riesgos/registro-riesgos-v1.md`):
| ID | Categoría | Descripción del Riesgo | Nivel | Estrategia | Acción de Mitigación / Contingencia | Responsable | Estado |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: | :---: |
| **RSK-07** | Integridad Financiera | Venta en POS sin turno activo o en turno cerrado concurrentemente. | Alto | Mitigar | Validación obligatoria en `POSController@checkout` con `lockForUpdate`. | Rodrigo Bertolini | **Mitigado** |
| **RSK-08** | Usabilidad | Arqueo ciego confuso para cajeros con baja alfabetización digital. | Medio | Mitigar | Modal limpio con teclado numérico, atajo `[F9]`, dinero contado y acta. | Luis Barrios | **Mitigado** |
| **RSK-09** | Regresión Calidad | Modificaciones de caja o Kardex rompen pruebas del Incremento 1. | Alto | Mitigar | Suite de regresión dedicada `php artisan test --group=regresion` (24 verdes).| Alan Troncoso | **Mitigado** |
| **RSK-10** | Multi-Tenant | Filtración de datos de turnos o arqueos entre diferentes comercios. | Alto | Mitigar | Trait `HasNegocio` forzado en `TurnoCaja` y comprobado en tests. | Leonel Ayala | **Mitigado** |
| **RSK-11** | Manipulación Precios | Precios alterados desde el cliente mediante inyección HTTP (C1). | Crítico | Mitigar | **ADR-03**: Servidor recalcula precios, IVA y vuelto consultando BD. | Leonel Ayala | **Mitigado** |
| **RSK-12** | Pérdida Auditoría | Destrucción de Kardex por eliminación física de productos (C3). | Alto | Mitigar | **ADR-05**: SoftDeletes en `Product` y foreign key con `restrictOnDelete`. | Leonel Ayala | **Mitigado** |
| **RSK-13** | Inconsistencia Stock | Modificación de existencias sin justificación o fallo transaccional (C2).| Alto | Mitigar | `DB::transaction()` y validación de motivo obligatorio con `Rule::requiredIf`.| Rodrigo Bertolini | **Mitigado** |
| **RSK-14** | Exposición Privacidad | Fuga de atributos sensibles de usuarios en props de React (C4). | Alto | Mitigar | **SPIKE-02**: Minimizando props en `HandleInertiaRequests` (5 campos seguros).| Alan Troncoso | **Mitigado** |
| **RSK-15** | Operatividad | Medios de pago no válidos o arbitrarios en checkout de ventas. | Medio | Mitigar | **DEF-13**: Validación de lista canónica con `Rule::in(METODOS_PAGO)`. | Luis Barrios | **Mitigado** |
| **RSK-16** | Concurrencia | Deadlock o doble apertura simultánea de turno de caja. | Medio | Mitigar | **DEF-17**: `DB::transaction(..., 3)` con 3 reintentos automáticos. | Leonel Ayala | **Mitigado** |
| **RSK-17** | Validación Negocio | Falta de validación empírica en terreno con comerciantes reales. | Alto | Aceptar | Role-playing en laboratorio basado en ENT-01; piloto propuesto para Inc 3. | Rodrigo Bertolini | **Abierto (Aceptado)** |
| **RSK-18** | Integridad Kardex | Kardex incompleto por ventas en POS sin fila en `movimiento_stocks`. | Alto | Mitigar | **ADR-07 / DEF-11**: Inserción atómica obligatoria de `MovimientoStock` en venta. | Rodrigo Bertolini | **Mitigado** |

* **Puntos Clave para Explicar la Tabla:**
  * Resaltar con orgullo académico el estado ABIERTO (Aceptado) de RSK-17: muestra madurez al no inventar datos de campo inexistentes.

* **Guión del Expositor (Rodrigo):**
  > *"Actualizamos la matriz de riesgos a 18 registros. 17 riesgos se encuentran mitigados con evidencia de código y tests. Mantenemos abierto con total honestidad el riesgo RSK-17 referido a la validación de campo en comercios físicos, el cual cuenta con cronograma definido para la fase de estabilización."*

---

### SLIDE 26: Versión Candidata, Limitaciones Honestas y Próximos Pasos
* **Expositor:** Rodrigo Bertolini (Product Owner)
* **Criterio de la Rúbrica S14:** **Criterio 16** (Demostración, limitaciones técnicas y próximos pasos).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Sección 16.2 ("Balance de Estado") y Sección 16.3 ("Limitaciones técnicas declaradas").
* **Elementos Visuales:** Tabla de balance de estado y lista de limitaciones técnicas honestas.

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `guia-semana14.md` Sección 16.2):
| Dimensión (`guia-semana14.md` Sec. 16.2) | Logrado en el Incremento 2 | Pendiente para Incremento 3 | Riesgo Vigente Asociado |
| :--- | :--- | :--- | :--- |
| **Caja y Ventas** | Apertura, arqueo ciego, conciliación multicanal, acta imprimible y Kardex en ventas. | Retiros parciales de efectivo durante la jornada (gastos menores). | Sin ID en el registro; retiros parciales propuestos para el Incremento 3 |
| **Reportería** | Auditoría con vista mensual acotada por defecto y filtro histórico consolidado. | Dashboard gráfico de tendencias de ventas y productos populares ([PBI-05](../producto/backlog/PBI-05.md)). | RSK-06 (degradación del buscador ante catálogos grandes) |
| **Validación** | Role-Playing Testing en laboratorio sobre 3 perfiles de negocio (minimarket, boutique, bazar) y tests automatizados. | Piloto en uso real con comercios. | **RSK-17** (Validación empírica en terreno) |

* **Puntos Clave para Explicar la Tabla:**
  * Mostrar el balance objetivo entre lo logrado en el Incremento 2 y lo postergado para el Incremento 3, relacionándolo directamente con los riesgos vigentes mitigados o abiertos.
  * Declarar explícita y honestamente las 5 limitaciones técnicas del software según la Sección 16.3 de la guía, demostrando madurez ingenieril ante la comisión evaluadora.

* **Limitaciones Técnicas Declaradas Formalmente (`guia-semana14.md` Sección 16.3):**
  1. **Concurrencia de caja (DEF-14, DEF-17):** Un solo cajero opera una caja a la vez por modelo de negocio; la concurrencia real simultánea entre dos cajeros sobre la misma caja está mitigada por el flujo operacional de turnos exclusivos, pero no cuenta con lock optimista de versión a nivel de interfaz en este incremento (planificado para Incremento 3).
  2. **Base de datos y verificación de integridad (DEF-18):** La suite de pruebas automatizadas corre en SQLite en memoria por rendimiento y portabilidad de CI; la integridad referencial (`restrictOnDelete`) está formalmente declarada en las migraciones y protegida en la capa de aplicación con `SoftDeletes`, pero su enforcement estricto a nivel de motor requiere verificación en base de datos MySQL en entorno de staging.
  3. **Mediciones de latencia y rendimiento:** Las mediciones de tiempo de respuesta (p95 y H-03) se tomaron a nivel de proceso (`hrtime()` / `microtime()`), excluyendo la latencia de ida y vuelta de red (RTT) y el tiempo de renderizado en el navegador cliente.
  4. **Alcance de validación de H-01:** La hipótesis de delegación segura fue validada en entorno de laboratorio mediante un protocolo estructurado de role-playing basado en la entrevista inicial `ENT-01`; no reemplaza las sesiones observadas con comerciantes reales en mostrador físico (programadas para el piloto).
  5. **Alcance de medición de H-03:** El tiempo de sistema fue medido en backend sobre 5 ensayos automatizados; el tiempo del operador humano fue modelado mediante la técnica estándar Keystroke-Level Model (KLM, Card, Moran & Newell, 1980), por lo que no constituye una medición de cronómetro sobre usuarios no entrenados.

* **Guión del Expositor (Rodrigo):**
  > *"No presentamos un producto final comercial; presentamos la versión candidata `v0.2.0-rc3` y declaramos sus límites con honestidad técnica (Sección 16.3 de la guía): concurrencia de caja mitigada por modelo de 1 cajero por caja, mediciones in-process complementadas con modelo KLM, y validación en terreno planificada para el piloto del Incremento 3."*

---

### SLIDE 27: Portada de Cierre y Ronda de Preguntas Técnicas
* **Expositor:** Rodrigo Bertolini (Apertura) y Todo el Equipo
* **Criterio de la Rúbrica S14:** **Criterio 16 y Anexo A** (Lista de comprobación y cierre de defensa).
* **Documento Fuente Oficial:** [guia-semana14.md](./guia-semana14.md) Anexo A: "Lista de Comprobación Final de la Versión Candidata".
* **Elementos Visuales:** Tabla oficial del Anexo A acreditando el 100% de cumplimiento del incremento y logo de cierre.

#### 📊 Tabla Exacta para la Diapositiva (Fuente: `guia-semana14.md` Anexo A):
| # | Pregunta de Control (Anexo A) | Estado | Evidencia / Enlace Oficial |
| :---: | :--- | :---: | :--- |
| **1** | ¿Se superaron las observaciones de la Demo 2 (C1 a C4)? | **Sí** | Sección 1 de esta guía; tests `POSTest`, `InventoryTest`, `RoleSecurityTest`. |
| **2** | ¿La hipótesis H-01 se presenta con honestidad técnica sin exagerar resultados? | **Sí** | [validacion-h01.md](../investigacion/validacion-h01.md) (Secciones 1, 6 y 7). |
| **3** | ¿El backlog refleja el estado real del producto y los nuevos defectos DEF-11 a DEF-19? | **Sí** | Sección 3 de esta guía y fichas en `producto/backlog/`. |
| **4** | ¿Existe una versión candidata reproducible con etiqueta y release? | **Sí** | Tag [`v0.2.0-rc3`](https://github.com/Leonel-Ayala/GestiSoft/releases/tag/v0.2.0-rc3) publicado en GitHub con código fuente y Release oficial del incremento. |
| **5** | ¿Se cuenta con una suite de regresión del Incremento 1 separada en CI? | **Sí** | Paso dedicado en `.github/workflows/tests.yml` (24 tests verdes). |
| **6** | ¿La suite completa de pruebas pasa al 100% en verde? | **Sí** | 76 tests / 306 aserciones en verde en CI y entorno local (incluyendo 2 tests automatizados de H-03). |
| **7** | ¿Las mediciones de calidad fueron generadas por un script reproducible con datos crudos? | **Sí** | [mediciones-calidad.md](../producto/semana-14/mediciones-calidad.md) y `scripts/medir-latencia.php`. |
| **8** | ¿La matriz de trazabilidad bidireccional fue validada por script? | **Sí** | `scripts/validar-trazabilidad.php` ejecutado con 40 referencias verificadas (41 filas en total, 0 errores). |
| **9** | ¿El registro de riesgos cubre RSK-01 a RSK-18 con estado real y evidencia? | **Sí** | [registro-riesgos-v1.md](../riesgos/registro-riesgos-v1.md) y `registro-v1.csv`. |
| **10** | ¿El guion de la defensa reparte el protagonismo en vivo entre los 4 integrantes? | **Sí** | Sección 16 de esta guía y `docs/guia-presentacion-defensa3.md`. |

* **Puntos Clave para Explicar la Tabla:**
  * Cerrar la presentación con la lista de comprobación oficial del Anexo A, demostrando que todas las preguntas de control están en estado **Sí** respaldadas por evidencia localizable en el repositorio.

* **Guión del Expositor (Rodrigo):**
  > *"Agradecemos a la comisión por su atención. Estamos listos para profundizar en cualquier aspecto del código, la arquitectura o las pruebas en la ronda de preguntas individuales."*

---

## 3. Pauta Cronometrada de la Demostración en Vivo (FASE 3 - 8 Minutos)
### *Demostración Distribuida entre los 4 Integrantes (Criterios 17 al 20 de la Rúbrica)*

```mermaid
sequenceDiagram
    autonumber
    actor R as Rodrigo Bertolini (PO)
    actor LB as Luis Barrios (UX/UI)
    actor LA as Leonel Ayala (Backend)
    actor AT as Alan Troncoso (QA)
    participant POS as Punto de Venta (React)
    participant Srv as Servidor Laravel 13
    participant BD as Base de Datos MySQL (InnoDB)

    Note over R,POS: 1. Bloqueo de POS y Apertura de Turno (Min 0:00 - 2:00) - Rodrigo
    R->>POS: Ingresa a /pos como cajero
    POS->>Srv: GET /caja/estado
    Srv-->>POS: estado = null
    POS-->>R: Modal Bloqueante de Apertura (POS inhabilitado)
    R->>POS: Ingresa Fondo Inicial (→50.000) y presiona Enter
    POS->>Srv: POST /caja/abrir {monto_inicial: 50000}
    Srv->>BD: Inicia turno_caja con total_esperado = 50000
    Srv-->>POS: Turno abierto -> Badge verde "Caja Abierta (→50.000)"

    Note over LB,Srv: 2. Venta por Teclado, Arqueo Ciego y Acta (Min 2:00 - 4:00) - Luis
    LB->>POS: Atajo F2 -> Escribe "Taladro" -> Presiona Enter
    LB->>POS: Atajo F8 -> Cobro Efectivo con →50.000 -> Confirma con Enter
    POS->>Srv: POST /pos/checkout {items, payment_method: 'Efectivo'}
    Srv->>BD: lockForUpdate() + Recálculo Precios e IVA + Descuento Stock + Movimiento Kardex
    Srv-->>POS: Venta registrada (Vuelto: →5.000)
    LB->>POS: Atajo F9 (Cierre de Turno) -> Modal de Arqueo Ciego
    LB->>POS: Declara efectivo contado (-→2.000 faltante intencional)
    POS->>Srv: POST /caja/cerrar {monto_declarado, observaciones}
    Srv-->>POS: Acta Oficial de Cierre -> Clic en "Imprimir Acta" (@media print)

    Note over LA,BD: 3. Concurrencia, Kardex en Venta y ADR-06 (Min 4:00 - 6:00) - Leonel
    LA->>Srv: Explica lockForUpdate() en checkout y reintento en apertura de caja
    LA->>BD: Muestra registro de Kardex generado con motivo "Venta #ID"
    LA->>Srv: Navega a /users/create como Admin -> Muestra badge fijo "Cajero (Fijo ADR-06)"
    LA->>Srv: Navega a /cajas -> Muestra conmutador [🗓️ Este Mes] vs [📚 Histórico Completo]

    Note over AT,Srv: 4. Verificación de Seguridad y Tests en Vivo (Min 6:00 - 8:00) - Alan
    AT->>Srv: Intento de acceso a /inventory como cajero -> HTTP 403 Forbidden
    AT->>Srv: Intento de consulta IDOR de turno ajeno -> HTTP 403 Forbidden
    AT->>Srv: Consola: php artisan test --group=regresion (24 passed)
    AT->>Srv: Consola: php artisan test (76 passed, 306 assertions)
```

### Guión de Ejecución Distribuido en la Demo:

#### Parte 1: Minuto 0:00 a 2:00 - Bloqueo de POS y Apertura de Turno
* **Expositor en pantalla:** Rodrigo Bertolini (Product Owner)
* **Acción en pantalla:** Inicia sesión como `cajero@gestisoft.cl` y navega a `/pos`.
* **Speech de Rodrigo:**
  > *"Comenzamos la demostración en vivo. Observen que al acceder como cajero, la interfaz de venta queda totalmente bloqueada por un modal que impide registrar pedidos si no hay un turno activo, cumpliendo el criterio `AC-CAJA-02`. Declaro el fondo inicial de sencillo con `→50.000` y confirmo con Enter. El sistema crea el registro en `turnos_caja` con `total_esperado = 50000` y habilita el terminal de cobro. Le doy el pase a Luis Barrios para la operativa de mostrador."*

#### Parte 2: Minuto 2:00 a 4:00 - Ergonomía de Teclado, Arqueo Ciego y Acta Imprimible
* **Expositor en pantalla:** Luis Barrios (Frontend Lead / UI-UX)
* **Acción en pantalla:** Sin tocar el mouse, presiona `F4`, busca *"Taladro Percutor"*, presiona `Enter` (añadido al carrito en memoria React), pulsa `F8` para cobro en efectivo con `→50.000` y confirma con `Enter`. Luego presiona `F9` para abrir el modal de arqueo ciego, ingresa el monto declarado con faltante intencional y muestra la vista de impresión.
* **Speech de Luis:**
  > *"Como responsable de UI/UX, diseñé el punto de venta para operar al 100% mediante atajos de teclado sin tocar el mouse. Presiono F4 para enfocar el buscador, selecciono el producto con Enter y pulso F8 para cobrar. Al presionar F9, se abre el modal de Arqueo Ciego (ADR-04): el sistema oculta completamente el total recaudado por el software para evitar que el cajero ajuste el conteo. Declaro el dinero contado con una diferencia de -→2.000. Al confirmar, el sistema genera el Acta Oficial de Cierre. Al pulsar 'Imprimir Acta', aplicamos directivas `@media print` para ocultar botones y navegación, entregando un acta formal con casillas de firma física. Cedo el control a Leonel Ayala."*

#### Parte 3: Minuto 4:00 a 6:00 - Persistencia Transaccional, Kardex y ADR-06
* **Expositor en pantalla:** Leonel Ayala (Full Stack / Base de Datos Lead)
* **Acción en pantalla:** Muestra en base de datos la tabla `movimiento_stocks` con el registro de salida asociado a la venta anterior (`motivo = 'Venta #...'`), accede a `/users/create` mostrando el rol fijo de cajero y luego a `/cajas` conmutando entre mes actual e histórico.
* **Speech de Leonel:**
  > *"A nivel de arquitectura y base de datos, cada venta ejecutada en el POS descuenta stock y registra automáticamente un movimiento en el Kardex (`movimiento_stocks`) con motivo trazable `Venta #ID` (ADR-07). Para prevenir condiciones de carrera, el checkout aplica `lockForUpdate()` sobre el turno y el catálogo de productos dentro de `DB::transaction()`. Además, bajo ADR-06 implementamos el principio de mínimo privilegio: desde la interfaz de usuarios, un administrador solo puede enrolar usuarios con rol 'cajero', protegiendo la plataforma de escalamiento de privilegios. En la vista de auditoría `/cajas`, filtramos por defecto el mes en curso o conmutamos al histórico completo según las necesidades de fiscalización del dueño. Cedo el pase a Alan Troncoso para el cierre de QA."*

#### Parte 4: Minuto 6:00 a 8:00 - Auditoría de Seguridad y Verificación de Tests en Terminal
* **Expositor en pantalla:** Alan Troncoso (Scrum Master / QA Lead)
* **Acción en pantalla:** Intenta acceder con la sesión de cajero a `/inventory` y `/users` (recibiendo `HTTP 403 Forbidden`). Abre la consola en `gestisoft-app/` y corre `php artisan test --group=regresion` y `php artisan test`.
* **Speech de Alan:**
  > *"Para verificar la seguridad en profundidad, demostramos en vivo que el cajero recibe 403 Forbidden inmediato si intenta ingresar a inventario o administración de usuarios, y queda aislado contra IDOR en turnos ajenos. En la consola, ejecuto en primer lugar nuestra suite de regresión: 24 tests pasando al 100% verde en 2 segundos. Y a continuación, ejecuto la suite completa: 76 pruebas con 306 aserciones al 100% verde en 6 segundos. Con esto demostramos la total estabilidad y cobertura de nuestra versión candidata."*

---

## 4. Guía de Respuestas para la Evaluación Individual (28 Puntos - Criterios 17 al 20)

---

### A. Leonel Ayala (Full Stack / Base de Datos Lead)
* **Pregunta probable:** *"Usted implementó la corrección C1, C3, ADR-06 y ADR-07. Explíqueme a nivel de base de datos cómo garantizó que no existan condiciones de carrera en el stock y por qué no usó un borrado físico en productos ni un rol libre en creación de usuarios."*
* **Respuesta técnica recomendada:**
  > *"En C1, el riesgo crítico eran las condiciones de carrera: si dos cajeros cobraban el último producto en el mismo milisegundo, ambos leían el stock disponible antes de descontar. Lo solucioné envolviendo el checkout en `DB::transaction()` y aplicando `Product::where('id', →item['product_id'])->lockForUpdate()->first()`, complementado con un re-bloqueo pesimista del turno activo. Esto genera un bloqueo a nivel de fila en el motor InnoDB hasta el `COMMIT`, serializando la apertura; además se reintenta hasta 3 veces ante deadlock (DEF-17). No hay restricción única en la base de datos (limitación declarada).*  
  > *Respecto a C3, la tabla `movimiento_stocks` es nuestro Kardex contable. Si un administrador eliminaba un producto con un `DELETE` tradicional, la foreign key con `cascadeOnDelete` destruía todo el historial de movimientos de inventario, violando la normativa tributaria chilena. Al implementar `SoftDeletes`, el producto simplemente marca `deleted_at = now()`, ocultándolo del catálogo operativo mediante un Global Scope automático, pero preservando intactos sus registros en el Kardex bajo una restricción foránea `restrictOnDelete`.*  
  > *Por último, en ADR-06 aplicamos el principio de mínimo privilegio: la UI solo permite crear cajeros, previniendo que un usuario comprometa credenciales para crear administradores no fiscalizados, mientras que ADR-07 asegura que cada venta genere un movimiento atómico en el Kardex con motivo trazable."*

---

### B. Alan Troncoso (Scrum Master / QA, Seguridad y Automatización Lead)
* **Pregunta probable:** *"En la defensa anterior su prueba de POS aprobaba por un error genérico. ¿Cómo reestructuró la suite de pruebas, qué valor aporta la suite de regresión y cómo midieron los atributos de calidad?"*
* **Respuesta técnica recomendada:**
  > *"El defecto radicaba en que el payload de `POSTest.php` enviaba una clave `'cart'`, la cual era rechazada por la regla de validación de Laravel sin llegar a ejecutar el descuento de stock. Reestructuré la prueba enviando la estructura real `'items'`, corrigiendo la referencia de columna de 'monto_apertura' a 'monto_inicial', inicializando previamente un turno de caja abierto y comprobando la aserción semántica sobre el mensaje de error `'Stock insuficiente'`.*  
  > *Para blindar el software contra regresiones, creamos un grupo formal `#[Group('regresion')]` con 24 pruebas críticas que cubren integridad C1-C4, validaciones de checkout, turnos y seguridad RBAC. En el pipeline de CI en GitHub Actions, la suite de regresión corre como primer paso mandatorio antes de la suite completa de 76 tests con 306 aserciones.*  
  > *Finalmente, para los atributos de calidad implementamos `scripts/medir-latencia.php` ejecutando 50 peticiones reales contra el backend: la búsqueda arrojó un p95 de 10.77 ms, el estado de caja 2.87 ms y el checkout atómico 6.63 ms, todas holgadamente inferiores a los umbrales comprometidos."*

---

### C. Luis Barrios (Frontend Lead / UI-UX)
* **Pregunta probable:** *"¿Por qué aislaron el estado del carrito en la memoria de React en lugar de sincronizarlo en el servidor en cada clic? ¿Y cómo resolvieron la impresión del acta para que no aparezca el menú del sistema?"*
* **Respuesta técnica recomendada:**
  > *"Mantener el carrito en el estado local de React mediante `useState` responde al driver DA-10 de latencia en punto de venta. Si por cada producto añadido o removido emitiéramos una petición HTTP al servidor, someteríamos al mostrador a retardos de red y re-renders innecesarios. En la interfaz de usuario, el carrito se gestiona como estado local (`useState`) persistido en `localStorage` por usuario y negocio (respondiendo a la necesidad de ENT-03), eliminando peticiones al servidor al editar el pedido y reservando la red para el checkout atómico.*  
  > *Para el Acta Oficial de Cierre, implementamos una regla de maquetación CSS con directivas `@media print`. Cuando el navegador dispara `window.print()`, los estilos ocultan dinámicamente la barra de navegación lateral, los botones de acción del sistema y los modales subyacentes, aplicando dimensiones estandarizadas de página, tipografía de alta legibilidad y bordes limpios para emitir un documento legal con casillas de firma física apto para auditoría."*

---

### D. Rodrigo Bertolini (Product Owner / Backend Lead)
* **Pregunta probable:** *"¿Por qué decidieron no validar la hipótesis H-01 con comerciantes reales en terreno para esta entrega y qué garantiza la simulación de Role-Playing que presentaron?"*
* **Respuesta técnica recomendada:**
  > *"La hipótesis H-01 evalúa si la separación de roles genera confianza subjetiva en el dueño para delegar la caja. Para esta entrega candidata v0.2.0-rc3, ejecutar un piloto superficial sin estabilidad previa en el dinero de caja habría sido irresponsable. Diseñamos un protocolo de Role-Playing Testing en laboratorio donde recreamos fielmente las restricciones y flujos de los comercios de descubrimiento (`ENT-01`, `ENT-02` y `ENT-03`), comprobando de forma empírica que el cajero queda sin acceso a inventario ni precios según los tests automatizados y el role-playing basado en la entrevista inicial.*  
  > *La hipótesis nació de la entrevista inicial a un minimarket cercano y representa un dolor compartido por los pequeños comercios. Declaramos con total transparencia en el riesgo RSK-17 que en esta entrega no realizamos sesiones con dueños, validando el flujo mediante role-playing en laboratorio y tests automatizados, dejando la validación en uso real propuesta para el Incremento 3."*

---

## 5. Checklist Final de Ensayo Previo a la Defensa

- [ ] **Entorno Local Listo:** Servidor Laravel levantado con `php artisan serve` y Vite en `npm run dev` / `npm run build`.
- [ ] **Base de Datos Limpia:** Seeder ejecutado con `php artisan migrate:fresh --seed` para contar con datos coherentes en los 3 comercios.
- [ ] **Credenciales a Mano:**
  * Administrador: `admin@gestisoft.cl` / `password`
  * Cajero: `cajero@gestisoft.cl` / `password`
- [ ] **Terminal con Test Suite Preparada:** Ventana de consola abierta en `gestisoft-app/` lista para ejecutar `php artisan test --group=regresion` y `php artisan test`.
- [ ] **Pestañas del Navegador Ordenadas:**
  1. Pestaña 1: Aplicación GestiSoft en `http://localhost:8000/login`.
  2. Pestaña 2: Pipeline de GitHub Actions en verde con el workflow `tests.yml`.
  3. Pestaña 3: Diapositivas de la presentación en pantalla completa.
- [ ] **Tiempo Cronometrado:** Ensayar la exposición respetando el límite estricto de **12 minutos de slides** y **8 minutos de demostración en vivo** entre los 4 integrantes.
