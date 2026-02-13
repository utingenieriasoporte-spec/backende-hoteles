const express = require("express");
const router = express.Router();

const cierreController = require("./cierrediario.controller");

router.post("/", cierreController.crearCierre);
router.get("/", cierreController.obtenerCierres);

module.exports = router;
