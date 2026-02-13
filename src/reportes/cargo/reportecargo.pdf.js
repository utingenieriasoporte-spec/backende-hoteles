const PDFDocument = require("pdfkit");

function generarPdfReporteCargos(cargos, fechaDesde, fechaHasta) {
  const doc = new PDFDocument({ size: "A4", margin: 40 });

  const operador = cargos[0]?.nombre_operador || "N/A";
  const fechaImpresion = new Date();

  const fechaFormateada = fechaImpresion.toLocaleString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  /* =========================
     ENCABEZADO
  ========================= */
  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .text("REPORTE DE CARGOS POR CONCEPTO", { align: "center" });

  doc.moveDown(0.5);

  doc.fontSize(10).font("Helvetica").fillColor("#555");
  doc.text(`Operador: ${operador}`, { align: "center" });
  doc.text(`Fecha de impresión: ${fechaFormateada}`, { align: "center" });
  doc.text(`Fecha del reporte: ${fechaDesde} al ${fechaHasta}`, {
    align: "center",
  });

  doc.moveDown(1);
  doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown(1);

  /* =========================
     COLUMNAS
  ========================= */
  const startX = 40;
  const cols = {
    factura: { x: startX, width: 95 },
    cargo: { x: startX + 120, width: 70 },
    metodo: { x: startX + 210, width: 90 },
    fecha: { x: startX + 340, width: 100 },
    valor: { x: startX + 420, width: 85 },
  };

  let y = doc.y;

  /* =========================
     AGRUPAR POR CONCEPTO
  ========================= */
  const cargosPorConcepto = cargos.reduce((acc, c) => {
    const concepto = c.concepto || "SIN CONCEPTO";
    if (!acc[concepto]) acc[concepto] = [];
    acc[concepto].push(c);
    return acc;
  }, {});

  let totalGeneral = 0;

  /* =========================
     TABLAS
  ========================= */
  for (const concepto in cargosPorConcepto) {
    const lista = cargosPorConcepto[concepto];

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#000")
      .text(`Concepto: ${concepto}`, startX, y);

    y += 18;

    // Header
    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("Factura", cols.factura.x, y, { width: cols.factura.width });
    doc.text("Cargo", cols.cargo.x, y, { width: cols.cargo.width });
    doc.text("Método", cols.metodo.x, y, { width: cols.metodo.width });
    doc.text("Fecha", cols.fecha.x, y, { width: cols.fecha.width });
    doc.text("Valor", cols.valor.x, y, {
      width: cols.valor.width,
      align: "right",
    });

    y += 14;
    doc.moveTo(startX, y).lineTo(555, y).stroke();
    y += 6;

    doc.font("Helvetica");
    let subtotal = 0;

    lista.forEach((c) => {
      const valor = Number(c.valor) || 0;
      subtotal += valor;
      totalGeneral += valor;

      doc.text(c.factura, cols.factura.x, y, { width: cols.factura.width });
      doc.text(c.cargo_detalle || "N/A", cols.cargo.x, y, {
        width: cols.cargo.width,
      });
      doc.text(c.metodo_pago, cols.metodo.x, y, {
        width: cols.metodo.width,
      });
      doc.text(c.fecha_cargo, cols.fecha.x, y, {
        width: cols.fecha.width,
      });
      doc.text(`$ ${valor.toLocaleString("es-CO")}`, cols.valor.x, y, {
        width: cols.valor.width,
        align: "right",
      });

      y += 25;

      if (y > 760) {
        doc.addPage();
        y = 50;
      }
    });

    // Subtotal
    y += 6;
    doc.moveTo(cols.cargo.x, y).lineTo(555, y).stroke();
    y += 8;

    doc.font("Helvetica-Bold");
    doc.text("SUBTOTAL:", cols.fecha.x, y, {
      width: cols.fecha.width,
      align: "right",
    });

    doc.text(`$ ${subtotal.toLocaleString("es-CO")}`, cols.valor.x, y, {
      width: cols.valor.width,
      align: "right",
    });

    y += 30;
  }

  doc.moveDown(2);
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#000")
    .text(`TOTAL: $ ${totalGeneral.toLocaleString("es-CO")}`, {
      align: "center",
    });

  doc.end();
  return doc;
}

module.exports = {
  generarPdfReporteCargos,
};
