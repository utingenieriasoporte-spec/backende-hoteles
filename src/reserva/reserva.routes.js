const express = require("express");
const router = express.Router();
const reservaController = require("./reserva.controller");

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Operaciones relacionadas con reservas de alojamiento
 */

/**
 * @swagger
 * /reserva/crear:
 *   post:
 *     summary: Crea una nueva reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idTitular:
 *                 type: string
 *                 example: "123456789"
 *               nombreTitular:
 *                 type: string
 *                 example: "Juan Pérez"
 *               procesado_por:
 *                 type: string
 *                 example: "145225255"
 *               emailTitular:
 *                 type: string
 *                 example: "juan@example.com"
 *               telefonoTitular:
 *                 type: string
 *                 example: "+573001112233"
 *               refOrigen:
 *                 type: string
 *                 example: "OR001"
 *                 description: Referencia del origen de la solicitud
 *               refNovedades:
 *                 type: string
 *                 example: "NOV001"
 *                 description: Referencia de novedades aplicables
 *               observaciones:
 *                 type: string
 *                 example: "Solicita habitación cerca de la piscina"
 *                 description: Comentarios u observaciones de la reserva
 *               totalPago:
 *                 type: number
 *                 example: 1500000
 *               detalles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idAcomodacion:
 *                       type: integer
 *                       example: 1
 *                     fechaDeLlegada:
 *                       type: string
 *                       format: date
 *                       example: "2025-07-20"
 *                     fechaDeSalida:
 *                       type: string
 *                       format: date
 *                       example: "2025-07-23"
 *                     horaEstimadaLlegada:
 *                       type: string
 *                       example: "15:00"
 *                     numeroPersonas:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Reserva creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 numReserva:
 *                   type: string
 *       500:
 *         description: Error interno al crear la reserva
 */
router.post("/crear", reservaController.crear);

/**
 * @swagger
 * /reservas/crearConAsignacion:
 *   post:
 *     summary: Crear una reserva con asignación de habitación
 *     description: >
 *       Crea una reserva de alojamiento, asigna una habitación
 *       y aplica cargos adicionales por adultos y menores si corresponde.
 *     tags:
 *       - Reservas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idTitular
 *               - nombreTitular
 *               - emailTitular
 *               - telefonoTitular
 *               - detalles
 *               - refOrigen
 *               - procesado_por
 *               - idHabitacion
 *             properties:
 *               idTitular:
 *                 type: integer
 *                 example: 102030
 *               nombreTitular:
 *                 type: string
 *                 example: Juan Pérez
 *               emailTitular:
 *                 type: string
 *                 example: juan@email.com
 *               telefonoTitular:
 *                 type: string
 *                 example: "3001234567"
 *               refOrigen:
 *                 type: string
 *                 example: ORG_WEB
 *               observaciones:
 *                 type: string
 *                 example: Cliente frecuente
 *               procesado_por:
 *                 type: string
 *                 example: admin
 *               adultos:
 *                 type: integer
 *                 example: 1
 *               menores:
 *                 type: integer
 *                 example: 0
 *               noches:
 *                 type: integer
 *                 example: 2
 *               idHabitacion:
 *                 type: integer
 *                 example: 12
 *               detalles:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - fechaDeLlegada
 *                     - fechaDeSalida
 *                     - numeroPersonas
 *                     - idAcomodacion
 *                   properties:
 *                     fechaDeLlegada:
 *                       type: string
 *                       format: date
 *                       example: "2026-02-10"
 *                     fechaDeSalida:
 *                       type: string
 *                       format: date
 *                       example: "2026-02-12"
 *                     horaEstimadaLlegada:
 *                       type: string
 *                       example: "14:00"
 *                     numeroPersonas:
 *                       type: integer
 *                       example: 2
 *                     idAcomodacion:
 *                       type: integer
 *                       example: 3
 *     responses:
 *       201:
 *         description: Reserva creada correctamente
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
 *                   example: Reserva creada correctamente
 *                 numReserva:
 *                   type: string
 *                   example: RES-20260201-001
 *                 noches:
 *                   type: integer
 *                   example: 2
 *                 adultoSol:
 *                   type: integer
 *                   example: 1
 *                 menoresSol:
 *                   type: integer
 *                   example: 0
 *       400:
 *         description: Error de validación
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
 *                   example: La cantidad de personas debe ser mayor a 0
 *       500:
 *         description: Error interno del servidor
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
 *                   example: Error interno al registrar la reserva
 */

router.post("/crearConAsignacion", reservaController.crearReservaConAsignacion);

/**
 * @swagger
 * /reserva/ampliar:
 *   post:
 *     summary: Crea una ampliación de una reserva existente (genera una nueva reserva)
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [numReservaOriginal, nuevaFechaSalida, horaSalida]
 *             properties:
 *               numReservaOriginal:
 *                 type: string
 *                 example: "0AALE3"
 *               nuevaFechaSalida:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-25"
 *               horaSalida:
 *                 type: string
 *                 example: "14:30"
 *     responses:
 *       201:
 *         description: Ampliación creada correctamente
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
 *                   example: "Ampliación creada correctamente"
 *                 numReservaNueva:
 *                   type: string
 *                   example: "KPL921"
 *                 noches:
 *                   type: integer
 *                   example: 3
 *                 totalPago:
 *                   type: number
 *                   example: 480000
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post("/ampliar", reservaController.crearAmpliacionReserva);

/**
 * @swagger
 * /reserva/obtener:
 *   get:
 *     summary: Obtiene todas las reservas realizadas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   numReserva:
 *                     type: string
 *                     example: "ABC123"
 *                   titular:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123456789"
 *                       nombre:
 *                         type: string
 *                         example: "Juan Pérez"
 *                       email:
 *                         type: string
 *                         example: "juan@example.com"
 *                       telefono:
 *                         type: string
 *                         example: "+573001112233"
 *                   detalle:
 *                     type: string
 *                     example: "Reserva acomodación: 1, 2 persona(s), con fecha de entrada 2025-07-20 y fecha de salida 2025-07-23, con hora estimada de llegada 15:00"
 *                   fecha_inicio:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-20"
 *                   fecha_salida:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-20"
 *                   hora:
 *                     type: string
 *                     example: "15:00:00"
 *                   cuposReservados:
 *                     type: integer
 *                     example: 2
 *                   totalPago:
 *                     type: number
 *                     example: 1500000
 *                   estado:
 *                     type: string
 *                     example: "CONFIRMADA"
 *                   refOrigen:
 *                     type: string
 *                     example: "WEB"
 *                   refNovedades:
 *                     type: string
 *                     example: "PROMO_JULIO"
 *                   observaciones:
 *                     type: string
 *                     example: "Solicita habitación cerca de la piscina"
 *                   procesado_por:
 *                     type: string
 *                     example: "12345678"
 *       500:
 *         description: Error al obtener reservas
 */
router.get("/obtener", reservaController.listar);

/**
 * @swagger
 * /reserva/estado:
 *   put:
 *     summary: Actualiza el estado de una reserva existente.
 *     tags:
 *       - Reservas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numReserva:
 *                 type: string
 *                 example: "HXL034"
 *               nuevoEstado:
 *                 type: string
 *                 enum: [PENDIENTE, CONFIMADO, CHECK_IN, CHECK_OUT, CANCELADO]
 *                 example: "CONFIMADO"
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Error de validación o estado inválido
 *       500:
 *         description: Error del servidor
 */
router.put("/estado", reservaController.actualizarEstado);

/**
 * @swagger
 * /reserva/cancelar/{num_solicitud}:
 *   put:
 *     summary: Cancela una reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: num_solicitud
 *         required: true
 *         schema:
 *           type: string
 *         example: "65SK7D"
 *     responses:
 *       200:
 *         description: Reserva cancelada correctamente
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error interno
 */
router.put("/cancelar/:num_solicitud", reservaController.cancelarReserva);

/**
 * @swagger
 * /reserva/{idTitular}:
 *   get:
 *     summary: Obtiene todas las reservas realizadas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   numReserva:
 *                     type: string
 *                     example: "ABC123"
 *                   titular:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123456789"
 *                       nombre:
 *                         type: string
 *                         example: "Juan Pérez"
 *                       email:
 *                         type: string
 *                         example: "juan@example.com"
 *                       telefono:
 *                         type: string
 *                         example: "+573001112233"
 *                   detalle:
 *                     type: string
 *                     example: "Reserva acomodación: 1, 2 persona(s), con fecha de entrada 2025-07-20 y fecha de salida 2025-07-23, con hora estimada de llegada 15:00"
 *                   fecha:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-20"
 *                   hora:
 *                     type: string
 *                     example: "15:00:00"
 *                   cuposReservados:
 *                     type: integer
 *                     example: 2
 *                   totalPago:
 *                     type: number
 *                     example: 1500000
 *                   estado:
 *                     type: string
 *                     example: "CONFIRMADA"
 *                   refOrigen:
 *                     type: string
 *                     example: "WEB"
 *                   refNovedades:
 *                     type: string
 *                     example: "PROMO_JULIO"
 *                   observaciones:
 *                     type: string
 *                     example: "Solicita habitación cerca de la piscina"
 *       500:
 *         description: Error al obtener reservas
 */
router.get("/:idTitular", reservaController.listarReservaPorIdTitular);

/**
 * @swagger
 * /reserva/novedad:
 *   patch:
 *     summary: Actualiza la novedad y observaciones de una reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [numSolicitud]
 *             properties:
 *               numSolicitud:
 *                 type: string
 *                 example: "65SK7D"
 *               refNovedades:
 *                 type: string
 *                 example: "NOV002"
 *               observaciones:
 *                 type: string
 *                 example: "Cliente solicita salida tardía"
 *     responses:
 *       200:
 *         description: Actualización exitosa
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno
 */
router.patch("/novedad", reservaController.actualizarNovedadYObservaciones);

/**
 * @swagger
 * /reservas/adicionar-personas:
 *   post:
 *     summary: Adicionar cargos por adultos y menores a una reserva
 *     tags:
 *       - Reservas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numReserva
 *             properties:
 *               numReserva:
 *                 type: string
 *                 example: RSV123456
 *               adultos:
 *                 type: integer
 *                 example: 2
 *               menores:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Adicionales aplicados correctamente
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
 *                   example: Adicionales aplicados correctamente
 *                 totalAdicional:
 *                   type: number
 *                   example: 90000
 *                 detalle:
 *                   type: object
 *                   properties:
 *                     adultos:
 *                       type: integer
 *                       example: 2
 *                     menores:
 *                       type: integer
 *                       example: 1
 *                     adicionalAdultos:
 *                       type: number
 *                       example: 60000
 *                     adicionalMenores:
 *                       type: number
 *                       example: 30000
 *       400:
 *         description: Error de validación
 */
router.post(
  "/adicionar-personas",
  reservaController.adicionarPersonasController,
);
module.exports = router;
