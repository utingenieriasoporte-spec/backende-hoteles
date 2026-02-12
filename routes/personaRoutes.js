const express = require("express");
const router = express.Router();
const personaController = require("../controller/personaController");

/**
 * @swagger
 * /persona/crear:
 *   post:
 *     summary: Crea una persona con su detalle
 *     tags: [Personas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_persona, tipo_id, razon_social, fecha_nacimiento, ref_genero, nacionalidad, direccion, email, telefono]
 *             properties:
 *               id_persona:
 *                 type: string
 *                 example: "123456789"
 *               tipo_id:
 *                 type: string
 *                 example: "C"
 *               digverif:
 *                 type: integer
 *                 example: 1
 *               razon_social:
 *                 type: string
 *                 example: "Juan Perez"
 *               apellido1:
 *                 type: string
 *                 example: "Perez"
 *               apellido2:
 *                 type: string
 *                 example: "Lopez"
 *               nombre1:
 *                 type: string
 *                 example: "Juan"
 *               nombre2:
 *                 type: string
 *                 example: "Carlos"
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *                 example: "1995-06-10"
 *               ref_genero:
 *                 type: string
 *                 example: "GENERO_MASCULINO"
 *               nacionalidad:
 *                 type: integer
 *                 example: 1
 *               direccion:
 *                 type: string
 *                 example: "Calle 123"
 *               direccion_c:
 *                 type: string
 *                 example: "Apto 301"
 *               cod_munic:
 *                 type: integer
 *                 example: 11001
 *               email:
 *                 type: string
 *                 example: "juan@mail.com"
 *               telefono:
 *                 type: string
 *                 example: "3001234567"
 *               contacto:
 *                 type: string
 *                 example: "Maria Perez"
 *               latitud:
 *                 type: number
 *                 example: 4.60971
 *               longitud:
 *                 type: number
 *                 example: -74.08175
 *     responses:
 *       201:
 *         description: Persona creada correctamente
 *       400:
 *         description: Error de validación
 */
router.post("/crear", personaController.crear);

/**
 * @swagger
 * /persona/listar:
 *   get:
 *     summary: Obtiene todas las personas
 *     tags: [Personas]
 *     responses:
 *       200:
 *         description: Lista de personas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_persona:
 *                     type: string
 *                     example: "123456789"
 *                   razon_social:
 *                     type: string
 *                     example: "Juan Perez"
 *                   email:
 *                     type: string
 *                     example: "juan@mail.com"
 *                   telefono:
 *                     type: string
 *                     example: "3001234567"
 */

router.get("/listar", personaController.listar);

/**
 * @swagger
 * /persona/{id}:
 *   get:
 *     summary: Obtiene una persona por su ID
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "123456789"
 *     responses:
 *       200:
 *         description: Persona encontrada
 *       404:
 *         description: Persona no encontrada
 */

router.get("/:id", personaController.obtenerPorId);

/**
 * @swagger
 * /persona/{id}:
 *   put:
 *     summary: Actualiza una persona y su detalle
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Persona actualizada correctamente
 *       400:
 *         description: Error al actualizar
 */

router.put("/:id", personaController.actualizar);

/**
 * @swagger
 * /persona/{id}:
 *   delete:
 *     summary: Desactiva una persona (soft delete)
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Persona desactivada correctamente
 *       400:
 *         description: Error al desactivar
 */

router.delete("/:id", personaController.eliminar);

module.exports = router;
