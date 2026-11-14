# GestiSoft - Sistema SaaS de Punto de Venta (POS) e Inventario

GestiSoft es una plataforma SaaS (*Software as a Service*) multi-inquilino (*multi-tenant*) diseñada para agilizar la operación comercial de PYMEs y comercios del sector retail. Su objetivo principal es centralizar la gestión de inventario, controlar los roles de acceso, asegurar la cuadratura financiera de cajas y acelerar el proceso de ventas en mostrador mediante una interfaz reactiva operable 100% por teclado.

---

## Características del Sistema (Incremento Funcional 1 y 2 - PBI-01, PBI-02, PBI-03, PBI-04)

* **Aislamiento Multi-Tenant Estricto:** Arquitectura segura (*Single-Database*) mediante *Global Scopes* en Eloquent (Trait `HasNegocio`) que garantiza que los datos, usuarios, inventarios, turnos y ventas de cada comercio estén estrictamente aislados y privados.
* **Gestión de Empleados y Roles (RBAC - PBI-04):** Separación estricta de perfiles (`Administrador` y `Cajero`). Los cajeros operan exclusivamente la terminal de venta (POS) y sus turnos de caja, siendo bloqueados con código `HTTP 403 Forbidden` o redirigidos si intentan acceder a inventarios o administración de usuarios.
* **Control de Inventario y Kardex Inmutable (PBI-01):** CRUD para el registro de SKUs, precios y existencias con auditoría transaccional de movimientos de stock. Los ajustes manuales requieren motivo obligatorio y el borrado de productos mediante *Soft Deletes* preserva permanentemente el historial de Kardex.
* **Punto de Venta (POS) con Integridad en Servidor (PBI-02):** Interfaz reactiva operada mediante atajos de teclado (`[F4]` buscar producto, `[F8]` cobrar, `[Esc]` cancelar), cálculo automático de IVA (19%) y cálculo de vuelto en efectivo. **Todos los precios, subtotales, impuestos y vueltos se calculan y validan estrictamente en el servidor**, bloqueando cualquier intento de manipulación desde el cliente.
* **Control de Arqueo y Cierre de Caja Ciego (PBI-03):** Apertura de turno con fondo inicial, soporte multicanal de pagos (Efectivo, Débito, Crédito, Transferencia), cierre con declaración a ciegas de efectivo, cálculo de descuadre (sobrante/faltante), panel de auditoría gerencial con desglose de boletas y acta oficial imprimible en PDF con constancia de firma.
* **Suite de Pruebas Automatizadas y CI:** Batería de 64 pruebas de integración y seguridad con PHPUnit (`MultiTenantSecurityTest`, `InventoryTest`, `POSTest`, `RoleSecurityTest`, `TurnoCajaTest`, `CajaTurnoSecurityTest`) con ejecución continua en GitHub Actions.

---

## Pila Tecnológica

* **Backend:** Laravel 13 (PHP 8.3+)
* **Frontend:** React 18 integrado de forma monolítica mediante Inertia.js
* **Estilos y Diseño:** Tailwind CSS
* **Base de Datos:** MySQL / MariaDB (InnoDB) para desarrollo/producción; SQLite en memoria para tests
* **Empaquetador:** Vite
* **Integración Continua:** GitHub Actions (`.github/workflows/tests.yml`)

---

## Estructura del Repositorio

```text
GestiSoft/
├── .github/workflows/  # Pipeline de Integración Continua (CI)
├── bitacoras/          # Registros individuales de trabajo del equipo por semana
├── docs/               # Guías semanales, acuerdos de equipo, referencias y manuales
│   └── assets/         # Recursos visuales y logos del proyecto (branding)
├── gestisoft-app/      # Código fuente de la aplicación web (Laravel + React)
├── investigacion/      # Descubrimiento, validación de hipótesis (H-01) y entrevistas anonimizadas
├── producto/           # Backlog (PBIs, SPIKEs), visión, planes de incremento y trazabilidad
│   ├── backlog/        # Definición de ítems del Product Backlog (PBI-01 a PBI-05, SPIKEs)
│   ├── semana-3/       # Requisitos, glosario, matriz de trazabilidad y criterios de aceptación
│   └── semana-6/       # Plan de arquitectura e incremento funcional 1
└── riesgos/            # Matriz y registro formal de riesgos del proyecto
```

---

## Requisitos Previos

* PHP >= 8.3 (con extensiones `pdo_mysql`, `pdo_sqlite`, `mbstring`, `openssl`, `bcmath`)
* Composer
* Node.js (v18+) & npm
* Servidor MySQL activo (ej. Laragon, XAMPP o servicio local en puerto 3306)

---

## Instalación y Puesta en Marcha Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Leonel-Ayala/GestiSoft.git
   ```

2. **Entrar al directorio raíz del proyecto y luego a la aplicación:**
   ```bash
   cd GestiSoft
   cd gestisoft-app
   ```

3. **Instalar dependencias del Backend:**
   ```bash
   composer install
   ```

4. **Instalar dependencias del Frontend:**
   ```bash
   npm install
   ```

5. **Configurar variables de entorno:**
   * En Linux / macOS:
     ```bash
     cp .env.example .env
     ```
   * En Windows (PowerShell / CMD):
     ```bash
     copy .env.example .env
     ```
   * Asegurar las credenciales de base de datos en `.env`:
     ```ini
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=gestisoft
     DB_USERNAME=root
     DB_PASSWORD=
     ```

6. **Generar la clave de la aplicación:**
   ```bash
   php artisan key:generate
   ```

7. **Ejecutar migraciones y poblar datos de prueba (Seeders temáticos):**
   ```bash
   php artisan migrate --seed
   ```
   *(Carga automáticamente comercios temáticos: Ropa, Pokémon TCG, Heladería, Comida Rápida y Abarrotes con sus administradores, cajeros de prueba y catálogo inicial de productos).*

8. **Compilar assets del frontend:**
   ```bash
   npm run build
   ```

9. **Ejecutar la suite completa de pruebas automatizadas:**
   ```bash
   php artisan test
   ```
   *(Valida 64 pruebas de seguridad multi-tenant, roles RBAC, transacciones atómicas, kardex inmutable y cuadratura de caja).*

10. **Levantar los servidores locales:**
    * En una terminal (Backend):
      ```bash
      php artisan serve
      ```
    * En otra terminal (Frontend para desarrollo con recarga en vivo):
      ```bash
      npm run dev
      ```
    * Abrir en el navegador: `http://localhost:8000`

---

## Cuentas de Acceso de Prueba (Demostración)

| Rol | Correo Electrónico | Contraseña | Comercio Asociado | Alcance de Permisos |
| :--- | :--- | :--- | :--- | :--- |
| **Administrador** | `ropa@gestisoft.cl` | `admin1234` | Boutique Urbana | Acceso total: Dashboard, Inventario, Usuarios, Auditoría de Cajas y POS |
| **Cajero** | `cajero@gestisoft.cl` | `cajero1234` | Boutique Urbana | Acceso restringido: Apertura, Cobro en POS y Cierre/Arqueo de Turno |
| **Administrador** | `pokemon@gestisoft.cl` | `admin1234` | PokéStore TCG | Aislamiento multi-tenant independiente |
| **Administrador** | `helados@gestisoft.cl` | `admin1234` | Heladería Dulce Crema | Aislamiento multi-tenant independiente |

---

## Equipo de Desarrollo

* **Rodrigo Bertolini** — *Product Owner*
* **Alan Troncoso** — *Scrum Master & QA Lead*
* **Luis Barrios** — *Fullstack & UI/UX Lead*
* **Leonel Ayala** — *Fullstack & Backend/DB Lead*
