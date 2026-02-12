const reporteCargosService = require("../services/reporteCargoService");

async function descargarReporteCargos(req, res) {
  try {
    const { fechaDesde, fechaHasta, idOperador } = req.query;

    const pdf = await reporteCargosService.generarReporteCargosPorConcepto({
      fechaDesde,
      fechaHasta,
      idOperador,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=reporte_cargos_${fechaDesde}_a_${fechaHasta}.pdf`,
    );

    pdf.pipe(res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  descargarReporteCargos,
};
