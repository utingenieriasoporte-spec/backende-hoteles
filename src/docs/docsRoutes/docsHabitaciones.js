/**
 * @swagger
 * tags:
 *   - name: Habitaciones
 *     description: Gestión de habitaciones
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoAcomodacion:
 *       type: object
 *       properties:
 *         codigo:
 *           type: string
 *           example: "SENCILLA_AIRE"
 *         detalle:
 *           type: string
 *           example: "Habitación - Cama sencilla con aire"
 *
 *     TarifasVigentes:
 *       type: object
 *       properties:
 *         valorPersona:
 *           type: number
 *           example: 38000
 *         valorMes:
 *           type: number
 *           example: 30000
 *         valorHabitacion:
 *           type: number
 *           example: 37000
 *         valorAdicionalAdulto:
 *           type: number
 *           example: 15000
 *         valorAdicionalMenor:
 *           type: number
 *           example: 10000
 *
 *     Habitacion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         estado:
 *           type: string
 *           example: "ACTIVO"
 *         numeroHabitacion:
 *           type: string
 *           example: "101"
 *         descripcion:
 *           type: string
 *           example: "Habitación con aire"
 *         tipoAcomodacion:
 *           $ref: '#/components/schemas/TipoAcomodacion'
 *         ocupacionMax:
 *           type: integer
 *           example: 1
 *         tarifasVigentes:
 *           $ref: '#/components/schemas/TarifasVigentes'
 *         capacidadInstalada:
 *           type: integer
 *           example: 2
 *         imagenes:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "imagen.jpg"
 */

/**
 * @swagger
 * /habitacion/obtener/:fecha:
 *   get:
 *     summary: Obtiene información completa de las habitaciones
 *     description: Retorna el listado de habitaciones con tipo de acomodación, ocupación máxima, tarifas vigentes, capacidad instalada e imágenes
 *     tags: [Habitaciones]
 *     responses:
 *       200:
 *         description: Lista de habitaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Habitacion'
 */

/**
 * @swagger
 * /habitacion/obtener/{id}:
 *   get:
 *     summary: Obtiene una habitación por ID
 *     tags: [Habitaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Habitación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habitacion'
 *       404:
 *         description: Habitación no encontrada
 */

/**
 * @swagger
 * /habitacion/crear:
 *   post:
 *     summary: Crea una nueva habitación
 *     tags: [Habitaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_acomodacion
 *               - numero_habitacion
 *               - estado
 *             properties:
 *               id_acomodacion:
 *                 type: integer
 *                 example: 1
 *               numero_habitacion:
 *                 type: string
 *                 example: "101"
 *               descripcion:
 *                 type: string
 *                 example: "Habitación con balcón"
 *               piso:
 *                 type: string
 *                 example: "1"
 *               caracteristicas:
 *                 type: string
 *                 example: "['Vista al mar', 'Balcón']"
 *     responses:
 *       201:
 *         description: Habitación creada exitosamente
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /habitacion/actualizar/{id}:
 *   patch:
 *     summary: Actualiza una habitación existente
 *     tags: [Habitaciones]
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
 *             type: object
 *             properties:
 *               id_acomodacion:
 *                 type: integer
 *                 example: 1
 *               numero_habitacion:
 *                 type: string
 *                 example: "101"
 *               descripcion:
 *                 type: string
 *                 example: "Habitación con aire acondicionado"
 *               piso:
 *                 type: string
 *                 example: "1"
 *               caracteristicas:
 *                 type: string
 *                 example: "['Vista al mar', 'Balcón']"
 *     responses:
 *       200:
 *         description: Habitación actualizada
 *       404:
 *         description: Habitación no encontrada
 */

/**
 * @swagger
 * /habitacion/eliminar/{id}:
 *   delete:
 *     summary: Elimina (desactiva) una habitación
 *     tags: [Habitaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Habitación eliminada correctamente
 *       404:
 *         description: Habitación no encontrada
 */

/**
 * @swagger
 * /habitacion/disponibilidad:
 *   get:
 *     summary: Obtiene habitaciones disponibles para una fecha y número de noches
 *     tags: [Habitaciones]
 *     parameters:
 *       - in: query
 *         name: fecha_check_in
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: noches
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de habitaciones disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Habitacion'
 */
