/**
 * @swagger
 * tags:
 *   - name: Acomodaciones
 *     description: Endpoints relacionados con las acomodaciones
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TarifasVigentesAcomodacion:
 *       type: object
 *       properties:
 *         valorPersona:
 *           type: number
 *           example: 80000
 *         valorMes:
 *           type: number
 *           example: 1800000
 *         valorHabitacion:
 *           type: number
 *           example: 150000
 *         valorAdicionalAdulto:
 *           type: number
 *           example: 40000
 *         valorAdicionalMenor:
 *           type: number
 *           example: 20000
 *
 *     Acomodacion:
 *       type: object
 *       properties:
 *         id_acomodacion:
 *           type: integer
 *           example: 4
 *         ref_tipo_acomodacion:
 *           type: string
 *           example: "DOBLE"
 *         descripcion:
 *           type: string
 *           example: "Habitación doble"
 *         ocupacion_max:
 *           type: integer
 *           example: 2
 *         activo:
 *           type: boolean
 *           example: true
 *         tarifasVigentes:
 *           $ref: '#/components/schemas/TarifasVigentesAcomodacion'
 *         fecha_desde:
 *           type: string
 *           format: date-time
 *           example: "2026-01-01T00:00:00Z"
 *         fecha_hasta:
 *           type: string
 *           format: date-time
 *           example: "2026-01-31T23:59:59Z"
 */

/**
 * @swagger
 * /acomodacion/crear:
 *   post:
 *     summary: Crear una nueva acomodación
 *     tags: [Acomodaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ref_tipo_acomodacion
 *               - ocupacion_max
 *             properties:
 *               ref_tipo_acomodacion:
 *                 type: string
 *                 example: "TIPO1"
 *               descripcion:
 *                 type: string
 *                 example: "Habitación sencilla"
 *               ocupacion_max:
 *                 type: integer
 *                 example: 2
 *               imagenes:
 *                 type: string
 *                 example: "img1.jpg"
 *               capacidad_instalada:
 *                 type: integer
 *                 example: 2
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Acomodación creada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /acomodacion/obtener:
 *   get:
 *     summary: Obtener todas las acomodaciones
 *     description: |
 *       Retorna el listado de acomodaciones con:
 *       - ocupación máxima
 *       - estado activo/inactivo
 *       - tarifas vigentes (persona, mes, habitación y adicionales)
 *     tags:
 *       - Acomodaciones
 *     responses:
 *       200:
 *         description: Lista de acomodaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Acomodacion'
 */

/**
 * @swagger
 * /acomodacion/obtener/{ref_tipo_acomodacion}:
 *   get:
 *     summary: Obtener acomodaciones por tipo
 *     description: Retorna las acomodaciones filtradas por tipo de acomodación
 *     tags:
 *       - Acomodaciones
 *     parameters:
 *       - in: path
 *         name: ref_tipo_acomodacion
 *         required: true
 *         schema:
 *           type: string
 *           example: "DOBLE"
 *     responses:
 *       200:
 *         description: Acomodaciones filtradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Acomodacion'
 */

/**
 * @swagger
 * /acomodacion/actualizar/{id}:
 *   patch:
 *     summary: Actualizar parcialmente una acomodación
 *     tags: [Acomodaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Habitación remodelada"
 *               ocupacion_max:
 *                 type: integer
 *                 example: 3
 *               activo:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Acomodación actualizada
 *       404:
 *         description: No encontrada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /acomodacion/eliminar/{id}:
 *   delete:
 *     summary: Eliminar una acomodación
 *     tags: [Acomodaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 4
 *     responses:
 *       200:
 *         description: Acomodación eliminada
 *       404:
 *         description: No encontrada
 *       500:
 *         description: Error del servidor
 */
