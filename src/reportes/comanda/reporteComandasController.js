const reporteComandasService = require("./reporteComandasService");

async function descargarReporteComandas(req, res) {
  try {
    const pdf = await reporteComandasService.generarReporteComandasHabitacion();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "inline; filename=reporte_comandas.pdf",
    );

    pdf.pipe(res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  descargarReporteComandas,
};
