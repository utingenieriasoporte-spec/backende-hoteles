const reporteService = require("../services/reportes/reporteCargoPendienteService");

async function descargarReporteCargosPendientes(req, res) {
  try {
    const { idPersona } = req.query;

    const pdfDoc = await reporteService.generarReportePdf({ idPersona });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=cargos_pendientes_${idPersona}.pdf`,
    );

    pdfDoc.pipe(res);
  } catch (error) {
    console.error(error);

    if (error.message === "SIN_DATOS") {
      return res.status(404).json({
        message: "No hay cargos pendientes para este titular",
      });
    }

    res.status(500).json({ message: "Error generando PDF" });
  }
}

module.exports = {
  descargarReporteCargosPendientes,
};
