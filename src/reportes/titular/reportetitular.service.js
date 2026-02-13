const reporteModel = require("./reportetitular.model");
const { generarPdfCargosPendientes } = require("./reportetitular.pdf");

async function generarReportePdf({ idPersona }) {
  if (!idPersona) throw new Error("TITULAR_REQUERIDO");

  const cargos =
    await reporteModel.obtenerCargosPendientesPorTitular(idPersona);

  if (!cargos.length) {
    throw new Error("SIN_DATOS");
  }

  const pdfDoc = generarPdfCargosPendientes(cargos);

  return pdfDoc;
}

module.exports = {
  generarReportePdf,
};
