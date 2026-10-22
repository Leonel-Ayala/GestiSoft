# GestiSoft - SaaS POS & Inventory Management

GestiSoft es una plataforma SaaS (Software as a Service) multi-inquilino diseñada para agilizar la operación comercial de pymes de retail. Su objetivo principal es centralizar la gestión de inventario y acelerar el proceso de ventas en el mostrador mediante una interfaz optimizada.

## Características del Sistema (Incremento Funcional 1 - Semana 9)

*   **Aislamiento Multi-Tenant:** Arquitectura segura (Single-Database) mediante Global Scopes en Eloquent que garantiza que los datos, usuarios y productos de cada pyme estén estrictamente aislados.
*   **Gestión de Empleados y Roles (RBAC - PBI-04):** Separación estricta de perfiles (`Administrador` y `Cajero`). Los cajeros operan exclusivamente la terminal de venta (POS) y son redirigidos automáticamente si intentan acceder al Dashboard o módulos administrativos (HTTP 403 / Redirección forzada).
*   **Gestión de Inventario y Kardex:** CRUD para el registro de SKUs, precios y control de stock con auditoría obligatoria de movimientos (motivo de mermas, deterioros y ajustes).
*   **Borrado Lógico (*Soft Deletes*):** Protección de integridad referencial histórica; la eliminación de un empleado deshabilita su acceso sin destruir el historial contable de sus ventas.
*   **Punto de Venta (POS) Ágil y Accesible:** Interfaz reactiva operada 100% mediante atajos de teclado (`[F4]` buscar, `[F8]` cobrar, `[Esc]` cancelar), alertas accesibles, desglose de IVA y validación de stock en tiempo real.
*   **Suite de Pruebas Automatizadas:** Batería de 14 tests de integración y 37 aserciones con PHPUnit (`MultiTenantSecurityTest`, `InventoryTest`, `POSTest`, `RoleSecurityTest`).

## Pila Tecnológica (Tech Stack)

*   **Backend:** Laravel 11 (PHP)
*   **Frontend:** React.js integrado mediante Inertia.js
*   **Estilos:** Tailwind CSS
*   **Base de Datos:** MySQL / PostgreSQL

## Requisitos Previos

*   PHP >= 8.2
*   Composer
*   Node.js & npm
*   Base de datos configurada (MySQL/PostgreSQL)

## Instalación y Configuración Local

1. Clona este repositorio:
   `git clone https://github.com/Leonel-Ayala/GestiSoft.git`
2. Entra a la carpeta del proyecto (¡Importante!):
   `cd gestisoft-app`
3. Instala las dependencias de PHP:
   `composer install`
4. Instala las dependencias de Node:
   `npm install`
5. Configura tu entorno:
   * Copia el archivo `.env.example` a `.env`.
   * Actualiza las credenciales de tu base de datos en el archivo `.env`.
6. Genera la llave de la aplicación:
   `php artisan key:generate`
7. Ejecuta las migraciones y seeders (Carga de datos y Tenants de prueba):
   `php artisan migrate --seed`
8. Compila los assets del frontend y levanta el servidor local:
   `npm run dev`
   `php artisan serve`

## Documentación del Proyecto
Toda la documentación de requerimientos, historias de usuario, PBIs y matrices de trazabilidad se encuentra en la carpeta `/product`.