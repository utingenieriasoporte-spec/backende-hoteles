const express = require("express");
const router = express.Router();
const authController = require("../controller/configController");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicio de sesión operador del sistema
 *     description: |
 *       Valida credenciales del operador.
 *       En esta versión no se genera token, se retorna la información básica del usuario.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idPersona
 *               - password
 *             properties:
 *               idPersona:
 *                 type: string
 *                 example: "123"
 *               password:
 *                 type: string
 *                 example: "abc123"
 *     responses:
 *       200:
 *         description: Login exitoso
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
 *                   example: Credenciales válidas
 *                 data:
 *                   type: object
 *                   properties:
 *                     perfil:
 *                       type: string
 *                       example: ADMIN
 *                     primerNombre:
 *                       type: string
 *                       example: Juan
 *                     correo:
 *                       type: string
 *                       example: juan@mail.com
 *                     idPersona:
 *                       type: string
 *                       example: "123"
 *                     telefono:
 *                       type: string
 *                       example: "3001234567"
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno
 */

router.post("/login", authController.login);

module.exports = router;
