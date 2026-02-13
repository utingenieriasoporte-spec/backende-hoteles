const express = require("express");
const router = express.Router();
const recaudoController = require("./recaudo.controller");

/**
 * @swagger
 * /recaudo/factura:
 *   post:
 *     summary: Genera una factura a partir de cargos
 *     tags: [Factura]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cargos
 *             properties:
 *               cargos:
 *                 type: array
 *                 description: Lista de cargos a facturar
 *                 items:
 *                   type: object
 *                   required:
 *                     - id_cargo
 *                     - total
 *                   properties:
 *                     id_cargo:
 *                       type: integer
 *                       example: 70
 *                     total:
 *                       type: number
 *                       example: 76000
 *     responses:
 *       201:
 *         description: Factura creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 numFactura:
 *                   type: string
 *                 totalFactura:
 *                   type: number
 *       400:
 *         description: Error de validación
 */

router.post("/factura", recaudoController.crearFactura);

/**
 * @swagger
 * /recaudo/crear:
 *   post:
 *     summary: Registra un recaudo (pago) asociado a una factura
 *     tags: [Recaudo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numFactura
 *               - idClienteDet
 *               - nombreCliente
 *               - correo
 *               - telefono
 *               - total
 *               - metodo_pago
 *               - ref_operador
 *               - metodo_pago
 *             properties:
 *               numFactura:
 *                 type: string
 *                 example: "FAC-1700000000000"
 *               idClienteDet:
 *                 type: integer
 *               nombreCliente:
 *                 type: string
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               total:
 *                 type: number
 *               concepto:
 *                 type: string
 *               ref1:
 *                 type: string
 *               ref2:
 *                 type: string
 *               respCus:
 *                 type: string
 *               respBanco:
 *                 type: string
 *               ref_operador:
 *                 type: string
 *               metodo_pago:
 *                 type: string
 *                 example: "EFECTIVO/NEQUI/BANCO"
 *     responses:
 *       201:
 *         description: Recaudo registrado
 *       400:
 *         description: Error de validación
 */
router.post("/crear", recaudoController.crearRecaudo);

/**
 * @swagger
 * /recaudo/obtener:
 *   get:
 *     summary: Listar todos los recaudos registrados
 *     tags: [Recaudo]
 *     responses:
 *       200:
 *         description: Lista de recaudos
 */
router.get("/obtener", recaudoController.obtener);

/**
 * @swagger
 * /recaudo/factura:
 *   get:
 *     summary: Listar todas las facturas con sus saldos
 *     tags: [Factura]
 *     responses:
 *       200:
 *         description: Lista de facturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   num_factura:
 *                     type: string
 *                   fecha_emision:
 *                     type: string
 *                     format: date-time
 *                   total_factura:
 *                     type: number
 *                   estado_pago:
 *                     type: string
 *                   totales:
 *                     type: object
 *                     properties:
 *                       total_cargos:
 *                         type: number
 *                       total_abonado:
 *                         type: number
 *                       saldo_pendiente:
 *                         type: number
 */

router.get("/factura", recaudoController.getFacturas);

/**
 * @swagger
 * /recaudo/crear:
 *   post:
 *     summary: Registra un pago total o parcial de una factura
 *     tags: [Recaudo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numFactura
 *               - idClienteDet
 *               - nombreCliente
 *               - correo
 *               - telefono
 *               - valor
 *               - ref_operador
 *               - cargos
 *             properties:
 *               numFactura:
 *                 type: string
 *                 example: FAC-1769838365452
 *               idClienteDet:
 *                 type: integer
 *                 example: 5
 *               nombreCliente:
 *                 type: string
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               valor:
 *                 type: number
 *                 example: 76000
 *               concepto:
 *                 type: string
 *               ref1:
 *                 type: string
 *               ref2:
 *                 type: string
 *               respCus:
 *                 type: string
 *               respBanco:
 *                 type: string
 *               ref_operador:
 *                 type: string
 *               cargos:
 *                 type: array
 *                 description: |
 *                   - Vacío: pago total
 *                   - Con elementos: pago parcial
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_cargo:
 *                       type: integer
 *                       example: 70
 *                     monto:
 *                       type: number
 *                       example: 76000
 *     responses:
 *       201:
 *         description: Recaudo registrado correctamente
 *       400:
 *         description: Error de validación
 */

router.get("/factura/:numFactura", recaudoController.getFacturaPorNumero);

/**
 * @swagger
 * /recaudos/factura/{numFactura}/cargos:
 *   get:
 *     summary: Obtener cargos asociados a una factura
 *     tags:
 *       - Recaudos
 *     parameters:
 *       - in: path
 *         name: numFactura
 *         required: true
 *         schema:
 *           type: string
 *         example: FAC-1769887593949
 *     responses:
 *       200:
 *         description: Lista de cargos de la factura
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     num_factura:
 *                       type: string
 *                     total_cargos:
 *                       type: number
 *                     cargos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id_cargo:
 *                             type: number
 *                           ref_concepto:
 *                             type: string
 *                           total:
 *                             type: number
 *                           monto_abonado:
 *                             type: number
 *                           saldo_pendiente:
 *                             type: number
 *                           estado:
 *                             type: string
 *       404:
 *         description: No se encontraron cargos
 */
router.get(
  "/factura/:numFactura/cargos",
  recaudoController.obtenerCargosPorFactura,
);

module.exports = router;
