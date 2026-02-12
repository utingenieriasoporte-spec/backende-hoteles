/**
 * @swagger
 * tags:
 *   - name: Bodegas
 *     description: Gestión de bodegas e inventario por bodega
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Bodega:
 *       type: object
 *       properties:
 *         idBodega:
 *           type: integer
 *           example: 1
 *         detalle:
 *           type: string
 *           example: Bodega Principal
 *         tipo:
 *           type: string
 *           example: ALMACEN
 *         estado:
 *           type: integer
 *           example: 1
 *
 *     CrearBodega:
 *       type: object
 *       required:
 *         - detalle
 *         - tipo
 *       properties:
 *         detalle:
 *           type: string
 *           example: Bodega Cocina
 *         tipo:
 *           type: string
 *           example: COCINA
 *         estado:
 *           type: integer
 *           example: 1
 *
 *     ItemPorBodega:
 *       type: object
 *       properties:
 *         idBodega:
 *           type: integer
 *           example: 1
 *         bodega:
 *           type: string
 *           example: Bodega Principal
 *         idItemInventario:
 *           type: integer
 *           example: 10
 *         detalle:
 *           type: string
 *           example: Arroz
 *         unidadPresentacion:
 *           type: string
 *           example: KG
 *         categoria:
 *           type: string
 *           example: ALIMENTOS
 *         valorUnitario:
 *           type: number
 *           example: 2500
 *         existencias:
 *           type: integer
 *           example: 50
 */

/**
 * @swagger
 * /bodegas:
 *   get:
 *     summary: Listar todas las bodegas
 *     tags: [Bodegas]
 *     responses:
 *       200:
 *         description: Lista de bodegas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bodega'
 */

/**
 * @swagger
 * /bodegas:
 *   post:
 *     summary: Crear una nueva bodega
 *     tags: [Bodegas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearBodega'
 *     responses:
 *       201:
 *         description: Bodega creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bodega creada
 *                 id:
 *                   type: integer
 *                   example: 5
 */

/**
 * @swagger
 * /bodegas/{id}/items:
 *   get:
 *     summary: Listar items de inventario por bodega
 *     tags: [Bodegas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la bodega
 *     responses:
 *       200:
 *         description: Lista de items por bodega
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemPorBodega'
 */
