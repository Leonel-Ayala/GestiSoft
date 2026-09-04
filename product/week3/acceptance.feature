Feature: Criterios de Aceptación y Casos Límite GestiSoft
  Como equipo de desarrollo
  Queremos establecer los criterios de aceptación precisos
  Para verificar que cada PBI cumple con su hipótesis de valor y previene fallas en escenarios críticos.

  # ==========================================
  # SPIKE-01: Arquitectura Multi-Tenant
  # ==========================================
  @Security @EdgeCase
  Scenario: AC-SEC-01 - Intento de acceso a datos de otra PYME (Seguridad Multi-Tenant)
    Given el usuario autenticado pertenece a la PYME 'A'
    When el usuario intenta acceder por URL o API a un recurso (ej. producto) que pertenece a la PYME 'B'
    Then el sistema debe filtrar la petición por negocio_id y devolver un error 403 (Prohibido) o 404 (No Encontrado)

  # ==========================================
  # PBI-01: Gestión de Inventario
  # ==========================================
  @HappyPath
  Scenario: AC-06 - Creación exitosa de producto base (RF-08)
    Given el administrador está dentro del módulo de existencias
    When realiza el alta de un nuevo producto indicando 10 unidades de stock inicial
    Then el registro debe ser visible en el catálogo con su disponibilidad confirmada

  @Alternative
  Scenario: AC-07 - Ajuste manual de stock por deterioro (RF-09)
    Given el producto tiene una disponibilidad previa de 5 unidades registradas
    When el administrador realiza un ajuste manual de -2 unidades justificando "deterioro"
    Then el stock residual del producto debe actualizarse instantáneamente a 3 unidades (Regla R-02)

  # ==========================================
  # PBI-02: Módulo POS (Venta Ágil)
  # ==========================================
  @HappyPath
  Scenario: AC-03 - Ingreso rápido de producto al carro (RF-01)
    Given la interfaz de despacho veloz (POS) se encuentra habilitada con foco en el input
    When el cajero ingresa un código SKU legítimo seguido de Enter
    Then el artículo se incorpora a la venta activa y los montos globales se refrescan sin recargar la página

  @Alternative
  Scenario: AC-04 - Incremento de cantidad de un producto ya existente en el carro (RF-02)
    Given un ítem ya consta en el listado de compra de la venta activa
    When el cajero reingresa manualmente el mismo identificador SKU
    Then el sistema debe sumar +1 a la cantidad en la fila previa del producto en lugar de crear una nueva fila

  @Exception @EdgeCase
  Scenario: AC-05 - Prevención de venta de producto sin stock (RF-03)
    Given el stock de un artículo figura como agotado (0 unidades) en el sistema
    When el cajero intenta incluirlo en la venta mediante su SKU
    Then el sistema debe mostrar un aviso visual de falta de unidades
    And bloquear la carga del producto al carro para evitar inventario negativo (Regla R-02)

  # ==========================================
  # PBI-03: Módulo Caja
  # ==========================================
  @HappyPath
  Scenario: AC-01 - Cierre de turno exitoso (RF-06)
    Given existe un balance de $100.000 acumulado
    And no hay operaciones de cobro pendientes
    When el usuario ejecuta la acción de finalización de jornada
    Then se confirma el cierre de turno exhibiendo el total de ingresos esperados

  @Exception @EdgeCase
  Scenario: AC-02 - Prevención de cierre con transacciones huérfanas (RF-07)
    Given existe un proceso de cobro (venta) activo actualmente
    When el usuario intenta clausurar el turno vigente
    Then el sistema debe bloquear la acción y notificar una advertencia operativa para evitar descuadres (Regla R-01)

  # ==========================================
  # PBI-04: Gestión de Usuarios
  # ==========================================
  @HappyPath
  Scenario: AC-08 - Creación de empleado con rol restringido (RF-10)
    Given el administrador se encuentra en la Gestión de Usuarios
    When registra a un nuevo empleado asignándole el rol "Cajero"
    Then se crea el usuario vinculado automáticamente al mismo negocio_id de la PYME

  @Security @EdgeCase
  Scenario: AC-09 - Protección de rutas no autorizadas (RF-11)
    Given un usuario con el rol de "Cajero" ha iniciado sesión
    When hace clic o intenta navegar a las rutas del menú "Inventario" o "Reportes"
    Then el sistema debe devolver un error de "Acceso Denegado"

  # ==========================================
  # PBI-05: Dashboard Estadístico
  # ==========================================
  @HappyPath
  Scenario: AC-10 - Visualización de productos top (RF-13)
    Given el sistema cuenta con un historial de ventas registradas en el mes
    When el administrador accede al módulo de Reportes
    Then se debe mostrar un gráfico con el "Top 5" de los productos más vendidos

  @Alternative @EdgeCase
  Scenario: AC-11 - Manejo de estado vacío o sin datos (RF-13)
    Given el sistema es nuevo y aún no registra ventas confirmadas
    When el administrador accede al módulo de Reportes
    Then el sistema debe ocultar el gráfico
    And mostrar el mensaje de estado "No hay datos suficientes" para prevenir interpretaciones erróneas
