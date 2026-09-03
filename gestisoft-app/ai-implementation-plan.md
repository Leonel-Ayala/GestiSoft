# Plan de Implementación de IA - Proyecto: GestiSoft

## 1. Contexto del Proyecto
GestiSoft es un sistema SaaS (Software as a Service) multi-inquilino (*multi-tenant*) enfocado en el sector comercial/retail. Su objetivo es la gestión de inventario y un Punto de Venta (POS) ultrarrápido, operable 100% por teclado.
**Restricción de Negocio:** Este sistema es estrictamente para retail. No incluir lógicas de mesas, comandas o restaurantes.

## 2. Stack Tecnológico
*   **Backend:** Laravel 11 (PHP).
*   **Frontend:** React.js + Inertia.js.
*   **Estilos:** Tailwind CSS.
*   **Base de Datos:** MySQL
*   **Autenticación:** Laravel Breeze.

## 3. Estado Actual
El proyecto base ha sido inicializado. Laravel Breeze (React) está instalado y configurado. La base de datos está en SQLite. No hay lógicas de negocio implementadas aún.

## 4. Fases de Desarrollo (MVP Semana 4)

El desarrollo debe seguir **estrictamente** este orden. No avanzar a la siguiente fase sin completar la anterior.

### Fase 1: Arquitectura Multi-Tenant (SPIKE-01)
**Objetivo:** Implementar *Single-Database Multi-Tenant* mediante Global Scopes en Laravel para asegurar que ninguna pyme vea los datos de otra.
**Instrucciones para la IA:**
1.  Crear modelo y migración `Negocio` (campos: `id`, `name`).
2.  Modificar la tabla `users` agregando `negocio_id` (foreign key, nullable por ahora, restringido después).
3.  Implementar un *Trait* llamado `HasNegocio` que aplique un `GlobalScope` para filtrar automáticamente las consultas (`builder->where('negocio_id', auth()->user()->negocio_id)`).
4.  Modificar el flujo de registro (Breeze) para que al crear un nuevo usuario, se cree un `Negocio` automáticamente y se le asigne al usuario.
5.  **Aceptación:** El código debe prevenir (error 403 o no retornar datos) que el Usuario A consulte información del Negocio B.

### Fase 2: Módulo de Inventario (PBI-01)
**Objetivo:** CRUD básico de productos protegido por el scope del Tenant.
**Instrucciones para la IA:**
1.  Crear modelo, migración y controlador para `Product`.
2.  Campos obligatorios en BD: `id`, `negocio_id` (foreign key), `sku` (string, unique per negocio), `name` (string), `price` (integer), `stock` (integer). Aplicar trait `HasNegocio`.
3.  Crear endpoints de API internos (rutas protegidas por auth).
4.  Crear vista en React/Inertia (`Pages/Inventory/Index.jsx` y `Pages/Inventory/Create.jsx`) con un formulario simple con Tailwind.
5.  **Aceptación:** Un producto guardado debe insertarse con el `negocio_id` del usuario autenticado. No permitir guardar stock negativo.

### Fase 3: Punto de Venta / POS (PBI-02)
**Objetivo:** Interfaz de venta ágil, reactiva y operable por teclado.
**Instrucciones para la IA:**
1.  Crear vista en React/Inertia (`Pages/POS/Index.jsx`).
2.  La UI debe consistir en un `input` con `autofocus` para leer SKUs y una tabla que actúe como carro de compras.
3.  **Lógica Reactiva Front:** Al teclear un SKU y presionar `Enter`, buscar el producto. Si existe, sumarlo al carro. Si se ingresa un SKU que ya está en el carro, incrementar cantidad (`+1`) sin recargar la página. Mostrar total.
4.  **Lógica Back:** Endpoint para procesar la venta. Debe recibir un array de items. 
5.  **Restricción Crítica de Negocio:** El backend y el frontend deben validar el stock. Si un producto tiene stock 0, bloquear adición al carro (Devolver HTTP 422). Al confirmar venta, descontar stock en BD.

## 5. Reglas de Generación de Código
*   **Idioma:** Comentarios e interfaces de usuario en Español. Nombres de variables, modelos, tablas y controladores en Inglés.
*   **Inertia.js:** Usar los helpers de Inertia (`useForm`, `router`) para las peticiones de formularios y navegación. No usar `fetch` o `axios` crudo a menos que sea una petición silenciosa en el POS.
*   **Estilos:** Usar clases utilitarias de Tailwind CSS. Mantener una interfaz limpia y minimalista.
*   **Atomicidad:** Al pedirte código, entrega las migraciones, luego los modelos, luego los controladores y finalmente las vistas en pasos lógicos y manejables, no todo en un solo bloque gigante.