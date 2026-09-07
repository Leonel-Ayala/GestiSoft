# Bitácora Individual - Luis Barrios

* **Rol / Cargo:** Full Stack / UI & UX
* **Equipo / Producto:** GestiSoft
* **Periodo registrado:** Semanas 3 y 4 (Definición y Ejecución MVP)

## Registro de Aprendizaje y Contribución

| Pregunta | Respuesta personal |
|----------|--------------------|
| **¿Qué contribución significativa realicé?** | Diseñé y programé el Frontend completo del MVP utilizando React e Inertia.js. Implementé el módulo de Venta Rápida (POS) asegurando que pudiera ser operado 100% por atajos de teclado y con tiempos de respuesta ultra rápidos. |
| **¿Qué decisión puedo explicar y justificar?** | Decidí utilizar React + Inertia en vez de plantillas Blade tradicionales. Lo justifico basándome en el atributo de calidad **RNF-PERF-01**, ya que el POS necesitaba evitar la recarga completa del navegador para no hacer esperar al cliente en la fila. |
| **¿Qué evidencia obtuve o analicé?** | Analicé el requerimiento de accesibilidad **RNF-ACC-01** (Atención sin mouse). Investigué y apliqué lógica de autofocus constante y eventos de escucha global de teclado (`keydown`) en los inputs críticos. |
| **¿Qué revisión hice al trabajo de otra persona?** | Revisé el backend expuesto por Leonel para asegurar que las respuestas JSON que llegaban al Frontend trajeran las validaciones correctas (ej. la bandera de "sin stock") sin exponer los IDs reales del Inquilino. |
| **¿Qué aprendí o corregí?** | Aprendí a gestionar estados complejos de arreglos (el carrito de compras) directamente en el navegador del cliente (State Management) y a sincronizarlo asíncronamente con Laravel de forma limpia. |
| **¿Cuál es mi próxima acción?** | Refinar las alertas visuales (UI Toasts) ante errores no previstos e integrar la lógica visual para el próximo módulo de Arqueos de Caja. |

## Trazabilidad
* **Evidencia:** `product/week3/quality-security.md` | **Qué demuestra:** Cumplimiento estricto del rendimiento visual y accesibilidad.
* **Evidencia:** `product/backlog/PBI-02.md` | **Qué demuestra:** Cumplimiento de la necesidad N-02 (Rapidez en mostrador).
