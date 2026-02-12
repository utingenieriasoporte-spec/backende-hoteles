const reporteHuespedesService = require("../services/reportes/reporteHuespedService");

async function descargarReporteHuespedes(req, res) {
  try {
    const { fechaDesde, fechaHasta } = req.query;

    const pdf = await reporteHuespedesService.generarReporteHuespedesCheckin({
      fechaDesde,
      fechaHasta,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=reporte_huespedes_${fechaDesde}_a_${fechaHasta}.pdf`,
    );

    pdf.pipe(res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  descargarReporteHuespedes,
};
