# Estructura de Presentación: GestiSoft (MVP Semana 4)
*Guion reorganizado basado en roles y metodologías ágiles*

**Tiempo estimado total:** 12-15 minutos (10 min exposición + 5 min defensa/preguntas).

---

## 🔹 PARTE 1: FUNDAMENTOS DEL NEGOCIO Y PRODUCTO (3 min)
**🎤 Orador:** Rodrigo Bertolini (Product Owner)

### Slide 1: Portada, Problema y Visión
- **Visual:** Logo de GestiSoft, título del proyecto y foto de contexto (ej. un mostrador lleno de gente).
- **Guion Sugerido (Rodrigo):** *"Buenas tardes. Como Product Owner de GestiSoft, descubrí tras nuestras entrevistas que el dolor principal de las PYMEs retail no es solo vender, sino la velocidad y el control. Operadores perdiendo 15 segundos extra por venta al usar el mouse y dueños sufriendo descuadres diarios. Por eso, nuestra visión es un POS SaaS ultra-reactivo, 100% operable por teclado, con un control de inventario en tiempo real."*

### Slide 2: Alcance del MVP y Exclusiones
- **Visual:** Lista de Inclusiones (POS, Inventario Base) vs Exclusiones (Arqueos, SII).
- **Guion Sugerido (Rodrigo):** *"Para este MVP (Semana 4), delimitamos estrictamente nuestro alcance. Decidimos posponer los módulos de Arqueos de Caja y Roles de Usuario porque nuestra capacidad era de 8 puntos de historia. Preferimos enfocarnos en garantizar la seguridad de los datos y la velocidad del mostrador antes de construir funciones secundarias."*

### Slide 3: Priorización del Backlog
- **Visual:** Top 3 del Backlog (SPIKE-01, PBI-01, PBI-02) destacando Valor y Riesgo.
- **Guion Sugerido (Rodrigo):** *"Priorizamos el Backlog basándonos en valor y riesgo. El SPIKE-01 fue nuestra prioridad técnica para aislar los datos (mitigar riesgo). Luego, el PBI-01 (Inventario) nos da la base de datos, y el PBI-02 (Venta Ágil) entrega el valor central al usuario final."*

---

## 🔹 PARTE 2: ARQUITECTURA, TECNOLOGÍA Y CONTRIBUCIONES (2 min)
**🎤 Oradores:** Leonel Ayala (Backend) y Luis Barrios (UI/UX)

### Slide 4: Stack Tecnológico (NUEVA)
- **Visual:** Logos de Laravel 11, React, Inertia.js, Tailwind CSS, MySQL.
- **Guion Sugerido (Leonel):** *"Para sostener esta operación rápida y segura, elegimos Laravel 11 como motor Backend para inyectar robustez y 'Global Scopes'. En el Frontend usamos React integrado mediante Inertia.js. Esto nos permite tener la velocidad de una Single Page Application (SPA) sin perder el enrutamiento clásico de Laravel."*

### Slide 5: Roles y Contribuciones Técnicas (NUEVA)
- **Visual:** Fotos/Avatares del equipo con viñetas de sus tareas reales.
- **Guion Sugerido (Luis):** *"Como equipo ágil, nos dividimos verticalmente:*
  - *Leonel Ayala (Full Stack / DB): Diseñó los esquemas relacionales y programó los Global Scopes del Multi-Tenant.*
  - *Luis Barrios (Full Stack / UX): Desarrollé el frontend reactivo, configurando el autofocus y la operabilidad por teclado del POS.*
  - *Alan Troncoso (Scrum Master / QA): Aseguró el cumplimiento de las ceremonias, trazabilidad y diseñó los escenarios límite de pruebas.*
  - *Rodrigo Bertolini (PO): Gestionó las entrevistas a usuarios y priorizó el backlog."*

---

## 🔹 PARTE 3: DEMOSTRACIÓN TÉCNICA EN VIVO (4 - 5 min)
> [!TIP]
> **Dinámica de la Demo:** 
> - ⌨️ **Operador (Teclado/Mouse):** Luis Barrios (Navega el sistema con fluidez).
> - 🎙️ **Relatores:** Leonel, Luis y Alan según el tema.

### Live Demo 1: Seguridad Multi-Tenant (SPIKE-01)
- **Operador:** Luis abre el sistema e intenta cambiar la URL manualmente a un ID de negocio distinto.
- **Guion Sugerido (Leonel):** *"Antes de vender, debemos asegurar la privacidad (RNF-SEC-01). Como ven, Luis intenta acceder a un producto de otra PYME por URL. El sistema bloquea automáticamente con un Error 403. Esto valida nuestro Criterio de Aceptación AC-SEC-01, implementado desde la base de datos."*

### Live Demo 2: Camino Feliz - Venta Ágil (PBI-01 y PBI-02)
- **Operador:** Luis navega el catálogo, copia un SKU y se va al POS. Usa **solo el teclado** para agregar el producto y sumar cantidades.
- **Guion Sugerido (Luis):** *"Ahora validamos el corazón comercial (AC-03 y AC-04). Todo el flujo de venta, desde buscar hasta calcular el vuelto, se hace sin tocar el mouse y sin recargar la página. Cumplimos la métrica de tiempo de respuesta (p95 < 1s) gracias a la reactividad de React e Inertia."*

### Live Demo 3: Casos Límite y Prevención de Errores
- **Operador:** Luis intenta vender un producto que tiene stock 0.
- **Guion Sugerido (Alan):** *"Como QA, me aseguré de probar los bordes del sistema. Aquí Luis intenta forzar la venta de un artículo agotado. Como dicta el Criterio AC-05, el sistema detecta el límite y bloquea la venta al instante, protegiendo la regla de negocio de inventario negativo."*

---

## 🔹 PARTE 4: CALIDAD, TRAZABILIDAD Y CIERRE (2 min)
**🎤 Orador:** Alan Troncoso (Scrum Master y QA)

### Slide 6: Trazabilidad y Calidad del Proceso
- **Visual:** Matriz de trazabilidad y pantallazo del Repositorio (Pull Requests).
- **Guion Sugerido (Alan):** *"Cada línea de código está justificada. Nuestra matriz conecta la Necesidad 05 con el Requisito Funcional 03 y el Criterio de Aceptación 05 que acaban de ver fallar controladamente. Nuestro repositorio en GitHub refleja esta organización mediante Pull Requests revisados entre pares, asegurando integración continua."*

### Slide 7: Limitaciones, Riesgos y Próximos Pasos
- **Visual:** Lo pendiente y metas para la Semana 5.
- **Guion Sugerido (Alan):** *"Somos conscientes de nuestras limitaciones actuales: hoy no tenemos una cuadratura de caja activa ni control de sesiones de empleados. Para el próximo incremento, nuestro objetivo es liberar los módulos de Arqueos (PBI-03) y Gestión de Roles (PBI-04) basándonos en esta arquitectura ya validada. Gracias."*

---

## 🔹 PARTE 5: DEFENSA TÉCNICA (Evaluación Individual)
*Durante las preguntas de los profesores, respeten sus especialidades:*

- **Rodrigo (PO):** Responde preguntas sobre **por qué** eligieron hacer algo, costos, decisiones de alcance y priorización de usuarios.
- **Luis (UI/UX):** Responde preguntas sobre **React, Inertia**, usabilidad, validación en el frontend y por qué eligieron Tailwind.
- **Leonel (DB/Backend):** Defiende el **modelo SQL**, la decisión técnica detrás de los *Global Scopes*, relaciones de base de datos y seguridad Backend.
- **Alan (SM/QA):** Defiende los **criterios de aceptación (BDD)**, cómo aislaron errores, la gestión de Git (ramas/PRs) y las dinámicas del equipo (acuerdos y resolución de bloqueos).
