const express = require("express");
const router = express.Router();
const tarifasController = require("../controller/tarifasController");

router.get("/obtener", tarifasController.getAll);
router.get("/obtener/:id", tarifasController.getById);
router.post("/crear", tarifasController.crear);
router.patch("/actualizar/:id", tarifasController.actualizar);
router.put("/eliminar/:id", tarifasController.eliminar);

module.exports = router;
