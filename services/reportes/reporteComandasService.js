const reporteComandasModel = require("../../models/reportes/reporteComanda");
const { generarPdfReporteComandas } = require("../../utils/pdfComandas");

async function generarReporteComandasHabitacion() {
  const comandas =
    await reporteComandasModel.obtenerReporteComandasHabitacion();

  if (!comandas || comandas.length === 0) {
    throw new Error("No existen comandas registradas");
  }

  const pdf = generarPdfReporteComandas(comandas);
  return pdf;
}

module.exports = {
  generarReporteComandasHabitacion,
};
