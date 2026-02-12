const reporteHuespedesService = require("../services/reportes/reporteHuespedService");

async function descargarReporteHuespedes(req, res) {
  try {
    const pdf = await reporteHuespedesService.generarReporteHuespedesCheckin();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "inline; filename=reporte_huespedes_checkin.pdf",
    );

    pdf.pipe(res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  descargarReporteHuespedes,
};
