/**
 * @swagger
 * tags:
 *   - name: Tarifas
 *     description: Gestión de tarifas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AcomodacionVigente:
 *       type: object
 *       properties:
 *         idAcomodacion:
 *           type: number
 *         tipoAcomodacion:
 *           type: string
 *         descripcion:
 *           type: string
 *
 *     ValoresVigentes:
 *       type: object
 *       properties:
 *         valor:
 *           type: number
 *         valorMes:
 *           type: number
 *         valorHabitacion:
 *           type: number
 *         valorAdicionalAdulto:
 *           type: number
 *         valorAdicionalMenor:
 *           type: number
 *
 *     TarifaResponse:
 *       type: object
 *       properties:
 *         idTarifa:
 *           type: number
 *         acomodacionVigente:
 *           $ref: '#/components/schemas/AcomodacionVigente'
 *         fechaDesde:
 *           type: string
 *           format: date
 *         fechaHasta:
 *           type: string
 *           format: date
 *         modificadorTarifa:
 *           type: string
 *         valoresVigentes:
 *           $ref: '#/components/schemas/ValoresVigentes'
 *
 *     TarifaCreateRequest:
 *       type: object
 *       required:
 *         - id_acomodacion
 *         - fecha_desde
 *         - fecha_hasta
 *       properties:
 *         id_acomodacion:
 *           type: number
 *         fecha_desde:
 *           type: string
 *           format: date
 *         fecha_hasta:
 *           type: string
 *           format: date
 *         valor:
 *           type: number
 *         valor_mes:
 *           type: number
 *         valor_habitacion:
 *           type: number
 *         valor_adicional_adulto:
 *           type: number
 *         valor_adicional_menor:
 *           type: number
 */

/**
 * @swagger
 * /tarifa/obtener:
 *   get:
 *     summary: Lista todas las tarifas
 *     tags: [Tarifas]
 *     responses:
 *       200:
 *         description: Lista de tarifas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TarifaResponse'
 */

/**
 * @swagger
 * /tarifa/obtener/{id}:
 *   get:
 *     summary: Obtiene una tarifa por ID
 *     tags: [Tarifas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Tarifa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TarifaResponse'
 *       404:
 *         description: Tarifa no encontrada
 */

/**
 * @swagger
 * /tarifa/crear:
 *   post:
 *     summary: Crea una tarifa
 *     tags: [Tarifas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TarifaCreateRequest'
 *     responses:
 *       201:
 *         description: Tarifa creada
 */

/**
 * @swagger
 * /tarifa/actualizar/{id}:
 *   patch:
 *     summary: Actualiza una tarifa
 *     tags: [Tarifas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TarifaCreateRequest'
 *     responses:
 *       200:
 *         description: Tarifa actualizada
 *       404:
 *         description: Tarifa no encontrada
 */

/**
 * @swagger
 * /tarifa/eliminar/{id}:
 *   delete:
 *     summary: Desactiva una tarifa (soft delete)
 *     tags: [Tarifas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Tarifa desactivada correctamente
 *       404:
 *         description: Tarifa no encontrada
 */
