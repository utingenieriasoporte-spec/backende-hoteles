const express = require("express");
const router = express.Router();
const checkinController = require("./checkin.controller");

/**
 * @swagger
 * /check-in/crear:
 *   post:
 *     summary: Realiza el check-in de una reserva
 *     tags: [Check-In]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_asignacion_habitacion
 *               - id_habitacion
 *               - num_solicitud
 *               - huespedes
 *             properties:
 *               id_asignacion_habitacion:
 *                 type: integer
 *                 example: 10
 *               id_habitacion:
 *                 type: integer
 *                 example: 5
 *               num_solicitud:
 *                 type: string
 *                 example: "RES-2026-001"
 *               auto_checkin:
 *                 type: boolean
 *                 example: false
 *               hora_checkin:
 *                 type: string
 *                 example: "14:00"
 *               huespedes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     doc_identificacion:
 *                       type: string
 *                       example: "12345678"
 *                     tipo_identificacion:
 *                       type: string
 *                       example: "CC"
 *                     nombre_completo:
 *                       type: string
 *                       example: "Juan Pérez"
 *                     fecha_nacimiento:
 *                       type: string
 *                       example: "1990-05-10"
 *                     ref_genero:
 *                       type: string
 *                       example: "GENERO_MASCULINO"
 *                     titular:
 *                       type: boolean
 *                       example: true
 *                     observacion:
 *                       type: string
 *                       example: "Ninguna"
 *     responses:
 *       201:
 *         description: Check-in realizado correctamente
 *       500:
 *         description: Error interno
 */
router.post("/crear", checkinController.crearCheckIn);

module.exports = router;
