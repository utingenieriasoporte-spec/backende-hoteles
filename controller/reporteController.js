const reporteService = require("../services/reporteService");

async function generarPdf(req, res) {
  try {
    const { fechaDesde, fechaHasta, idOperador } = req.query;

    const pdfDoc = await reporteService.generarReportePdf({
      fechaDesde,
      fechaHasta,
      idOperador,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=reporte_recaudos_${fechaDesde}_a_${fechaHasta}.pdf`,
    );

    pdfDoc.pipe(res);
  } catch (error) {
    console.error(error);

    if (error.message === "SIN_DATOS") {
      return res
        .status(404)
        .json({ message: "No hay recaudos para esa fecha" });
    }

    res.status(500).json({ message: "Error generando PDF" });
  }
}

module.exports = {
  generarPdf,
};
