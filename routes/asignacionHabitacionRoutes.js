const express = require("express");
const router = express.Router();
const asignacionController = require("../controller/asignacionHabitacionController");

/**
 * @swagger
 * /habitacion/asignar:
 *   post:
 *     summary: Asignar una habitación a una solicitud de alojamiento
 *     description: |
 *       Asigna una habitación disponible a una reserva.
 *       Esta operación:
 *       - Valida que la solicitud exista
 *       - Verifica que la habitación esté disponible
 *       - Crea la asignación de habitación
 *       - Crea automáticamente el registro de check-in en estado EN_PROCESO
 *       - Cambia el estado de la habitación a OCUPADA
 *     tags:
 *       - Habitaciones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numSolicitud
 *               - idHabitacion
 *             properties:
 *               numSolicitud:
 *                 type: string
 *                 description: Número de la solicitud de alojamiento
 *                 example: "RES-2025-001"
 *               idHabitacion:
 *                 type: integer
 *                 description: ID de la habitación a asignar
 *                 example: 12
 *     responses:
 *       201:
 *         description: Habitación asignada y check-in creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Habitación asignada correctamente
 *       400:
 *         description: Error de validación o lógica de negocio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: La habitación no está disponible
 *       500:
 *         description: Error interno del servidor
 */
router.post("/asignar", asignacionController.asignar);

/**
 * @swagger
 * /habitacion/cambiar:
 *   post:
 *     summary: Cambiar habitación de una reserva
 *     description: |
 *       Realiza un cambio de habitación:
 *       - Desactiva la asignación actual
 *       - Crea una nueva asignación activa
 *       - Guarda fecha y hora reales de la asignación
 *     tags:
 *       - Habitaciones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numSolicitud
 *               - idHabitacionNueva
 *             properties:
 *               numSolicitud:
 *                 type: string
 *                 example: "RES-2025-001"
 *               idHabitacionNueva:
 *                 type: integer
 *                 example: 15
 *               fechaAsignacion:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-01-22T14:35:00"
 *     responses:
 *       200:
 *         description: Cambio realizado correctamente
 *       400:
 *         description: Error de negocio
 */
router.post("/cambiar", asignacionController.cambiar);

module.exports = router;
