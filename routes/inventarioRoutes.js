const express = require("express");
const router = express.Router();
const inventarioController = require("../controller/inventarioController");

router.get("/items-inventario", inventarioController.getAll);
router.get("/item-inventario/:id", inventarioController.getById);
router.post("/item-inventario", inventarioController.postItem);
router.put("/item-inventario/:id", inventarioController.putItem);
router.post("/entradas", inventarioController.postEntrada);
router.post("/salidas", inventarioController.postSalida);
router.get("/bodegas/:id", inventarioController.getInventarioByBodega);
router.get("/entradas/bodega/:idBodega", inventarioController.getEntradasByBodega);
router.get("/salidas/bodega/:idBodega", inventarioController.getSalidasByBodega);

module.exports = router;