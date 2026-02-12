/**
 * @swagger
 * tags:
 *   - name: CheckOuts
 *     description: Gestión de check-outs
 */

/**
 * @swagger
 * /checkout/crear:
 *   post:
 *     summary: Crea un check-out
 *     tags: [CheckOuts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_asignacion_habitacion
 *               - procesado_por
 *             properties:
 *               id_asignacion_habitacion:
 *                 type: integer
 *                 example: 12
 *               procesado_por:
 *                 type: string
 *                 example: "admin01"
 *     responses:
 *       201:
 *         description: Check-out creado correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       400:
 *         description: La asignación no está pagada
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
