const reporteHuespedesModel = require("../../models/reportes/reporteHuespedes");
const { generarPdfReporteHuespedes } = require("../../utils/pdfHuesped");

async function generarReporteHuespedesCheckin({ fechaDesde, fechaHasta }) {
  if (!fechaDesde || !fechaHasta) {
    throw new Error("fechaDesde y fechaHasta son obligatorias");
  }

  const huespedes = await reporteHuespedesModel.obtenerHuespedesCheckin(
    fechaDesde,
    fechaHasta,
  );

  if (!huespedes || huespedes.length === 0) {
    throw new Error("No existen huéspedes registrados en ese rango");
  }

  const pdfDoc = generarPdfReporteHuespedes(huespedes, fechaDesde, fechaHasta);

  return pdfDoc;
}

module.exports = {
  generarReporteHuespedesCheckin,
};
