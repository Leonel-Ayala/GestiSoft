# GestiSoft - Sistema SaaS de Punto de Venta (POS) e Inventario

GestiSoft es una plataforma SaaS (*Software as a Service*) multi-inquilino (*multi-tenant*) diseñada para agilizar la operación comercial de PYMEs y comercios del sector retail. Su objetivo principal es centralizar la gestión de inventario, controlar los roles de acceso y acelerar el proceso de ventas en mostrador mediante una interfaz reactiva operable 100% por teclado.

---

## Características del Sistema (Incremento Funcional 1)

* **Aislamiento Multi-Tenant Estricto:** Arquitectura segura (*Single-Database*) mediante *Global Scopes* en Eloquent (Trait `HasNegocio`) que garantiza que los datos, usuarios, inventarios y ventas de cada comercio estén estrictamente aislados y privados.
* **Gestión de Empleados y Roles (RBAC - PBI-04):** Separación estricta de perfiles (`Administrador` y `Cajero`). Los cajeros operan exclusivamente la terminal de venta (POS) y son bloqueados con código `HTTP 403 Forbidden` o redirigidos si intentan acceder a inventarios o usuarios.
* **Control de Inventario y Kardex:** CRUD para el registro de SKUs, precios y existencias con auditoría obligatoria de movimientos de stock (justificación de mermas, deterioros y ajustes manuales).
* **Integridad y Borrado Lógico (*Soft Deletes*):** La desvinculación de un empleado inhabilita su acceso sin destruir el historial contable ni los registros de sus ventas pasadas.
* **Punto de Venta (POS) Ultrarrápido y Accesible:** Interfaz reactiva operada mediante atajos de teclado (`[F4]` buscar producto, `[F8]` cobrar, `[Esc]` cancelar), cálculo automático de IVA (19%), cálculo instantáneo de vuelto en efectivo y persistencia de carrito en `localStorage` ante cambios de página.
* **Suite de Pruebas Automatizadas:** Batería de pruebas de integración con PHPUnit (`MultiTenantSecurityTest`, `InventoryTest`, `POSTest`, `RoleSecurityTest`) que garantizan el cumplimiento de las reglas de negocio y seguridad.

---

## Pila Tecnológica

* **Backend:** Laravel 11 (PHP 8.2+)
* **Frontend:** React 18 integrado de forma monolítica mediante Inertia.js
* **Estilos y Diseño:** Tailwind CSS
* **Base de Datos:** MySQL / MariaDB (InnoDB)
* **Empaquetador:** Vite

---

## Estructura del Repositorio

```text
GestiSoft/
├── bitacoras/          # Registros individuales de trabajo del equipo por semana
├── docs/               # Acuerdos de equipo, referencias externas y manuales
│   └── assets/         # Recursos visuales y logos del proyecto (branding)
├── gestisoft-app/      # Código fuente de la aplicación web (Laravel + React)
├── investigacion/      # Descubrimiento, síntesis de necesidades y entrevistas anonimizadas
├── producto/           # Backlog (PBIs, SPIKEs), visión, planes de incremento y trazabilidad
│   ├── backlog/        # Definición de ítems del Product Backlog (PBI-01 a PBI-05, SPIKEs)
│   ├── semana-3/       # Requisitos, glosario, matriz de trazabilidad y criterios de aceptación
│   └── semana-6/       # Plan de arquitectura e incremento funcional 1
└── riesgos/            # Matriz y registro formal de riesgos del proyecto
```

---

## Requisitos Previos

* PHP >= 8.2 (con extensiones `pdo_mysql`, `mbstring`, `openssl`, `bcmath`)
* Composer
* Node.js (v18+) & npm
* Servidor MySQL activo (ej. Laragon, XAMPP o servicio local en puerto 3306)

---

## Instalación y Puesta en Marcha Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Leonel-Ayala/GestiSoft.git
   ```

2. **Entrar al directorio de la aplicación:**
   ```bash
   cd GestiSoft/gestisoft-app
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
   * Copiar `.env.example` a `.env`:
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
   *(Carga automáticamente 5 comercios temáticos: Ropa, Pokémon TCG, Heladería, Comida Rápida y Abarrotes con sus administradores y 10 productos cada uno).*

8. **Compilar el frontend y levantar el servidor:**
   * En una terminal:
     ```bash
     npm run dev
     ```
   * En otra terminal:
     ```bash
     php artisan serve
     ```
   * Abrir en el navegador: `http://localhost:8000`

---

## Equipo de Desarrollo

* **Rodrigo Bertolini** — *Product Owner*
* **Alan Troncoso** — *Scrum Master & QA Lead*
* **Luis Barrios** — *Fullstack & UI/UX Lead*
* **Leonel Ayala** — *Fullstack & Backend/DB Lead*
