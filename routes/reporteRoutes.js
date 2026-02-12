const express = require("express");
const router = express.Router();
const reportesController = require("../controller/reporteController");
const reportesCargosController = require("../controller/reporteCargoController");
const reportesHuesped = require("../controller/reporteHuespedController");
const reporteComandasController = require("../controller/reporteComandasController");
router.get("/pdf", reportesController.generarPdf);

router.get(
  "/pdf-por-concepto",
  reportesCargosController.descargarReporteCargos,
);

router.get("/pdf-huespedes", reportesHuesped.descargarReporteHuespedes);

router.get("/pdf-comanda", reporteComandasController.descargarReporteComandas);
module.exports = router;
