/**
 * @swagger
 * tags:
 *   name: PedidosHabitacion
 *   description: Gestión de pedidos de habitación y consumo de inventario
 */

/**
 * @swagger
 * /pedidos-habitacion:
 *   post:
 *     summary: Crear un pedido de habitación
 *     tags: [PedidosHabitacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idAsignacion
 *               - items
 *               - operador
 *             properties:
 *               idAsignacion:
 *                 type: integer
 *                 example: 12
 *               observaciones:
 *                 type: string
 *                 example: Pedido nocturno
 *               operador:
 *                 type: string
 *                 example: ADMIN
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - idItemInventario
 *                     - cantidad
 *                   properties:
 *                     idItemInventario:
 *                       type: integer
 *                       example: 5
 *                     cantidad:
 *                       type: number
 *                       example: 2
 *     responses:
 *       201:
 *         description: Pedido creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id_pedido:
 *                   type: integer
 *       500:
 *         description: Error al crear el pedido
 */

/**
 * @swagger
 * /pedidos-habitacion:
 *   get:
 *     summary: Listar todos los pedidos de habitación
 *     tags: [PedidosHabitacion]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idPedido:
 *                     type: integer
 *                   fechaPedido:
 *                     type: string
 *                     format: date-time
 *                   estado:
 *                     type: string
 *                     example: REGISTRADO
 *                   observacion:
 *                     type: string
 *                   operador:
 *                     type: string
 *                   infoHabitacion:
 *                     type: object
 *                     properties:
 *                       idAsignacion:
 *                         type: integer
 *                       idHabitacion:
 *                         type: integer
 *                       numeroHabitacion:
 *                         type: string
 *                       piso:
 *                         type: integer
 *                       numSolicitud:
 *                         type: integer
 *                   infoPersona:
 *                     type: object
 *                     properties:
 *                       idTitular:
 *                         type: integer
 *                       razonSocial:
 *                         type: string
 *                       email:
 *                         type: string
 *                       telefono:
 *                         type: string
 *       404:
 *         description: No existen pedidos
 */

/**
 * @swagger
 * /pedidos-habitacion/{id}:
 *   get:
 *     summary: Obtener un pedido por ID con su detalle
 *     tags: [PedidosHabitacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_pedido:
 *                   type: integer
 *                 id_asignacion:
 *                   type: integer
 *                 fecha_pedido:
 *                   type: string
 *                 estado:
 *                   type: string
 *                 observacion:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_pedido_det:
 *                         type: integer
 *                       id_item_inventario:
 *                         type: integer
 *                       item:
 *                         type: string
 *                       ref_unidad_presentacion:
 *                         type: string
 *                       cantidad:
 *                         type: number
 *                       valor_unitario:
 *                         type: number
 *       404:
 *         description: Pedido no encontrado
 */

/**
 * @swagger
 * /pedidos-habitacion/asignacion/{idAsignacion}:
 *   get:
 *     summary: Listar pedidos por asignación
 *     tags: [PedidosHabitacion]
 *     parameters:
 *       - in: path
 *         name: idAsignacion
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *       500:
 *         description: Error interno
 */

/**
 * @swagger
 * /pedidos-habitacion/historial/{idAsignacion}:
 *   get:
 *     summary: Obtener historial completo de pedidos por asignación
 *     tags: [PedidosHabitacion]
 *     parameters:
 *       - in: path
 *         name: idAsignacion
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historial de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idPedido:
 *                     type: integer
 *                   idAsignacion:
 *                     type: integer
 *                   fechaPedido:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   observacion:
 *                     type: string
 *                   totalPedido:
 *                     type: number
 *       404:
 *         description: No existen pedidos para la asignación indicada
 */

/**
 * @swagger
 * /pedidos-habitacion/{idPedido}/procesar:
 *   put:
 *     summary: Marcar un pedido como PROCESADO
 *     tags: [PedidosHabitacion]
 *     parameters:
 *       - in: path
 *         name: idPedido
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido procesado correctamente
 *       404:
 *         description: Pedido no encontrado
 */
