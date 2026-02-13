const express = require("express");
const router = express.Router();
const HabitacionesController = require("./habitacion.controller");
/**
 * @swagger
 * tags:
 *   name: Habitaciones
 *   description: Gestión de habitaciones y disponibilidad
 */

router.get("/obtener/:fecha", HabitacionesController.getAll);

router.post("/crear", HabitacionesController.postHabitacion);

/**
 * @swagger
 * /habitacion/disponibilidad:
 *   get:
 *     summary: Consulta la disponibilidad de habitaciones por fecha y noches
 *     tags: [Habitaciones]
 *     parameters:
 *       - in: query
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-02-01"
 *       - in: query
 *         name: noches
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: Habitaciones disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idHabitacion:
 *                     type: integer
 *                     example: 5
 *                   numeroHabitacion:
 *                     type: string
 *                     example: "204"
 *                   descripcion:
 *                     type: string
 *                     example: "Habitación sencilla"
 *                   piso:
 *                     type: integer
 *                     example: 2
 *                   caracteristicas:
 *                     type: string
 *                     example: "TV, Wifi"
 *                   tipoAcomodacion:
 *                     type: string
 *                     example: "SENCILLA"
 *                   nochesLibres:
 *                     type: integer
 *                     example: 3
 *                   nochesOcupadas:
 *                     type: integer
 *                     example: 0
 *                   fechasDisponibles:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: date
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error al consultar disponibilidad
 */

router.get("/disponibilidad", HabitacionesController.getDisponibilidad);

/**
 * @swagger
 * /habitacion/{id}:
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
 *       404:
 *         description: No encontrada
 */
router.get("/:id", HabitacionesController.getHabitacion);

/**
 * @swagger
 * /habitacion/{id}:
 *   put:
 *     summary: Actualiza una habitación
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
 *     responses:
 *       200:
 *         description: Habitación actualizada
 */
router.put("/:id", HabitacionesController.putHabitacion);

/**
 * @swagger
 * /habitacion/{id}:
 *   delete:
 *     summary: Desactiva una habitación
 *     tags: [Habitaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Habitación desactivada
 */
router.delete("/:id", HabitacionesController.deleteHabitacion);

module.exports = router;
