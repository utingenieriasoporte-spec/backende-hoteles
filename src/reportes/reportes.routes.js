const express = require("express");
const router = express.Router();
const reporteMetodoPagoController = require("./recaudo/reporterecaudo.controller");
const reportesCargosController = require("./cargo/reportecargo.controller");
const reportesHuespedController = require("./huesped/reportehuesped.controller");
const reporteComandasController = require("./comanda/reporteComandasController");
const reporteCargoPendienteController = require("./titular/reportetitular.controller");

router.get("/pdf", reporteMetodoPagoController.generarPdf);

router.get(
  "/pdf-por-concepto",
  reportesCargosController.descargarReporteCargos,
);

router.get(
  "/pdf-huespedes",
  reportesHuespedController.descargarReporteHuespedes,
);
router.get(
  "/pdf-cargos-pendientes",
  reporteCargoPendienteController.descargarReporteCargosPendientes,
);

router.get(
  "/pdf-huespedes-actuales",
  reportesHuespedController.descargarReporteHuespedesActuales,
);

router.get(
  "/pdf-huespedes-rango",
  reportesHuespedController.descargarReporteHuespedesRango,
);
router.get("/pdf-comanda", reporteComandasController.descargarReporteComandas);
module.exports = router;
