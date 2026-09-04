# Alcance y Criterios de Éxito (Semana 2)

## Alcance del Proyecto
El enfoque del proyecto se centra en resolver la operación en el mostrador para el rubro comercial (Retail).
- **Incluye:** Gestión de catálogo y control de stock, Interfaz POS de venta rápida reactiva, Gestión de Turnos/Arqueos, Aislamiento de base de datos Multi-Tenant, y reportería básica.
- **Exclusiones Explícitas:** Queda estrictamente fuera de nuestro alcance la integración con el Servicio de Impuestos Internos (SII) para facturación electrónica, así como funcionalidades ajenas al comercio retail (ej. manejo de comandas, mesas de restaurantes).

## Criterios de Éxito
- **Validación Comercial:** Reducción comprobable del tiempo de ingreso de una venta en mostrador (Operación por teclado).
- **Validación Técnica:** Demostrar que un *Tenant* jamás puede consultar, editar ni ver la información de otro *Tenant* en la base de datos unificada.
