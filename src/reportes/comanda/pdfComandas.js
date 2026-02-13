const PDFDocument = require("pdfkit");

function generarPdfReporteComandas(comandas) {
  const doc = new PDFDocument({ size: "A4", margin: 40 });

  const fechaImpresion = new Date().toLocaleString("es-CO", {
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
    .text("REPORTE DE COMANDAS POR HABITACIÓN", { align: "center" });

  doc.moveDown(0.5);
  doc.fontSize(10).font("Helvetica").fillColor("#555");
  doc.text(`Fecha de impresión: ${fechaImpresion}`, { align: "center" });

  doc.moveDown(1);
  doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown(1);

  /* =========================
     COLUMNAS
  ========================= */
  const startX = 40;
  const cols = {
    habitacion: { x: startX, width: 70 },
    fecha: { x: startX + 80, width: 90 },
    item: { x: startX + 180, width: 160 },
    cantidad: { x: startX + 350, width: 60 },
    valor: { x: startX + 420, width: 90 },
  };

  let y = doc.y;

  // Header tabla
  doc.font("Helvetica-Bold").fontSize(10);
  doc.text("Hab.", cols.habitacion.x, y);
  doc.text("Fecha", cols.fecha.x, y);
  doc.text("Producto", cols.item.x, y);
  doc.text("Cant.", cols.cantidad.x, y);
  doc.text("Valor", cols.valor.x, y, { align: "right" });

  y += 14;
  doc.moveTo(startX, y).lineTo(555, y).stroke();
  y += 8;

  /* =========================
     FILAS
  ========================= */
  doc.font("Helvetica").fontSize(9);

  let totalGeneral = 0;

  comandas.forEach((c) => {
    const subtotal = Number(c.cantidad) * Number(c.valor_unitario);
    totalGeneral += subtotal;

    doc.text(c.numero_habitacion, cols.habitacion.x, y);
    doc.text(
      new Date(c.fecha_pedido).toLocaleDateString("es-CO"),
      cols.fecha.x,
      y,
    );
    doc.text(c.detalle, cols.item.x, y);
    doc.text(c.cantidad, cols.cantidad.x, y);
    doc.text(`$ ${subtotal.toLocaleString("es-CO")}`, cols.valor.x, y, {
      align: "right",
    });

    y += 18;

    if (y > 760) {
      doc.addPage();
      y = 50;
    }
  });

  /* =========================
     TOTAL
  ========================= */
  doc.moveDown(2);
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(`TOTAL COMANDAS: $ ${totalGeneral.toLocaleString("es-CO")}`, {
      align: "center",
    });

  doc.end();
  return doc;
}

module.exports = {
  generarPdfReporteComandas,
};
