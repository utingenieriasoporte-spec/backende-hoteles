const reporteCargosModel = require("./reportecargo.model");
const { generarPdfReporteCargos } = require("./reportecargo.pdf");

async function generarReporteCargosPorConcepto({
  fechaDesde,
  fechaHasta,
  idOperador,
}) {
  if (!fechaDesde || !fechaHasta || !idOperador) {
    throw new Error("fechaDesde, fechaHasta e idOperador son obligatorios");
  }

  const cargos = await reporteCargosModel.obtenerReporteCargosPorConcepto(
    fechaDesde,
    fechaHasta,
    idOperador,
  );

  if (!cargos || cargos.length === 0) {
    throw new Error("No existen cargos para los filtros enviados");
  }

  const pdfDoc = generarPdfReporteCargos(cargos, fechaDesde, fechaHasta);

  return pdfDoc;
}

module.exports = {
  generarReporteCargosPorConcepto,
};
