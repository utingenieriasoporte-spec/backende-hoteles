const express = require("express");
const router = express.Router();
const bodegaController = require("../controller/bodegaController");

router.get("/", bodegaController.getAll);
router.post("/", bodegaController.postBodega);
// router.get("/:id/items", bodegaController.getItemsByBodega);

module.exports = router;