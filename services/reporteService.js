const reporteModel = require("../models/reportes/reporteRecaudosModel");
const { generarPdfRecaudos } = require("../utils/pdfGenerator");

async function generarReportePdf({ fechaDesde, fechaHasta, idOperador }) {
  if (!fechaDesde || !fechaHasta) throw new Error("RANGO_FECHAS_REQUERIDO");

  if (!idOperador) throw new Error("OPERADOR_REQUERIDO");

  const recaudos = await reporteModel.obtenerRecaudosPorRangoOperador(
    fechaDesde,
    fechaHasta,
    idOperador,
  );

  if (!recaudos.length) {
    throw new Error("SIN_DATOS");
  }

  const pdfDoc = generarPdfRecaudos(recaudos, fechaDesde, fechaHasta);

  return pdfDoc;
}

module.exports = {
  generarReportePdf,
};
