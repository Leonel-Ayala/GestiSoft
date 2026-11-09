# SPIKE-03: Estructura Relacional y Enlace Atómico de Turnos de Caja (PBI-03)

## 1. Definición del Ítem
- **ID:** SPIKE-03
- **Título:** Diseño de estructura relacional, enlace atómico de ventas y auditoría de arqueo de caja (*Turnos de Caja*).
- **Necesidad Técnica:** El sistema requiere modelar la persistencia de los turnos de caja separando el dinero físico en gaveta del dinero digital, vinculando cada venta atómicamente a su turno sin degradar el rendimiento del POS (RNF-PERF-01), y garantizando aislamiento estricto Multi-Tenant.
- **Responsable:** Leonel Ayala (Backend & DB Lead)

---

## 2. Objetivo de Aprendizaje
Determinar el esquema relacional óptimo en MySQL para soportar el ciclo de vida completo de una caja de retail:
1. **Apertura de turno** con registro de fondo inicial de vuelto (`monto_inicial`).
2. **Operación continua en el POS** con indexación compuesta (`negocio_id`, `user_id`, `estado`) para validar el turno activo en menos de 10 ms.
3. **Arqueo ciego** donde el cajero declara el dinero físico contado (`monto_declarado`) y el sistema calcula la cuadratura contable (`diferencia`).

---

## 3. Riesgos e Incertidumbres Mitigados
* **Riesgo de Concurrencia y Rendimiento:** Si cada venta requiriera bloqueos pesados sobre el turno, se ralentizaría el POS en horas punta.  
  *Mitigación:* Se almacena la clave foránea `turno_caja_id` directamente en la tabla `ventas` con índice directo, permitiendo acumular y recalcular totales sin contención de bloqueos.
* **Riesgo Multi-Tenant (RSK-01):** Que un comercio pueda auditar o ver los turnos de otro negocio.  
  *Mitigación:* Inclusión del campo `negocio_id` y aplicación del Trait `HasNegocio` en el modelo `TurnoCaja`, activando el *Global Scope* automático de Laravel.
* **Integridad Referencial Histórica:** Asegurar que las ventas previas al incremento no fallen al no poseer un turno asignado.  
  *Mitigación:* Campo `turno_caja_id` definido como `nullable` en la migración de `ventas`.

---

## 4. Artefactos Entregables y Evidencia
* **Migraciones ejecutadas exitosamente:**
  * `2026_11_08_224000_create_turnos_caja_table.php` (Tabla `turnos_caja`).
  * `2026_11_08_224100_add_turno_caja_id_to_ventas_table.php` (Columna `turno_caja_id` en `ventas`).
* **Modelos Eloquent y Relaciones:**
  * `TurnoCaja.php`: Modelo con Trait `HasNegocio`, casts numéricos, relación `belongsTo(User)` y `hasMany(Venta)`.
  * `Venta.php`: Relación `belongsTo(TurnoCaja, 'turno_caja_id')`.
  * `User.php`: Relación `hasMany(TurnoCaja)`.
  * `Negocio.php`: Relación `hasMany(TurnoCaja)`.
* **Criterio de Éxito:** La base de datos MySQL en Laragon posee la tabla `turnos_caja` con claves foráneas activas y el modelo permite realizar consultas de verificación en milisegundos.

---

## 5. Trazabilidad
* **Deriva de:** Necesidad **N-01** y Problema **P01** (Descuadres y arqueos lentos al final del día).
* **Habilita a:** **PBI-03** (*Módulo Caja: Arqueo y cierre de turno*).
* **Vinculado con:** **ADR-01** (Multi-Tenancy) y **RSK-01** (Aislamiento de datos).

