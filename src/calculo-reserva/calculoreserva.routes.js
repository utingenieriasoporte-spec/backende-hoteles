const express = require("express");
const router = express.Router();
const calculoController = require("./calculoreserva.controller");

/**
 * @swagger
 * /reserva/{numSolicitud}/calcular-total:
 *   get:
 *     summary: Calcula el valor total de una reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: numSolicitud
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Total calculado
 */

router.get("/:numSolicitud/calcular-total", calculoController.calcular);

/**
 * @swagger
 * /reserva/pagar-parcial:
 *   post:
 *     summary: Registra un pago parcial de una reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numSolicitud
 *               - valor
 *             properties:
 *               numSolicitud:
 *                 type: string
 *                 example: "0AALE3"
 *               id_solicitud_det:
 *                 type: number
 *                 example: 61
 *               valor:
 *                 type: number
 *                 example: 100000
 *     responses:
 *       200:
 *         description: Pago parcial registrado
 *       400:
 *         description: Error en el pago
 */
router.post("/pagar-parcial", calculoController.pagarParcial);

module.exports = router;
