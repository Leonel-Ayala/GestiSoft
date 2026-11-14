# Protocolo de Evaluación y Validación de la Hipótesis H-01: Ensayo de Role-Playing en Laboratorio y Hoja de Ruta de Campo

**Fecha de Ejecución:** 10 al 12 de Noviembre de 2026  
**Responsables Metodológicos:** Rodrigo Bertolini (Product Owner) y Alan Troncoso (Scrum Master / QA Lead)  
**Versión Evaluada:** GestiSoft v0.2.0-rc2 (Incremento 1 con mitigación de integridad C1-C4 y módulo de turnos PBI-03)  
**Metodología:** *Role-Playing Usability Testing* (Simulación controlada en laboratorio basada en Personas de Descubrimiento) + Declaración formal de límites de validación de campo.

---

## 1. Contexto Académico y Justificación Metodológica

En la segunda demostración y defensa, la retroalimentación docente (Criterios 2 y 15) destacó que la hipótesis **H-01** (*"Si el cajero no puede ver ni modificar inventario ni precios, el dueño confiará en dejarlo solo operando la caja"*) había sido sustentada únicamente mediante indicadores puramente técnicos (100% de peticiones bloqueadas con código `HTTP 403 Forbidden`).

Si bien los bloqueos HTTP 403 acreditan la robustez del mecanismo de control de acceso (*Role-Based Access Control* - RBAC), **no demuestran por sí solos el valor de negocio ni la experiencia operativa percibida por el usuario**.

Frente a este desafío metodológico, y en estricto apego a la honestidad académica exigida por la rúbrica UCM (*"presenta evidencia de la señal o declara con precisión lo aún no validado... sin exagerar resultados"*):
1. **Evitar falsas atribuciones:** No se declararon pruebas de campo no concluidas ni firmas de terceros fuera de control.
2. **Adopción de Role-Playing Testing en Laboratorio:** Se implementó una técnica formal de ingeniería de software y UX denominada *Role-Playing Usability Simulation*, en la cual los miembros del equipo asumieron y recrearon los roles, restricciones y flujos de las 3 contrapartes comerciales caracterizadas en la fase de descubrimiento inicial (`ENT-01`, `ENT-02` y `ENT-03`).
3. **Declaración explícita de límites:** Se formalizan los hallazgos del laboratorio y se establece la programación del ensayo de campo en sitio (*On-site Field Pilot*) para la fase de estabilización final.

---

## 2. Definición Formal de la Hipótesis y Criterio de Decisión

* **Hipótesis H-01 (Refutable):** *Si el sistema restringe estrictamente al cajero para que no pueda visualizar ni modificar inventario, precios ni usuarios, la experiencia operativa mitigará el riesgo de manipulación no autorizada, permitiendo delegar la terminal de cobro sin supervisión continua.*
* **Señal de Éxito de Laboratorio (Protocolo Heurístico):** 
  * En los 3 perfiles comerciales evaluados, el operador en rol cajero debe quedar imposibilitado al 100% de modificar precios unitarios, alterar existencias en bodega o ver saldos esperados antes de la declaración física (arqueo ciego).
  * Los tiempos de cobro en el POS simulado deben ser inferiores a 15 segundos por transacción para no degradar la atención a clientes.
  * Los participantes que auditan el flujo como administradores evalúan la viabilidad de delegación con una calificación $\ge 4/5$ en la escala de satisfacción funcional.
* **Criterio de Decisión Derivada:**
  * **Señal Positiva en Laboratorio:** H-01 se considera **técnica y funcionalmente confirmada en ambiente controlado**; se valida la necesidad crítica de complementar el RBAC con el cierre de turnos y arqueo ciego (PBI-03), justificando plenamente haber postergado la reportería avanzada (PBI-05).
  * **Señal Pendiente (Validación de Campo):** La validación empírica subjetiva externa queda formalmente consignada como **pendiente de validación en terreno** para el piloto de estabilización.

---

## 3. Protocolo de Ensayo de Laboratorio (Role-Playing Testing)

El ensayo se estructuró en 3 escenarios reproducibles de 25 minutos, ejecutados en el laboratorio de desarrollo:

```
[Administrador del Local]                    [Cajero Operador]
        │                                           │
  1. Configura catálogo y stock                     │
  2. Crea usuario cajero en /users                  │
        │                                           │
        │ ── Cierre de sesión y cambio de rol ───►  │
        │                                           │
        │                                    3. Intento intrusivo a /inventory (HTTP 403)
        │                                    4. Intento alteración precios en POS (Bloqueado)
        │                                    5. Apertura de turno ($50.000)
        │                                    6. Operación de venta rápida (teclado)
        │                                    7. Arqueo ciego de cierre (conteo físico)
        │                                           │
        │ ◄── Notificación de entrega de turno ───  │
        │                                           │
  8. Auditoría en /cajas (Conciliación)
  9. Emisión de Acta de Arqueo
```

---

## 4. Registro y Resultados por Perfil Simulado

### Escenario 1: Perfil Abarrotes y Minimarket (Basado en Persona ENT-01 - Almacén Tradicional)
* **Perfil Evaluado:** Minimarket de alta rotación y ventas predominantemente en efectivo.
* **Foco del Ensayo:** Verificar si un cajero puede adulterar el stock de abarrotes o sustraer dinero sin detección durante turnos continuos.
* **Comportamiento y Resultados del Ensayo:**
  1. Se inició sesión como cajero e intentó forzar navegación directa a `http://localhost:8000/inventory`. Redirección inmediata a `/pos` con alerta de seguridad.
  2. En el POS se realizaron 5 ventas en efectivo sucesivas utilizando atajos de teclado (`F2`, `Enter`, `Barra Espaciadora`). Tiempo promedio por venta: **6.2 segundos**.
  3. Al cerrar caja, el sistema solicitó conteo ciego sin mostrar el total esperado ($612.790). Se ingresó declaración con faltante inducido de -$2.000.
  4. Desde el usuario administrador en `/cajas`, se detectó el descuadre exacto en rojo (`Faltante -$2.000`) y se generó el acta de turno.
* **Veredicto del Perfil:** **Conforme (Calificación 4/5)**. Mitiga el riesgo de robo hormiga; la necesidad prioritaria identificada fue la visualización mensual por defecto en la vista de auditoría (incorporada).

### Escenario 2: Perfil Boutique y Moda (Basado en Persona ENT-02 - Retail de Vestuario)
* **Perfil Evaluado:** Boutique de prendas de vestir con precios unitarios medios-altos ($15.000 a $65.000).
* **Foco del Ensayo:** Verificar que el cajero no pueda otorgar descuentos arbitrarios ni cambiar precios en el carrito de compras a conocidos o familiares.
* **Comportamiento y Resultados del Ensayo:**
  1. Se interceptó la petición HTTP del checkout intentando enviar un payload alterado con `price: 1000` para un vestido de $35.000.
  2. El servidor ejecutó la validación C1 (`lockForUpdate` y recalculo obligatorio desde base de datos), cobrando el precio oficial del catálogo ($35.000) e ignorando el precio manipulado del cliente.
  3. Se probó venta con tarjeta de débito y crédito. El sistema discriminó correctamente los fondos electrónicos de la gaveta física de efectivo.
* **Veredicto del Perfil:** **Conforme (Calificación 5/5)**. Integridad de precios garantizada al 100% en backend.

### Escenario 3: Perfil Bazar y Coleccionables (Basado en Persona ENT-03 - Artículos de Alta Gama)
* **Perfil Evaluado:** Tienda especializada con ítems coleccionables de alto valor unitario y stock limitado.
* **Foco del Ensayo:** Comprobar que no existan ajustes manuales de stock sin justificación (Kardex inmutable C2) y que el cajero no pueda ver turnos de otros colegas (IDOR C5).
* **Comportamiento y Resultados del Ensayo:**
  1. Se verificó que el cajero `operador` no tiene acceso al Kardex ni a la opción de editar existencias.
  2. Como cajero, se intentó consultar el resumen de turno de otro cajero (`GET /caja/resumen/2`). El controlador retornó `HTTP 403 Forbidden` de inmediato (test `test_cajero_no_puede_ver_resumen_de_turno_de_otro_cajero`).
  3. Se comprobó la generación del comprobante impreso de acta de cierre con los nombres del negocio y cajero responsable.
* **Veredicto del Perfil:** **Conforme (Calificación 4/5)**. Se solicitó agregar alertas visuales ante descuadres superiores a un umbral configurable (anotado para Incremento 3).

---

## 5. Matriz de Síntesis y Trazabilidad

| Dimensión Evaluada | Criterio de Calidad | Resultado en Laboratorio | Estado de Validación |
| :--- | :--- | :---: | :---: |
| **Aislamiento de Rutas (RBAC)** | Bloqueo absoluto de rutas `/inventory`, `/users` a cajeros | 100% peticiones bloqueadas (`HTTP 403`) | **Validado en Tests y Lab** |
| **Integridad de Precios (C1)** | Recálculo forzoso en servidor sin confianza en el cliente | Precios manipulados son sobreescritos | **Validado en Tests y Lab** |
| **Arqueo Ciego de Gaveta** | Cajero no ve saldo esperado al cerrar turno | Campo oculto en formulario de cierre | **Validado en Lab** |
| **Trazabilidad de Descuadres** | Diferencia exacta reflejada en auditoría de caja | Indicador en rojo/verde con cálculo exacto | **Validado en Lab** |
| **Adopción y Confianza Subjetiva en Campo** | Percepción real de dueños en sus locales físicos | Declarado honestamente como no realizado | **Pendiente para Piloto de Campo** |

---

## 6. Declaración de Limitaciones y Plan de Validación de Campo (Fase de Estabilización)

En cumplimiento de los estándares de honestidad técnica de la Facultad de Ingeniería UCM:
1. **Límites de la Evidencia Actual:**
   * La evidencia actual sustenta la **efectividad técnica, la usabilidad de laboratorio y la ausencia de vulnerabilidades lógicas** en el flujo de caja y roles.
   * No se afirma contar con métricas estadísticas de campo en comercios operando en vivo, dado que el producto se encuentra en fase de versión candidata (`v0.2.0-rc2`) previo al despliegue productivo.
2. **Plan de Validación en Sitio (Fase de Estabilización / Incremento 3):**
   * **Objetivo:** Instalar una instancia de prueba en 2 comercios de Talca/Curicó durante 5 jornadas operativas continuas.
   * **Instrumento:** Encuesta SUS (*System Usability Scale*) y registro de discrepancias en arqueos de caja reales al final de cada jornada.
   * **Criterio de Aceptación de Campo:** Puntaje SUS $\ge 75$ y reducción a cero de diferencias de inventario no justificadas.
