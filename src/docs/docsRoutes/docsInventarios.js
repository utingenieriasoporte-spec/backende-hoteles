/**
 * @swagger
 * tags:
 *   - name: Inventario
 *     description: Gestión de items de inventario y movimientos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ItemInventario:
 *       type: object
 *       properties:
 *         idItemInventario:
 *           type: integer
 *           example: 1
 *         detalle:
 *           type: string
 *           example: Arroz
 *         unidadPresentacion:
 *           type: string
 *           example: KG
 *         categoria:
 *           type: string
 *           example: ALIMENTOS
 *         existencias:
 *           type: integer
 *           example: 120
 *         valorUnitario:
 *           type: number
 *           example: 2500
 *
 *     CrearItemInventario:
 *       type: object
 *       required:
 *         - detalle
 *         - unidadPresentacion
 *         - categoria
 *         - valorUnitario
 *       properties:
 *         detalle:
 *           type: string
 *           example: Aceite
 *         unidadPresentacion:
 *           type: string
 *           example: LT
 *         categoria:
 *           type: string
 *           example: ALIMENTOS
 *         valorUnitario:
 *           type: number
 *           example: 12000
 *
 *     InventarioPorBodega:
 *       type: object
 *       properties:
 *         idItemInventario:
 *           type: integer
 *           example: 5
 *         detalle:
 *           type: string
 *           example: Azúcar
 *         existencias:
 *           type: integer
 *           example: 30
 *
 *     MovimientoInventario:
 *       type: object
 *       required:
 *         - numeroReferencia
 *         - idItemInventario
 *         - idBodega
 *         - cantidad
 *         - valorItem
 *         - personaResponsable
 *       properties:
 *         numeroReferencia:
 *           type: string
 *           example: ENT-001
 *         idItemInventario:
 *           type: integer
 *           example: 3
 *         idBodega:
 *           type: integer
 *           example: 1
 *         idBodegaDestino:
 *           type: integer
 *           example: 2
 *         cantidad:
 *           type: integer
 *           example: 10
 *         valorItem:
 *           type: number
 *           example: 2500
 *         personaResponsable:
 *           type: string
 *           example: Juan Pérez
 *
 *     EntradaInventario:
 *       allOf:
 *         - $ref: '#/components/schemas/MovimientoInventario'
 *
 *     SalidaInventario:
 *       allOf:
 *         - $ref: '#/components/schemas/MovimientoInventario'
 */

/**
 * @swagger
 * /inventario/items-inventario:
 *   get:
 *     summary: Listar todos los items de inventario
 *     tags: [Inventario]
 *     responses:
 *       200:
 *         description: Lista de items de inventario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemInventario'
 */

/**
 * @swagger
 * /inventario/item-inventario/{id}:
 *   get:
 *     summary: Obtener un item de inventario por ID
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemInventario'
 *       404:
 *         description: Item de inventario no encontrado
 */

/**
 * @swagger
 * /inventario/item-inventario:
 *   post:
 *     summary: Crear un nuevo item de inventario
 *     tags: [Inventario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearItemInventario'
 *     responses:
 *       201:
 *         description: Item de inventario creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item de inventario creado
 *                 id:
 *                   type: integer
 *                   example: 10
 */

/**
 * @swagger
 * /inventario/item-inventario/{id}:
 *   put:
 *     summary: Actualizar un item de inventario
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearItemInventario'
 *     responses:
 *       200:
 *         description: Item de inventario actualizado
 */

/**
 * @swagger
 * /inventario/entradas:
 *   post:
 *     summary: Registrar una entrada de inventario
 *     tags: [Inventario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntradaInventario'
 *     responses:
 *       201:
 *         description: Entrada registrada correctamente
 */

/**
 * @swagger
 * /inventario/salidas:
 *   post:
 *     summary: Registrar una salida de inventario
 *     tags: [Inventario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalidaInventario'
 *     responses:
 *       201:
 *         description: Salida registrada correctamente
 *       400:
 *         description: Stock insuficiente para realizar la salida
 */

/**
 * @swagger
 * /inventario/bodegas/{id}:
 *   get:
 *     summary: Obtener inventario por bodega
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inventario de la bodega
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventarioPorBodega'
 */

/**
 * @swagger
 * /inventario/entradas/bodega/{idBodega}:
 *   get:
 *     summary: Obtener entradas de inventario por bodega
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: idBodega
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de entradas por bodega
 */

/**
 * @swagger
 * /inventario/salidas/bodega/{idBodega}:
 *   get:
 *     summary: Obtener salidas de inventario por bodega
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: idBodega
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de salidas por bodega
 */
