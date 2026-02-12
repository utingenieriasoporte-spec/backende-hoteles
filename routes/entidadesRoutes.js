const express = require("express");
const router = express.Router();
const entidadesController = require("../controller/entidadesController");

router.get("/obtener", entidadesController.getAll);
router.post("/crear", entidadesController.crear);
router.patch("/actualizar-detalle", entidadesController.actualizarDetalle);
router.get("/:entidad", entidadesController.listarPorEntidad);
module.exports = router;
