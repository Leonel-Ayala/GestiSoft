# Registro de Entrevista Anonimizada Nº 02

**Código de Registro:** ENT-02  
**Fecha:** 29 de Agosto de 2026  
**Entrevistador:** Leonel Ayala (Backend Lead) y Luis Barrios (Frontend Lead)  
**Tipo de Negocio:** Tienda de Vestuario y Calzado Urbano (Sector Retail Moda y Ropa)  
**Ubicación:** Viña del Mar, Chile  
**Perfil del Entrevistado:** Administrador y Socio Fundador  
**Modalidad:** Presencial en oficina de trastienda + Recorrido por sala de ventas  

---

## 1. Contexto Operativo del Negocio
* **Catálogo:** Aproximadamente 450 SKUs activos (poleras, pantalones, chaquetas, accesorios).
* **Personal:** 1 administrador general (dueño) y 3 cajeros/vendedores con contratos de jornada parcial.
* **Modelo de venta:** Venta asistida con mostrador central para emisión de boleta y cobro.
* **Problemática clave previa:** Dificultad para delegar la caja por desconfianza en la manipulación de información comercial.

---

## 2. Preguntas y Respuestas Clave

### P1: ¿Qué limitaciones encuentra al momento de delegar la administración del sistema a sus empleados?
> *"No puedo dejar a un vendedor con acceso total. En los sistemas que hemos cotizado, si le doy acceso a la caja, el vendedor también puede ver a cuánto le compramos las chaquetas al proveedor en Santiago y cuánto margen le estamos sacando. Además, un vendedor malintencionado podría cambiarle el precio a una prenda para venderla más barata a un amigo. Necesito que el cajero solo pueda cobrar y nada más."*
* **Hallazgo / Evidencia:** Vulnerabilidad por ausencia de perfiles diferenciados (**OBS-02**).
* **Necesidad derivada:** **N-06** (Segregación de funciones: Rol Administrador para compras/inventario y Rol Cajero limitado al POS).

---

### P2: ¿Cómo gestionan las prendas que sufren roturas, manchas o deterioro en la exhibición?
> *"Siempre hay mermas: una polera se rasga con la alarma, un pantalón se mancha con maquillaje en el probador o simplemente se pierde una unidad. Hoy el vendedor simplemente la tira al tacho o la deja apartada, y a fin de mes no sabemos por qué el inventario no calza. Necesitamos que cualquier modificación manual de stock quede con nombre, fecha y una justificación obligatoria."*
* **Hallazgo / Evidencia:** Descontrol de inventario por ajustes no auditados (**RF-09**).
* **Necesidad derivada:** **N-05** (Kardex / Historial de movimientos de stock con motivo obligatorio de ajuste).

---

### P3: ¿Qué ocurre cuando un empleado renuncia o es desvinculado?
> *"En los sistemas antiguos, si borrábamos la cuenta del empleado para que no pudiera entrar más, se nos borraban del sistema todas las ventas que él había hecho en el mes, arruinando los balances contables. Teníamos que dejar su usuario activo pero cambiarle la clave, lo cual era inseguro y desordenado."*
* **Hallazgo / Evidencia:** Integridad referencial rota ante la eliminación de usuarios.
* **Decisión técnica derivada:** Implementación de borrado lógico (*Soft Deletes* con columna `deleted_at`) en Laravel para revocar accesos sin corromper el histórico de ventas.

---

## 3. Síntesis y Conclusiones del Entrevistador
1. **Control de Accesos Obligatorio (RBAC):** El servidor debe bloquear con HTTP 403 cualquier intento de un cajero de ver costos de inventario o administrar usuarios (`RoleMiddleware`).
2. **Trazabilidad de Mermas:** Registro detallado de auditoría (`MovimientoStock`) cada vez que se aumente o disminuya stock fuera de una venta normal.
3. **Preservación Histórica:** Uso de borrado suave (*Soft Deletes*) para inhabilitar empleados sin afectar las transacciones previas.

