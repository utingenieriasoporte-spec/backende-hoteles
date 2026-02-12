const reporteHuespedesModel = require("../../models/reportes/reporteHuespedes");
const { generarPdfReporteHuespedes } = require("../../utils/pdfHuesped");

async function generarReporteHuespedesCheckin() {
  const huespedes = await reporteHuespedesModel.obtenerHuespedesCheckin();

  if (!huespedes || huespedes.length === 0) {
    throw new Error("No existen huéspedes registrados");
  }

  const pdfDoc = generarPdfReporteHuespedes(huespedes);

  return pdfDoc;
}

module.exports = {
  generarReporteHuespedesCheckin,
};
