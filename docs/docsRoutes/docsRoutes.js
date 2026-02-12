/**
 * @swagger
 * tags:
 *   - name: Recaudos
 *     description: Pagos, facturación y confirmación de reservas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ClienteRecaudo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 5
 *         nombre:
 *           type: string
 *           example: "Juan Pérez"
 *         correo:
 *           type: string
 *           example: "juan@mail.com"
 *         telefono:
 *           type: string
 *           example: "3001234567"
 *
 *     OperadorRecaudo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123456789"
 *         nombre:
 *           type: string
 *           example: "Operador Caja"
 *
 *     RecaudoResponse:
 *       type: object
 *       properties:
 *         idRecaudo:
 *           type: integer
 *           example: 20
 *         factura:
 *           type: string
 *           example: "FAC-1700000000000"
 *         fechaTransaccion:
 *           type: string
 *           format: date-time
 *         valor:
 *           type: number
 *           example: 530000
 *         concepto:
 *           type: string
 *           example: "Pago reserva + cargos"
 *         estado:
 *           type: string
 *           example: "APROBADO"
 *         cliente:
 *           $ref: '#/components/schemas/ClienteRecaudo'
 *         operador:
 *           $ref: '#/components/schemas/OperadorRecaudo'
 *
 *     RecaudoPagoRequest:
 *       type: object
 *       required:
 *         - numSolicitud
 *         - idSolicitudDet
 *         - idClienteDet
 *         - nombreCliente
 *         - correo
 *         - telefono
 *         - metodo_pago
 *       properties:
 *         numSolicitud:
 *           type: string
 *           example: "0AALE3"
 *         idSolicitudDet:
 *           type: integer
 *           example: 10
 *         tipoFactura:
 *           type: string
 *           example: "E"
 *         idClienteDet:
 *           type: integer
 *           example: 5
 *         nombreCliente:
 *           type: string
 *           example: "Juan Pérez"
 *         correo:
 *           type: string
 *           example: "juan@mail.com"
 *         telefono:
 *           type: string
 *           example: "3001234567"
 *         valor:
 *           type: number
 *           example: 480000
 *           description: Valor base de la reserva (sin cargos)
 *         concepto:
 *           type: string
 *           example: "Pago reserva hotel"
 *         ref1:
 *           type: string
 *           example: "PAY123"
 *         ref2:
 *           type: string
 *           example: "WOMPI"
 *         respBanco:
 *           type: string
 *           example: "APROBADO"
 *         respCus:
 *           type: string
 *           example: "00"
 *         metodo_pago:
 *           type: string
 *           enum: [EFECTIVO, TRANSFERENCIA]
 *           example: "TRANSFERENCIA"
 *         ref_operador:
 *           type: string
 *           example: "123456789"
 *
 *     RecaudoPagoResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Pago registrado correctamente"
 *         data:
 *           type: object
 *           properties:
 *             numFactura:
 *               type: string
 *               example: "FAC-1700000000000"
 *             totalReserva:
 *               type: number
 *               example: 480000
 *             totalCargos:
 *               type: number
 *               example: 50000
 *             totalPagado:
 *               type: number
 *               example: 530000
 */

/**
 * @swagger
 * /recaudo/pagar:
 *   post:
 *     summary: Registra el pago de una reserva y suma automáticamente los cargos pendientes
 *     description: |
 *       Registra el pago de una reserva.
 *       El sistema:
 *       - Valida el estado de la solicitud
 *       - Calcula saldo pendiente
 *       - Suma cargos pendientes
 *       - Genera factura
 *       - Registra recaudo
 *       - Marca cargos como pagados
 *       - Actualiza estado de la solicitud
 *     tags: [Recaudos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecaudoPagoRequest'
 *     responses:
 *       201:
 *         description: Pago registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecaudoPagoResponse'
 *       400:
 *         description: Error de validación o estado inválido
 *       404:
 *         description: Solicitud no encontrada
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /recaudo/obtener:
 *   get:
 *     summary: Obtiene el historial de recaudos
 *     tags: [Recaudos]
 *     responses:
 *       200:
 *         description: Lista de recaudos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecaudoResponse'
 *       500:
 *         description: Error del servidor
 */
