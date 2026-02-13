/**
 * /cierre-diario:
 *   post:
 *     summary: Registrar cierre diario
 *     tags: [Cierre Diario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idOperador
 *               - fechaCierre
 *               - horaCierre
 *               - totalMovimientos
 *               - cantidadTransacciones
 *     responses:
 *       201:
 *         description: Cierre registrado
 *
 *   get:
 *     summary: Obtener cierres diarios
 *     tags: [Cierre Diario]
 *     parameters:
 *       - in: query
 *         name: idOperador
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fechaCierre
 *         schema:
 *           type: string
 */
