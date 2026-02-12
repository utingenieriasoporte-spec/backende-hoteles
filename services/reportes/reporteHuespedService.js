const reporteHuespedesModel = require("../../models/reportes/reporteHuespedes");
const {
  generarPdfReporteHuespedes,
  generarPdfHuespedesActuales,
  generarPdfHuespedesRango,
} = require("../../utils/pdfHuesped");

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

async function generarReportePdf({ fecha }) {
  if (!fecha) throw new Error("FECHA_REQUERIDA");

  const huespedes = await reporteHuespedesModel.obtenerHuespedesPorFecha(fecha);

  if (!huespedes.length) {
    throw new Error("SIN_DATOS");
  }

  const pdfDoc = generarPdfHuespedesActuales(huespedes, fecha);

  return pdfDoc;
}

async function generarReporteHuespedRangoPdf({ fechaDesde, fechaHasta }) {
  if (!fechaDesde || !fechaHasta) throw new Error("RANGO_FECHAS_REQUERIDO");

  const huespedes = await reporteHuespedesModel.obtenerHuespedesPorRango(
    fechaDesde,
    fechaHasta,
  );

  if (!huespedes.length) {
    throw new Error("SIN_DATOS");
  }

  const pdfDoc = generarPdfHuespedesRango(huespedes, fechaDesde, fechaHasta);

  return pdfDoc;
}

module.exports = {
  generarReporteHuespedesCheckin,
  generarReportePdf,
  generarReporteHuespedRangoPdf,
};
