const express = require("express");
const router = express.Router();
const cargosController = require("./cargo.controller");

/**
 * @swagger
 * tags:
 *   name: Cargos
 *   description: Gestión de cargos por habitación
 */

/**
 * @swagger
 * /cargo/crear:
 *   post:
 *     summary: Crear un nuevo cargo
 *     tags: [Cargos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_asignacion_habitacion
 *               - ref_concepto
 *               - total
 *             properties:
 *               id_asignacion_habitacion:
 *                 type: integer
 *                 example: 15
 *               ref_concepto:
 *                 type: string
 *                 example: MINIBAR
 *               observaciones:
 *                 type: string
 *                 example: Consumo bebidas
 *               total:
 *                 type: number
 *                 example: 85000
 *     responses:
 *       201:
 *         description: Cargo creado correctamente
 */
router.post("/crear", cargosController.crearCargo);

/**
 * @swagger
 * /cargo/asignacion/{id_asignacion}:
 *   get:
 *     summary: Listar cargos por asignación de habitación
 *     tags: [Cargos]
 *     parameters:
 *       - in: path
 *         name: id_asignacion
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de cargos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_cargo:
 *                     type: integer
 *                     example: 10
 *                   asignacionVigente:
 *                     type: object
 *                     properties:
 *                       numReserva:
 *                         type: integer
 *                         example: 1025
 *                       idAsignacionHabitacion:
 *                         type: integer
 *                         example: 15
 *                       habitacion:
 *                         type: string
 *                         example: "204"
 *                       piso:
 *                         type: integer
 *                         example: 2
 *                       fechaAsignacion:
 *                         type: string
 *                         format: date-time
 *                       fechaDesde:
 *                         type: string
 *                         format: date-time
 *                       fechaHasta:
 *                         type: string
 *                         format: date-time
 *                   concepto:
 *                     type: string
 *                     example: Consumo minibar
 *                   observaciones:
 *                     type: string
 *                     example: Bebidas y snacks
 *                   montoAbonado:
 *                     type: number
 *                     example: 0
 *                   total:
 *                     type: number
 *                     example: 85000
 *                   estado:
 *                     type: string
 *                     example: PENDIENTE_PAGO
 */
router.get("/asignacion/:id_asignacion", cargosController.listarCargos);

/**
 * @swagger
 * /cargo/obtener:
 *   get:
 *     summary: Obtener todos los cargos
 *     tags: [Cargos]
 *     responses:
 *       200:
 *         description: Lista de cargos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_cargo:
 *                     type: integer
 *                     example: 1
 *                   asignacionVigente:
 *                     type: object
 *                     properties:
 *                       numReserva:
 *                         type: integer
 *                         example: 1025
 *                       idAsignacionHabitacion:
 *                         type: integer
 *                         example: 15
 *                       habitacion:
 *                         type: string
 *                         example: "204"
 *                       piso:
 *                         type: integer
 *                         example: 2
 *                       fechaAsignacion:
 *                         type: string
 *                         format: date-time
 *                       fechaDesde:
 *                         type: string
 *                         format: date-time
 *                       fechaHasta:
 *                         type: string
 *                         format: date-time
 *                   concepto:
 *                     type: string
 *                     example: Consumo minibar
 *                   observaciones:
 *                     type: string
 *                   montoAbonado:
 *                     type: number
 *                   total:
 *                     type: number
 *                   estado:
 *                     type: string
 */
router.get("/obtener", cargosController.listarTodo);

/**
 * @swagger
 * /cargo/{id}:
 *   get:
 *     summary: Obtener un cargo por ID
 *     tags: [Cargos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información del cargo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_cargo:
 *                   type: integer
 *                 asignacionVigente:
 *                   type: object
 *                 concepto:
 *                   type: string
 *                 observaciones:
 *                   type: string
 *                 montoAbonado:
 *                   type: number
 *                 total:
 *                   type: number
 *                 estado:
 *                   type: string
 *       404:
 *         description: Cargo no encontrado
 */
router.get("/:id", cargosController.obtenerCargo);

/**
 * @swagger
 * /cargo/{id}:
 *   put:
 *     summary: Actualizar un cargo
 *     tags: [Cargos]
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
 *               observaciones:
 *                 type: string
 *               total:
 *                 type: number
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cargo actualizado correctamente
 */
router.put("/:id", cargosController.actualizarCargo);

/**
 * @swagger
 * /cargo/{id}:
 *   delete:
 *     summary: Cancelar un cargo
 *     tags: [Cargos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cargo cancelado correctamente
 */
router.delete("/:id", cargosController.cancelarCargo);

/**
 * @swagger
 * /cargo/reserva/{numReserva}:
 *   get:
 *     summary: Listar cargos por asignación de habitación
 *     tags: [Cargos]
 *     parameters:
 *       - in: path
 *         name: id_asignacion
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de cargos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_cargo:
 *                     type: integer
 *                     example: 10
 *                   asignacionVigente:
 *                     type: object
 *                     properties:
 *                       numReserva:
 *                         type: integer
 *                         example: 1025
 *                       idAsignacionHabitacion:
 *                         type: integer
 *                         example: 15
 *                       habitacion:
 *                         type: string
 *                         example: "204"
 *                       piso:
 *                         type: integer
 *                         example: 2
 *                       fechaAsignacion:
 *                         type: string
 *                         format: date-time
 *                       fechaDesde:
 *                         type: string
 *                         format: date-time
 *                       fechaHasta:
 *                         type: string
 *                         format: date-time
 *                   concepto:
 *                     type: string
 *                     example: Consumo minibar
 *                   observaciones:
 *                     type: string
 *                     example: Bebidas y snacks
 *                   montoAbonado:
 *                     type: number
 *                     example: 0
 *                   total:
 *                     type: number
 *                     example: 85000
 *                   estado:
 *                     type: string
 *                     example: PENDIENTE_PAGO
 */
router.get("/reserva/:numReserva", cargosController.listarCargosNumReserva);

module.exports = router;
