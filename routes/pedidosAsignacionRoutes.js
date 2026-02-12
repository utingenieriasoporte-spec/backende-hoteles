const express = require("express");
const router = express.Router();
const pedidosAsignacionController = require("../controller/pedidosAsignacionController");

router.post("/", pedidosAsignacionController.postPedido);
router.get(
  "/asignacion/:idAsignacion",
  pedidosAsignacionController.getByAsignacion,
);
router.get("/:id", pedidosAsignacionController.getById);
router.get(
  "/historial/:idAsignacion",
  pedidosAsignacionController.getPedidoAllByAsignacion,
);
router.put("/:idPedido/procesar", pedidosAsignacionController.procesarPedido);
router.get("/", pedidosAsignacionController.getAllPedidos);

module.exports = router;
