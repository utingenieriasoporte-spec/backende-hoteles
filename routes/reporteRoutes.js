const express = require("express");
const router = express.Router();
const reportesController = require("../controller/reporteController");
const reportesCargosController = require("../controller/reporteCargoController");
const reportesHuesped = require("../controller/reporteHuespedController");
const reporteComandasController = require("../controller/reporteComandasController");
const reporteCargoPendienteController = require("../controller/reporteIdTitularController");
router.get("/pdf", reportesController.generarPdf);

router.get(
  "/pdf-por-concepto",
  reportesCargosController.descargarReporteCargos,
);

router.get("/pdf-huespedes", reportesHuesped.descargarReporteHuespedes);
router.get(
  "/pdf-cargos-pendientes",
  reporteCargoPendienteController.descargarReporteCargosPendientes,
);

router.get(
  "/pdf-huespedes-actuales",
  reportesHuesped.descargarReporteHuespedesActuales,
);

router.get(
  "/pdf-huespedes-rango",
  reportesHuesped.descargarReporteHuespedesRango,
);
router.get("/pdf-comanda", reporteComandasController.descargarReporteComandas);
module.exports = router;
