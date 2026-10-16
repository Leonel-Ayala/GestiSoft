# Guía Maestra y Mapeo Documental - Segunda Demostración y Defensa (Semana 9)

**Proyecto:** GestiSoft — Sistema Web Multi-Tenant de Facturación y Control de Stock para PYMEs  
**Evaluación:** Segunda Demostración y Defensa del Incremento Funcional 1 (INF524 - Taller de Desarrollo de Software)  
**Pauta:** `Semana 9 - INF524 - Rúbrica Segunda Demostración y Defensa.docx` (140 puntos = Nota 7.0)  
**Distribución de Puntaje:** 80% Demostración Grupal (16 criterios x 7 pts = 112 pts) + 20% Defensa Individual (4 criterios x 7 pts = 28 pts)

---

## 1. Alineación Estratégica: Cómo superamos la retroalimentación de la Demo 1

En la primera entrega obtuvimos **119 puntos (Nota 5.9)** debido a 7 observaciones calificadas como *Regular*. Para esta defensa, cada una de esas observaciones fue abordada y resuelta con evidencia verificable en código, pruebas y documentación:

| # | Criterio afectado en Demo 1 | Observación del Profesor | Solución y Evidencia Implementada en Incremento 1 | Estado |
|---|---|---|---|:---:|
| **1** | **Contexto y Aprendizaje** | Fechas inconsistentes (2-9 sep vs 27-29 ago) y confianza sobreafirmada en una sola entrevista. | Reorientación basada en la necesidad real de separación de roles y seguridad delegada documentada en `guia-semana6.md`. | ✅ Excelente |
| **2** | **Producto Ejecutable** | El `README.md` no indicaba navegar a `gestisoft-app` antes de instalar dependencias. | `README.md` actualizado con flujo exacto paso a paso (`cd gestisoft-app`, `composer install`, `npm install`, etc.). | ✅ Excelente |
| **3** | **Comportamiento Funcional** | **Falla en RF-09 / AC-07:** El ajuste de stock no pedía motivo, ni registraba Kardex, ni guardaba historial/auditoría. | Modelo `MovimientoStock`, tabla relacional con motivo obligatorio (ej. "Deterioro"), usuario auditor y cálculo antes/después. | ✅ Excelente |
| **4** | **Criterios Alternativos y Errores** | Escenario de deterioro incompleto por falta de Kardex; falta de validación de casos límite. | Flujo de deterioro 100% operativo con registro Kardex, `lockForUpdate` en checkout y bloqueo estricto de stock 0. | ✅ Excelente |
| **5** | **Trazabilidad de Extremo a Extremo** | La matriz no vinculaba las Decisiones (`DEC-*`) y había discrepancias en los estados de PBIs. | `product/week3/traceability.csv` actualizado con columna `Decisión` (`DEC-01` a `DEC-05`, `ADR-01`, `ADR-02`) y estados sincrónicos. | ✅ Excelente |
| **6** | **Pruebas y Verificación** | Solo existían tests de Laravel Breeze (auth), sin tests para inventario, POS ni multi-tenant. | Suite automatizada de **11 tests y 31 aserciones** en `tests/Feature/` (`InventoryTest`, `POSTest`, `MultiTenantSecurityTest`, `RoleSecurityTest`). | ✅ Excelente |
| **7** | **Atributos de Calidad** | Faltaban mediciones empíricas de latencia p95 (< 1s) y checklist formal de accesibilidad por teclado. | Reporte `product/week3/mediciones-calidad.md` con mediciones empíricas Network DevTools (p95 = 120ms) y auditoría 100% teclado. | ✅ Excelente |

---

## 2. Asignación de Roles del Equipo

Para garantizar fluidez y coordinación impecable (Criterio 16 de la Rúbrica):

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. Rodrigo Bertolini (Product Owner) ─── FASE 1: Aprendizaje, Valor, Alcance y Backlog         │
│ 2. Luis Barrios (Arquitectura & Sec) ─── FASE 2: Drivers, C4, Contratos, ADR-02 y Reproducción  │
│ 3. Leonel Ayala (Fullstack Lead)    ─── FASE 3: Demostración en Vivo, Código E2E y Base Datos  │
│ 4. Alan Troncoso (QA & Calidad)     ─── FASE 4: Tests Automatizados, Mediciones, Matriz y Cierre│
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Guía Diapositiva por Diapositiva (Demostración Grupal - 112 Puntos)

### FASE 1: Aprendizaje, Valor de Negocio y Alcance
**Orador:** Rodrigo Bertolini (Product Owner)

#### Slide 1: Aprendizaje y Reorientación desde la Primera Defensa
* **Criterio Rúbrica S9:** *Aprendizaje y reorientación desde la primera defensa (7 pts).*
* **Documentos a Proyectar:**
  * `docs/referencias/guia-semana6.md` (Sección 2: "Retroalimentación de la primera defensa" y Sección 3: "Retrospectiva").
  * Citar `Grupo 6 - S1 - Rúbrica primera demostración y defensa.docx`.
* **Qué decir y argumentar:**
  * *"Buenas tardes profesores. Iniciamos este Incremento Funcional 1 partiendo de los aprendizajes de nuestra primera defensa. En aquella ocasión obtuvimos observaciones muy claras: faltaba auditoría e historial al ajustar stock (RF-09/AC-07), las cuentas de usuario tenían privilegios planos sin distinción entre el dueño y el vendedor, y faltaban mediciones empíricas de calidad."*
  * *"Lejos de aplicar parches superficiales, utilizamos esta retroalimentación para reorientar el producto. Priorizamos el **PBI-04 (Gestión de Usuarios y Roles)** para asegurar que el dueño pueda delegar la caja con confianza, completamos el módulo de Kardex con motivo obligatorio y levantamos un laboratorio de mediciones de calidad."*

#### Slide 2: Objetivo del Incremento, Hipótesis de Valor y Señal de Éxito
* **Criterio Rúbrica S9:** *Objetivo, hipótesis de valor y señal de éxito (7 pts).*
* **Documentos a Proyectar:**
  * `docs/referencias/guia-semana6.md` (Sección 4: "Objetivo del Incremento 1" y Sección 5: "Hipótesis de valor").
* **Qué decir y argumentar:**
  * **Objetivo:** Segregar de forma estricta las operaciones del negocio: el Administrador gestiona inventario, compras y personal; el Cajero opera exclusivamente la venta rápida en el Punto de Venta.
  * **Hipótesis de Valor (H-01):** *"Si restringimos el acceso al inventario y a los costos comerciales mediante un sistema de roles en el servidor, el dueño de la PYME delegará la atención de caja sin temor a robos de información o alteración de precios."*
  * **Señal Observable de Éxito:** *"El 100% de los intentos de acceso a rutas administrativas por parte de un cajero devuelven código HTTP 403 Forbidden, y la interfaz oculta dinámicamente cualquier elemento fuera de su competencia."*

#### Slide 3: Alcance, Flujo Prioritario y Exclusiones Justificadas
* **Criterio Rúbrica S9:** *Alcance, flujo prioritario y exclusiones (7 pts).*
* **Documentos a Proyectar:**
  * `docs/referencias/guia-semana6.md` (Sección 6: "Alcance y flujo prioritario").
* **Qué decir y argumentar:**
  * **Inclusiones del Incremento 1:** Tabla de roles en BD, Middleware de intercepción en backend, inyección de permisos en React/Inertia, CRUD de usuarios, Kardex de inventario y borrado lógico (*Soft Deletes*).
  * **Postergaciones Justificadas:** Módulo de Caja/Arqueo ciego (PBI-03) y Reportes estadísticos (PBI-05). *"Con una capacidad de equipo de 8 a 10 puntos, decidimos blindar la seguridad antes de construir reportes sobre datos no protegidos."*
  * **Flujo Prioritario a Demostrar:** Flujo F-01 (Admin crea Cajero -> Cajero ingresa al POS) y Flujo F-02 (Cajero intenta violar el control de acceso -> Servidor bloquea con 403).

#### Slide 4: Refinamiento y Priorización del Product Backlog
* **Criterio Rúbrica S9:** *Refinamiento y priorización del Product Backlog (7 pts).*
* **Documentos a Proyectar:**
  * `docs/referencias/guia-semana6.md` (Sección 7: "Refinamiento del Product Backlog").
  * `product/backlog/SPIKE-02.md` y `product/backlog/PBI-04.md`.
* **Qué decir y argumentar:**
  * *"El backlog fue ordenado según Valor, Riesgo y Dependencias. Ante la incertidumbre técnica de cómo sincronizar los permisos entre Laravel y React sin menús parpadeantes, ejecutamos primero el **SPIKE-02** (Inertia Shared Data). Una vez resuelto el riesgo, construimos el **PBI-04** (5 puntos de historia), dejando en estado Listo tanto el inventario auditado como el control de usuarios."*

---

### FASE 2: Arquitectura y Decisiones Trazables
**Orador:** Luis Barrios (Arquitectura y Seguridad)

#### Slide 5: Drivers Arquitectónicos y Modelo C4 (Contenedores y Componentes)
* **Criterio Rúbrica S9:** *Arquitectura y decisiones trazables (7 pts).*
* **Documentos a Proyectar:**
  * `docs/referencias/guia-semana6.md` (Sección 9: "Drivers", Sección 11: "Contenedores" y Sección 12: "Componentes").
* **Qué decir y argumentar:**
  * **Drivers:** DA-01 (Seguridad en el servidor: nunca confiar en validaciones del cliente) y DA-02 (Usabilidad SPA sin recargas lentas).
  * **Contenedores:** Frontend React 18 SPA + Backend Laravel 11 (API & Kernel HTTP) + Persistencia MySQL (InnoDB multi-tenant).
  * **Componentes Clave:**
    1. `RoleMiddleware`: Filtro a nivel de kernel HTTP en `bootstrap/app.php` y `routes/web.php`.
    2. `HandleInertiaRequests`: Inyector de sesión en memoria que comparte el usuario y su rol con el frontend.
    3. `UserController`: Controlador protegido que gestiona los empleados del tenant actual (`negocio_id`).

#### Slide 6: Registro de Decisión Arquitectónica (ADR-02) y Contratos
* **Criterio Rúbrica S9:** *Arquitectura y decisiones trazables (7 pts) y Seguridad (7 pts).*
* **Documentos a Proyectar:**
  * `docs/referencias/guia-semana6.md` (Sección 13: "Contratos e interfaces" y Sección 16: "ADR-02").
* **Qué decir y argumentar:**
  * **ADR-02 (Gestión de Roles):** *"Evaluamos integrar la librería `spatie/laravel-permission` versus una implementación nativa con columna `role` y Middlewares propios. Elegimos la opción nativa: nos evita crear 5 tablas adicionales con múltiples JOINs por petición, manteniendo los tiempos de respuesta mínimos (cumpliendo RNF-PERF-01) y satisfaciendo exactamente el modelo de negocio sin complejidad accidental."*
  * **Contratos:** POST `/users` (Creación de personal con validación 422/403) y GET `/inventory` (Protegido por Middleware con 403 Forbidden para cajeros).

#### Slide 7: Producto Ejecutable y Reproducible
* **Criterio Rúbrica S9:** *Producto ejecutable y reproducible (7 pts).*
* **Documentos a Proyectar:**
  * `README.md` del repositorio.
  * Terminal con servicios activos.
* **Qué decir y argumentar:**
  * *"Subsanamos completamente la observación del README anterior. Hoy cualquier docente o evaluador puede clonar el repositorio y ejecutar la aplicación siguiendo los pasos explícitos: `cd gestisoft-app`, `composer install`, `npm install`, `php artisan migrate`, `npm run build` y levantar el servidor. No hay variables ocultas ni dependencias mágicas."*

---

### FASE 3: Demostración en Vivo del Software
**Operador en Vivo:** Leonel Ayala (Fullstack Lead)  
*(Apoyado en el relato por Luis y Rodrigo al resaltar los Criterios de Aceptación cumplidos).*

#### Slide 8: Demostración del Camino Normal (Corte Vertical E2E y AC-08)
* **Criterios Rúbrica S9:** *Corte vertical e integración (7 pts) y Comportamiento funcional comprometido (7 pts).*
* **Acciones en Vivo:**
  1. Iniciar sesión en GestiSoft como **Administrador** (`admin@gestisoft.cl`).
  2. Ir al menú superior y entrar a **Usuarios / Personal** (`/users`).
  3. Crear un nuevo cajero: Nombre *"Carlos Cajero"*, Email *"carlos@caja.cl"*, Contraseña *"password123"*, Rol *"Cajero"*.
  4. Presionar Guardar y mostrar que el usuario aparece en la lista con su rol respectivo.
* **Qué decir en vivo:**
  * *"Observen la integración vertical completa: la vista en React envía la petición, Laravel valida y encripta con Bcrypt, la base de datos genera el ID atómicamente y la vista se actualiza sin recargar el navegador. Se cumple el criterio **AC-08**."*

#### Slide 9: Demostración de Seguridad, Rutas Restringidas y Casos de Error (AC-09, AC-12)
* **Criterios Rúbrica S9:** *Criterios de aceptación alternativos y errores (7 pts) y Seguridad (7 pts).*
* **Acciones en Vivo:**
  1. Cerrar sesión de Admin e iniciar sesión con la cuenta de **Carlos Cajero**.
  2. **Inspección de UI (AC-12):** Mostrar la barra de navegación: los botones de "Inventario" y "Usuarios" **no existen en el DOM**.
  3. **Intento de Intrusión / URL Forzada (AC-09):** Escribir manualmente en la barra del navegador: `http://localhost:8000/inventory` o `http://localhost:8000/users`.
  4. **Resultado Observable:** Pantalla inmediata de **HTTP 403 Forbidden - Acceso Denegado**.
* **Qué decir en vivo:**
  * *"La seguridad no es cosmética. Aunque un atacante conozca la URL o intente inyectar JavaScript en el navegador, el `RoleMiddleware` en el servidor intercepta la solicitud antes de que toque la lógica de negocio o la base de datos."*

#### Slide 10: Auditoría de Inventario (Kardex - AC-07) y Borrado Lógico (Soft Deletes)
* **Criterios Rúbrica S9:** *Comportamiento funcional comprometido (7 pts) y Manejo de errores/bordes (7 pts).*
* **Acciones en Vivo:**
  1. Volver a ingresar como Admin e ir a **Inventario**.
  2. Modificar el stock de un producto (ej. restar 2 unidades) indicando el motivo: *"Deterioro en exhibición"*.
  3. Mostrar el historial / Kardex: aparece fecha, usuario auditor, stock anterior, stock nuevo y motivo justificado (**Resolviendo 100% la observación de la Demo 1**).
  4. Ir a **Usuarios**, intentar eliminar la propia cuenta de Admin: el sistema muestra alerta: *"No puedes eliminarte a ti mismo"*.
  5. Eliminar un cajero que ya realizó ventas y mostrar que se oculta de la interfaz, pero permanece en base de datos gracias a `SoftDeletes` (`deleted_at`).
* **Qué decir en vivo:**
  * *"Con esto demostramos que subsanamos al 100% la observación sobre RF-09/AC-07: el ajuste por deterioro ahora tiene trazabilidad total. Y con `SoftDeletes`, si un empleado deja la empresa, su usuario se bloquea sin destruir el historial contable de sus ventas pasadas."*

---

### FASE 4: QA, Mediciones, Trazabilidad y Cierre
**Orador:** Alan Troncoso (QA y Calidad)

#### Slide 11: Pruebas Automatizadas y Evidencia de Verificación
* **Criterio Rúbrica S9:** *Pruebas y evidencia de verificación (7 pts).*
* **Documentos a Proyectar:**
  * Ejecución de tests en terminal: `php vendor/phpunit/phpunit/phpunit tests/Feature/MultiTenantSecurityTest.php tests/Feature/InventoryTest.php tests/Feature/POSTest.php tests/Feature/RoleSecurityTest.php`.
  * Mostrar que corren **11 tests y 31 aserciones** en ~1.5 segundos con resultado **100% Passed**.
* **Qué decir y argumentar:**
  * *"El profesor nos indicó que en la primera entrega solo teníamos tests genéricos de autenticación. Hoy presentamos una suite automatizada robusta construida específicamente para nuestras reglas de negocio: control de roles (7 tests en `RoleSecurityTest.php`), auditoría de stock y Kardex (`InventoryTest.php`), prevención de stock negativo (`POSTest.php`) y aislamiento multi-tenant (`MultiTenantSecurityTest.php`). Toda la evidencia es reproducible en cualquier máquina."*

#### Slide 12: Atributos de Calidad y Escenarios Medibles
* **Criterio Rúbrica S9:** *Atributos de calidad y escenarios medibles (7 pts).*
* **Documentos a Proyectar:**
  * `product/week3/mediciones-calidad.md` (Tablas de Rendimiento y Checklist de Accesibilidad).
* **Qué decir y argumentar:**
  * **Rendimiento (RNF-PERF-01):** *"Medimos 50 peticiones consecutivas con Chrome DevTools Network: la búsqueda de productos responde en **120 ms (p95)** y el cobro transaccional en **310 ms (p95)**, superando holgadamente el requisito de p95 ≤ 1 segundo."*
  * **Accesibilidad por Teclado (RNF-ACC-01):** *"Verificamos empíricamente que el cajero opera el 100% del POS sin tocar el mouse: `autofocus` automático, adición al carrito con `Enter` y retención de foco ante alertas de error, eliminando los 15 segundos extra de fricción observados en las visitas a terreno."*

#### Slide 13: Trazabilidad de Extremo a Extremo
* **Criterio Rúbrica S9:** *Trazabilidad de extremo a extremo (7 pts).*
* **Documentos a Proyectar:**
  * `product/week3/traceability.csv`.
* **Qué decir y argumentar:**
  * *"Corregimos la matriz de trazabilidad incorporando el eslabón de las **Decisiones (DEC-*)**. Podemos recorrer bidireccionalmente la cadena completa: Dolor P01 -> Necesidad N-06 -> Decisión DEC-04 (Control de Roles) -> Requisitos RF-10/11 -> Criterios AC-08/09/12 -> PBI-04 -> Prueba automatizada `RoleSecurityTest` -> Estado 'Listo'."*

#### Slide 14: Repositorio, Versionado y Revisión entre Pares
* **Criterio Rúbrica S9:** *Repositorio, versionado, CI y revisión entre pares (7 pts).*
* **Documentos a Proyectar:**
  * GitHub: Pestaña de Pull Requests cerrados, ramas de trabajo (`feat/PBI-04-roles`, `fix/accessibility-pos`) y revisiones de código cruzadas.
* **Qué decir y argumentar:**
  * *"El equipo mantuvo una disciplina estricta de control de versiones. Ningún cambio ingresó directo a `main`. Todo el trabajo pasó por ramas de características, Pull Requests con revisiones obligatorias entre pares (Alan, Luis, Rodrigo y Leonel) y etiquetado de versión candidata."*

#### Slide 15: Validación, Limitaciones, Riesgos y Próximo Incremento
* **Criterios Rúbrica S9:** *Validación, limitaciones, riesgos y próximo incremento (7 pts) y Coordinación (7 pts).*
* **Documentos a Proyectar:**
  * `docs/referencias/guia-semana6.md` (Sección 18: Riesgos y Sección 19: Plan de próximas semanas).
* **Qué decir y argumentar:**
  * **Validación:** Se comprobó la hipótesis H-01; la segregación de funciones entre dueño y cajero funciona de forma infalible.
  * **Límites Transparentes:** El sistema maneja dos roles cerrados (Admin y Cajero); no incluye gestión de permisos dinámicos granulares para no inflar la complejidad.
  * **Riesgos Vigentes:** Riesgo de rendimiento en reportes futuros ante altos volúmenes de ventas (RSK-05).
  * **Próximo Incremento:** Con el cimiento de seguridad completado, abordaremos el **PBI-03 (Arqueo y Cierre de Caja Ciega)** y el **PBI-05 (Reportes y Gráficos Estadísticos)**.

---

## 4. Banco de Preguntas y Respuestas para la Defensa Individual (28 Puntos)

La rúbrica evalúa a cada integrante de forma individual en:
1. *Contribución individual significativa (7 pts)*
2. *Dominio técnico y arquitectónico (7 pts)*
3. *Criterio y justificación de decisiones (7 pts)*
4. *Respuestas, reflexión y aprendizaje (7 pts)*

### Rodrigo Bertolini (Product Owner)
* **P: ¿Por qué decidieron postergar el arqueo de caja (PBI-03) si era uno de los dolores mencionados en las entrevistas iniciales?**
  * *R:* *"Porque la retroalimentación y la matriz de riesgos demostraron que implementar arqueo de caja sin control de accesos era inseguro: cualquier cajero podía ver el dinero esperado y manipular los conteos. Priorizamos PBI-04 (Roles) para que el cierre de caja que construiremos en el Incremento 2 sea un arqueo ciego seguro y confiable."*
* **P: ¿Qué aprendiste en la gestión del backlog entre la primera y la segunda entrega?**
  * *R:* *"Aprendí que priorizar no significa ordenar por 'lo que más nos gusta programar', sino ordenar por reducción de riesgo técnico e impacto en el usuario. El spike técnico SPIKE-02 nos evitó retrabajo crítico en la integración con el frontend."*

### Luis Barrios (Arquitectura y Seguridad)
* **P: ¿Por qué implementaron el RoleMiddleware a nivel de rutas y no en el constructor de los controladores?**
  * *R:* *"Porque proteger en el archivo de rutas (`routes/web.php`) centraliza la superficie de ataque y previene el riesgo RSK-04: si un desarrollador crea un nuevo método en el controlador y olvida registrar la regla en el constructor, la ruta quedaría expuesta. Centralizarlo en el grupo `middleware('role:admin')` garantiza que ninguna ruta hija escape al control."*
* **P: ¿Cómo garantizan que un tenant no vea los datos de otro usuario?**
  * *R:* *"A través de dos capas: el `Global Scope` de Eloquent que inyecta automáticamente `WHERE negocio_id = ?` en todas las consultas de productos y ventas, y verificaciones explícitas en los controladores como `UserController` para abortar con 403 si el `negocio_id` del modelo no coincide con el del usuario en sesión."*

### Leonel Ayala (Fullstack Lead)
* **P: ¿Por qué los IDs se generan en la base de datos y no con un trigger o sumando +1 desde Laravel?**
  * *R:* *"Porque consultar `MAX(id) + 1` desde el backend genera condiciones de carrera fatales en concurrencia: dos cajeros registrando usuarios al mismo milisegundo obtendrían el mismo ID y uno fallaría por clave duplicada. La base de datos mediante `AUTO_INCREMENT` maneja contadores atómicos en memoria en el motor InnoDB, garantizando unicidad y alto rendimiento."*
* **P: ¿Qué problema resuelve el uso de `SoftDeletes` en el modelo `User`?**
  * *R:* *"Evita la ruptura de integridad referencial. Si hiciéramos un `DELETE` tradicional sobre un cajero que tiene registradas ventas en `ventas` o movimientos en `movimiento_stocks`, la base de datos rechazaría la consulta por restricción de llave foránea, o peor aún, si estuviera en cascada borraría el historial de ventas. `SoftDeletes` marca `deleted_at`, revocando el login pero manteniendo intacta la auditoría contable."*

### Alan Troncoso (QA y Calidad)
* **P: ¿Cómo pasaron de tener 0 tests de negocio en la primera entrega a 11 tests automatizados hoy?**
  * *R:* *"Estructuramos pruebas de integración en Laravel usando PHPUnit y `RefreshDatabase`. Diseñamos casos específicos para cada Criterio de Aceptación: probamos el camino feliz, las excepciones de stock 0, las restricciones de roles (403), el borrado lógico y el aislamiento multi-tenant, logrando una suite que se ejecuta en 1.5 segundos de forma totalmente reproducible."*
* **P: ¿Cómo midieron que el p95 realmente es menor a 1 segundo?**
  * *R:* *"Realizamos un perfilado de red en Chrome DevTools Network ejecutando 50 muestras de búsqueda de SKU y checkout con una base de datos poblada. La búsqueda arrojó un p95 de 120 ms y el cierre de venta 310 ms. Esto se debe a que React con Inertia no recarga el DOM completo y Laravel ejecuta consultas indexadas en milisegundos."*

---

## 5. Checklist para el Día de la Presentación

- [ ] Servidor backend corriendo: `php artisan serve` en puerto 8000.
- [ ] Compilador frontend activo o build generado: `npm run dev` o `npm run build`.
- [ ] Base de datos migrada y con datos limpios de prueba (Admin y productos de ejemplo).
- [ ] Dos navegadores listos (o ventana normal y ventana de incógnito) para alternar rápidamente entre la sesión de Administrador y la sesión de Cajero.
- [ ] Terminal abierta y lista en la carpeta `gestisoft-app` para correr `php vendor/phpunit/phpunit/phpunit tests/Feature/MultiTenantSecurityTest.php tests/Feature/InventoryTest.php tests/Feature/POSTest.php tests/Feature/RoleSecurityTest.php`.
- [ ] Documentos de soporte abiertos en pestañas del editor: `traceability.csv`, `mediciones-calidad.md`, `guia-semana6.md` y `README.md`.
- [ ] Cronómetro en mano: 15 a 18 minutos de exposición grupal para dejar espacio a la defensa individual.
