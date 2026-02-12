const PDFDocument = require("pdfkit");

function generarPdfRecaudos(recaudos, fechaDesde, fechaHasta) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
  });

  const fechaImpresion = new Date();

  const fechaFormateada = fechaImpresion.toLocaleString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const operadorNombre = recaudos[0]?.razon_social || "N/A";

  /* =========================
     ENCABEZADO
  ========================= */
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("REPORTE DE RECAUDOS", { align: "center" });

  doc.moveDown(0.5);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#555")
    .text(`Operador: ${operadorNombre}`, { align: "center" });

  doc.text(`Fecha de impresión: ${fechaFormateada}`, { align: "center" });
  doc.text(`Fecha del reporte: ${fechaDesde} al ${fechaHasta}`, {
    align: "center",
  });

  doc.moveDown(1.5);
  doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor("#aaa").stroke();
  doc.moveDown(1);

  /* =========================
     CONFIG COLUMNAS
  ========================= */
  const startX = 40;
  const cols = {
    factura: { x: startX, width: 90 },
    hora: { x: startX + 90, width: 60 },
    cliente: { x: startX + 150, width: 220 },
    valor: { x: startX + 370, width: 145 },
  };

  let y = doc.y;

  /* =========================
     AGRUPAR POR MÉTODO
  ========================= */
  const recaudosPorMetodo = recaudos.reduce((acc, r) => {
    const metodo = r.metodo_pago || "SIN MÉTODO";
    if (!acc[metodo]) acc[metodo] = [];
    acc[metodo].push(r);
    return acc;
  }, {});

  /* =========================
     TABLAS POR MÉTODO
  ========================= */
  for (const metodo in recaudosPorMetodo) {
    const lista = recaudosPorMetodo[metodo];

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#000")
      .text(`Método de pago: ${metodo}`, startX, y);

    y += 18;

    // Header
    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Factura", cols.factura.x, y, { width: cols.factura.width });
    doc.text("Hora", cols.hora.x, y, { width: cols.hora.width });
    doc.text("Cliente", cols.cliente.x, y, { width: cols.cliente.width });
    doc.text("Valor", cols.valor.x, y, {
      width: cols.valor.width,
      align: "right",
    });

    y += 14;
    doc.moveTo(startX, y).lineTo(555, y).stroke();
    y += 6;

    doc.font("Helvetica");

    let totalMetodo = 0;

    lista.forEach((r) => {
      const valor = Number(r.valor) || 0;
      totalMetodo += valor;

      doc.text(r.factura, cols.factura.x, y, {
        width: cols.factura.width,
      });

      doc.text(r.hora_transaccion || "--:--", cols.hora.x, y, {
        width: cols.hora.width,
      });

      doc.text(r.nombre_cliente || "N/A", cols.cliente.x, y, {
        width: cols.cliente.width,
      });

      doc.text(`$ ${valor.toLocaleString("es-CO")}`, cols.valor.x, y, {
        width: cols.valor.width,
        align: "right",
      });

      y += 14;

      if (y > 760) {
        doc.addPage();
        y = 50;
      }
    });

    // Total por método
    y += 6;
    doc.moveTo(cols.cliente.x, y).lineTo(555, y).stroke();
    y += 8;

    doc.font("Helvetica-Bold");
    doc.text("SUBTOTAL:", cols.cliente.x, y, {
      width: cols.cliente.width,
      align: "right",
    });

    doc.text(`$ ${totalMetodo.toLocaleString("es-CO")}`, cols.valor.x, y, {
      width: cols.valor.width,
      align: "right",
    });

    y += 30;

    if (y > 740) {
      doc.addPage();
      y = 50;
    }
  }

  /* =========================
     TOTAL GENERAL (GRANDE, AL FINAL)
  ========================= */
  const totalGeneral = recaudos.reduce((acc, r) => {
    return acc + (Number(r.valor) || 0);
  }, 0);

  doc.moveDown(2);

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#000")
    .text(`TOTAL: $ ${totalGeneral.toLocaleString("es-CO")}`, {
      align: "center",
    });

  doc.moveDown(3);

  doc.end();
  return doc;
}

module.exports = {
  generarPdfRecaudos,
};
