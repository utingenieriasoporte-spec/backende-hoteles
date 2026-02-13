const PDFDocument = require("pdfkit");

function generarPdfCargosPendientes(cargos) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
  });

  const titular = cargos[0];

  /* =========================
     ENCABEZADO
  ========================= */

  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("REPORTE DE CARGOS PENDIENTES", { align: "center" });

  doc.moveDown();

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Titular: ${titular.razon_social}`, { align: "center" });

  doc.text(`Documento: ${titular.id_persona}`, { align: "center" });

  doc.moveDown(1.5);
  doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown();

  /* =========================
     TABLA
  ========================= */

  const startX = 40;
  let y = doc.y;

  const cols = {
    habitacion: { x: startX, width: 70 },
    solicitud: { x: startX + 70, width: 90 },
    concepto: { x: startX + 160, width: 120 },
    observacion: { x: startX + 280, width: 120 },
    total: { x: startX + 400, width: 80 },
  };

  doc.fontSize(9).font("Helvetica-Bold");

  doc.text("Hab.", cols.habitacion.x, y);
  doc.text("Solicitud", cols.solicitud.x, y);
  doc.text("Concepto", cols.concepto.x, y);
  doc.text("Obs.", cols.observacion.x, y);
  doc.text("Total", cols.total.x, y, { align: "right" });

  y += 14;
  doc.moveTo(startX, y).lineTo(555, y).stroke();
  y += 6;

  doc.font("Helvetica");

  let totalGeneral = 0;

  cargos.forEach((c) => {
    const valor = Number(c.total) || 0;
    totalGeneral += valor;

    doc.text(c.numero_habitacion, cols.habitacion.x, y);
    doc.text(c.num_solicitud, cols.solicitud.x, y);
    doc.text(c.detalle, cols.concepto.x, y, { width: cols.concepto.width });
    doc.text(c.observaciones || "-", cols.observacion.x, y, {
      width: cols.observacion.width,
    });

    doc.text(`$ ${valor.toLocaleString("es-CO")}`, cols.total.x, y, {
      width: cols.total.width,
      align: "right",
    });

    y += 14;

    if (y > 760) {
      doc.addPage();
      y = 50;
    }
  });

  y += 10;
  doc.moveTo(cols.concepto.x, y).lineTo(555, y).stroke();
  y += 8;

  doc.font("Helvetica-Bold");

  doc.text("TOTAL PENDIENTE:", cols.concepto.x, y, {
    align: "right",
    width: cols.concepto.width + 120,
  });

  doc.text(`$ ${totalGeneral.toLocaleString("es-CO")}`, cols.total.x, y, {
    align: "right",
  });

  doc.end();
  return doc;
}

module.exports = {
  generarPdfCargosPendientes,
};
