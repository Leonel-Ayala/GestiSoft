# GestiSoft - SaaS POS & Inventory Management

GestiSoft es una plataforma SaaS (Software as a Service) multi-inquilino diseñada para agilizar la operación comercial de pymes de retail. Su objetivo principal es centralizar la gestión de inventario y acelerar el proceso de ventas en el mostrador mediante una interfaz optimizada.

## Características del MVP (Semana 4)

*   **Aislamiento Multi-Tenant:** Arquitectura segura (Single-Database) que garantiza que los datos y productos de cada pyme estén estrictamente aislados.
*   **Gestión de Inventario (Catálogo):** CRUD para el registro de SKUs, precios y control de stock inicial.
*   **Punto de Venta (POS) Ágil:** Interfaz reactiva diseñada para operar 100% mediante atajos de teclado, validando el stock en tiempo real para evitar sobreventas.

## Pila Tecnológica (Tech Stack)

*   **Backend:** Laravel (PHP)
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
   \`git clone https://github.com/Leonel-Ayala/GestiSoft.git\`
2. Instala las dependencias de PHP:
   \`composer install\`
3. Instala las dependencias de Node:
   \`npm install\`
4. Configura tu entorno:
   * Copia el archivo \`.env.example\` a \`.env\`.
   * Actualiza las credenciales de tu base de datos en el archivo \`.env\`.
5. Genera la llave de la aplicación:
   \`php artisan key:generate\`
6. Ejecuta las migraciones y seeders (Carga de datos y Tenants de prueba):
   \`php artisan migrate --seed\`
7. Compila los assets del frontend y levanta el servidor local:
   \`npm run dev\`
   \`php artisan serve\`

## Documentación del Proyecto
Toda la documentación de requerimientos, historias de usuario, PBIs y matrices de trazabilidad se encuentra en la carpeta \`/product\`.