# Guía de Apoyo y Mapeo Documental - Presentación MVP (Semana 4)

**Objetivo de este Documento:** Servir como guía definitiva para el equipo durante la presentación. Mapea exactamente **qué documento del repositorio (MD/CSV) debe proyectarse o mencionarse** en cada diapositiva, junto con instrucciones claras de qué debe hacer, decir y demostrar cada encargado.

---

## FASE 1: Fundamentos del Negocio y Producto

### Slide 1: Contexto, Evidencia y Necesidad
* **Encargado (Orador):** Rodrigo Bertolini
* **Documentos de Apoyo a Proyectar/Citar:** 
  * `product/vision-v1.md` (Para la visión general).
  * `product/week3/needs-glossary.md` (Para mostrar la tabla de Necesidades N-01 a N-07).
  * `product/week3/input-check.md` (Para mostrar las decisiones basadas en evidencia).
* **Qué debe hacer/decir:** Rodrigo debe iniciar la presentación con fuerza. Explicar que el problema no se inventó, sino que nació de las entrevistas (usar los códigos O01 y P01). Debe mostrar brevemente el archivo `needs-glossary.md` para probar que cada necesidad tiene una "Fuente" y "Confianza Alta".

### Slide 2: Hipótesis de Valor y Criterios de Éxito
* **Encargado (Orador):** Rodrigo Bertolini
* **Documentos de Apoyo a Proyectar/Citar:** 
  * `product/scope-success-v1.md` (Sección Criterios de Éxito).
  * `product/week3/quality-security.md` (Atributos de calidad: RNF-PERF-01 y RNF-ACC-01).
* **Qué debe hacer/decir:** Enlazar la necesidad del negocio con la tecnología. Indicar que el éxito técnico se validará operando el 100% del POS por teclado (Accesibilidad) y logrando respuestas en menos de 1 segundo (Rendimiento).

### Slide 3: Objetivo, Alcance y Exclusiones del MVP
* **Encargado (Orador):** Rodrigo Bertolini
* **Documentos de Apoyo a Proyectar/Citar:** 
  * `product/week3/mvp-plan.md` (Proyectar la tabla "Exclusiones Justificadas").
* **Qué debe hacer/decir:** Esta es la slide más importante de Rodrigo. Debe mostrar en el `mvp-plan.md` por qué se cortó el alcance. Explicar: "Teníamos 8 puntos de capacidad, así que el módulo de Caja (PBI-03) y Roles (PBI-04) quedaron fuera para asegurar la calidad de la venta rápida".

### Slide 4: Priorización del Product Backlog
* **Encargado (Orador):** Rodrigo Bertolini
* **Documentos de Apoyo a Proyectar/Citar:** 
  * `product/backlog/SPIKE-01.md`, `PBI-01.md` y `PBI-02.md`.
* **Qué debe hacer/decir:** Abrir rápidamente uno de los archivos del backlog (ej. PBI-02) para mostrar cómo están estructuradas las fichas. Demostrar que el orden no fue al azar: SPIKE-01 fue primero por ser el máximo riesgo (seguridad), luego PBI-01 por dependencia, y PBI-02 por valor comercial.

---

## FASE 2: Preparación y Arquitectura

### Slide 5: Producto Ejecutable y Equipo
* **Encargado (Orador):** Luis Barrios
* **Documentos de Apoyo a Proyectar/Citar:** 
  * El repositorio de GitHub o el archivo `README.md` (si tiene las instrucciones).
* **Qué debe hacer/decir:** Luis debe mostrar la terminal ejecutando `php artisan serve` y `npm run dev` para demostrar que el producto levanta sin problemas. Luego, relata brevemente qué hizo cada miembro del equipo (la división vertical: backend, frontend, PO y QA).

### Slide 6: Atributos de Calidad y Stack Tecnológico
* **Encargado (Orador):** Luis Barrios
* **Documentos de Apoyo a Proyectar/Citar:** 
  * `product/week3/quality-security.md` (Para reforzar que el stack obedece a las restricciones de calidad).
* **Qué debe hacer/decir:** Luis explica por qué se usa React con Inertia.js (para la velocidad y no recargar la página) y le da el pase a Leonel para que mencione brevemente cómo Laravel 11 maneja la seguridad.

---

## FASE 3: Demostración en Vivo (Pantallas del Sistema)
> ⚠️ **Dinámica Crítica:** Leonel Ayala opera el software (teclado/mouse) sin fallas, mientras Luis y Alan relatan.

### Slide 7: Corte Vertical e Integración
* **Encargado (Orador):** Leonel Ayala (Relator)
* **Qué debe hacer/demostrar:** Navegar fluido por el sistema (Login, ver inventario, abrir el POS). Explicar que lo que se ve en la pantalla está consumiendo directamente la base de datos (demostrando integración completa de frontend a backend).

### Slide 8: Criterios de Aceptación - Camino Feliz
* **Encargado (Orador):** Leonel Ayala
* **Documentos de Apoyo a Proyectar/Citar:** 
  * `product/week3/acceptance.feature` (Escenarios AC-03 y AC-06).
* **Qué debe hacer/demostrar:** Mientras ingresa un código de producto con el teclado y presiona Enter, debe decir: *"Como ven, se cumple el AC-03 del archivo acceptance.feature: el producto se agrega a la venta y calcula totales sin usar el mouse ni recargar la web."*

### Slide 9: Casos Límite y Prevención de Errores
* **Encargado (Orador):** Alan Troncoso
* **Documentos de Apoyo a Proyectar/Citar:** 
  * `product/week3/acceptance.feature` (Escenario AC-05, tag `@Exception`).
* **Qué debe hacer/demostrar:** Alan toma la palabra. Le pide a Leonel (quien opera el PC) que intente vender un producto que no tiene stock. **Demostración:** El sistema arroja la alerta roja de stock. Alan concluye: *"Validamos el caso límite AC-05, el sistema previene activamente el inventario negativo."*

### Slide 10: Seguridad, Privacidad y Desarrollo Seguro
* **Encargado (Orador):** Luis Barrios
* **Documentos de Apoyo a Proyectar/Citar:** 
  * `product/week3/quality-security.md` (Tratamiento de Exposición de Datos y RNF-SEC-01).
* **Qué debe hacer/demostrar:** Luis pide a Leonel que cambie manualmente la URL del navegador para intentar ver un producto del "Negocio 2". **Demostración:** Aparece Error 403. Luis explica: *"Con esto matamos el riesgo de exposición de datos usando Global Scopes; un inquilino jamás verá la data de otro."*

---

## FASE 4: Gestión, Calidad y Cierre

### Slide 11: Trazabilidad de Extremo a Extremo
* **Encargado (Orador):** Alan Troncoso
* **Documentos de Apoyo a Proyectar/Citar:** 
  * `product/week3/traceability.csv` (Abrir el CSV o mostrar una captura clara).
* **Qué debe hacer/decir:** Mostrar el archivo `traceability.csv` y leer un flujo en vivo: *"Nuestro trabajo no es al azar. Miren esta línea: El dolor P01 generó la necesidad N-05, lo cual derivó en el Requisito 08, que empaquetamos en el PBI-01 y probamos recién con el AC-06."*

### Slide 12: Pruebas y Evidencia de Verificación
* **Encargado (Orador):** Alan Troncoso
* **Documentos de Apoyo a Proyectar/Citar:** 
  * Archivos de pruebas automatizadas o reportes de test si existen, o referenciar los tags del `acceptance.feature`.
* **Qué debe hacer/decir:** Asegurar que todos los Criterios de Aceptación (AC-01 al AC-SEC-01) fueron validados empíricamente antes de fusionar el código.

### Slide 13: Repositorio, Versionado e Integración
* **Encargado (Orador):** Alan Troncoso
* **Documentos de Apoyo a Proyectar/Citar:** 
  * Interfaz web de GitHub (Sección de Pull Requests / Commits).
* **Qué debe hacer/decir:** Proyectar el GitHub del equipo en la pestaña de Pull Requests. Mencionar: *"No subimos código directamente a la rama principal (main); todo pasó por revisiones cruzadas (Code Review), manteniendo un historial organizado."*

### Slide 14: Limitaciones, Riesgos y Próximos Pasos
* **Encargado (Orador):** Alan Troncoso (con apoyo de Rodrigo)
* **Documentos de Apoyo a Proyectar/Citar:** 
  * `product/week3/readiness.md` y `product/week3/mvp-plan.md` (Sección exclusiones).
* **Qué debe hacer/decir:** Ser transparente frente a los profesores. *"¿Qué nos falta? No tenemos cuadratura de caja activa hoy. Nuestro próximo paso para la Semana 5 es construir el módulo de Caja (PBI-03) y los Roles de Usuario (PBI-04), montados sobre la arquitectura segura que hoy validamos."*
