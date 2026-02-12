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

async function descargarReporteHuespedesActuales(req, res) {
  try {
    const { fecha } = req.query;

    const pdfDoc = await reporteHuespedesService.generarReportePdf({ fecha });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=huespedes_${fecha}.pdf`,
    );

    pdfDoc.pipe(res);
  } catch (error) {
    console.error(error);

    if (error.message === "SIN_DATOS") {
      return res.status(404).json({
        message: "No hay huéspedes alojados en esa fecha",
      });
    }

    res.status(500).json({ message: "Error generando PDF" });
  }
}

async function descargarReporteHuespedesRango(req, res) {
  try {
    const { fechaDesde, fechaHasta } = req.query;

    const pdfDoc = await reporteHuespedesService.generarReporteHuespedRangoPdf({
      fechaDesde,
      fechaHasta,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=huespedes_${fechaDesde}_a_${fechaHasta}.pdf`,
    );

    pdfDoc.pipe(res);
  } catch (error) {
    console.error(error);

    if (error.message === "SIN_DATOS") {
      return res.status(404).json({
        message: "No hay huéspedes en ese rango de fechas",
      });
    }

    res.status(500).json({ message: "Error generando PDF" });
  }
}

module.exports = {
  descargarReporteHuespedes,
  descargarReporteHuespedesActuales,
  descargarReporteHuespedesRango,
};
