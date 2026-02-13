const PDFDocument = require("pdfkit");

function generarPdfReporteHuespedes(huespedes, fechaDesde, fechaHasta) {
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
    .text("REPORTE DE HUÉSPEDES CHECK-IN", { align: "center" });

  doc.moveDown(0.5);
  doc.fontSize(10).font("Helvetica").fillColor("#555");
  doc.text(`Fecha de impresión: ${fechaImpresion}`, { align: "center" });
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
    tipo: { x: startX, width: 40 },
    doc: { x: startX + 45, width: 80 },
    nombre: { x: startX + 130, width: 140 },
    habitacion: { x: startX + 340, width: 55 },
    solicitud: { x: startX + 400, width: 70 },
    total: { x: startX + 475, width: 60 },
  };

  let y = doc.y;

  /* =========================
     HEADER TABLA
  ========================= */
  doc.font("Helvetica-Bold").fontSize(9);

  doc.text("Tipo", cols.tipo.x, y);
  doc.text("Documento", cols.doc.x, y);
  doc.text("Nombre", cols.nombre.x, y);
  doc.text("Hab.", cols.habitacion.x, y);
  doc.text("Solicitud", cols.solicitud.x, y);
  doc.text("Total", cols.total.x, y, { align: "right" });

  y += 14;
  doc.moveTo(startX, y).lineTo(555, y).stroke();
  y += 8;

  /* =========================
     FILAS
  ========================= */
  doc.font("Helvetica").fontSize(8);

  huespedes.forEach((h) => {
    doc.text(h.tipo_identificacion, cols.tipo.x, y);
    doc.text(h.doc_identificacion, cols.doc.x, y);
    doc.text(h.nombre_completo, cols.nombre.x, y);
    doc.text(h.numero_habitacion || "-", cols.habitacion.x, y);
    doc.text(h.num_solicitud, cols.solicitud.x, y);
    doc.text(
      `$${Number(h.total_pago || 0).toLocaleString("es-CO")}`,
      cols.total.x,
      y,
      { align: "right" },
    );

    y += 16;

    if (y > 760) {
      doc.addPage();
      y = 50;
    }
  });

  /* =========================
     FOOTER
  ========================= */
  doc.moveDown(2);
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#000")
    .text(`TOTAL HUÉSPEDES: ${huespedes.length}`, {
      align: "center",
    });

  doc.end();
  return doc;
}

function generarPdfHuespedesActuales(huespedes, fecha) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
  });

  const fechaImpresion = new Date().toLocaleString("es-CO");

  /* =========================
     ENCABEZADO
  ========================= */

  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("REPORTE DE HUÉSPEDES ALOJADOS", { align: "center" });

  doc.moveDown();

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Fecha del reporte: ${fecha}`, { align: "center" });

  doc.text(`Fecha de impresión: ${fechaImpresion}`, { align: "center" });

  doc.moveDown(1.5);
  doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown();

  /* =========================
     TABLA
  ========================= */

  const startX = 40;
  let y = doc.y;

  const cols = {
    habitacion: { x: startX, width: 50 },
    nombre: { x: startX + 50, width: 160 },
    documento: { x: startX + 160, width: 90 },
    genero: { x: startX + 230, width: 50 },
    solicitud: { x: startX + 360, width: 80 },
    pago: { x: startX + 430, width: 80 },
  };

  doc.fontSize(9).font("Helvetica-Bold");

  doc.text("Hab.", cols.habitacion.x, y);
  doc.text("Nombre", cols.nombre.x, y);
  doc.text("Doc.", cols.documento.x, y);
  doc.text("Género", cols.genero.x, y);
  doc.text("Solicitud", cols.solicitud.x, y);
  doc.text("Estado Pago", cols.pago.x, y);

  y += 14;
  doc.moveTo(startX, y).lineTo(555, y).stroke();
  y += 6;

  doc.font("Helvetica");

  huespedes.forEach((h) => {
    doc.text(h.numero_habitacion, cols.habitacion.x, y);
    doc.text(h.nombre_completo, cols.nombre.x, y, {
      width: cols.nombre.width,
    });
    doc.text(h.doc_identificacion, cols.documento.x, y);
    doc.text(h.ref_genero || "-", cols.genero.x, y);
    doc.text(h.num_solicitud, cols.solicitud.x, y);
    doc.text(h.estado_pago, cols.pago.x, y);

    y += 14;

    if (y > 760) {
      doc.addPage();
      y = 50;
    }
  });

  doc.end();
  return doc;
}

function generarPdfHuespedesRango(huespedes, fechaDesde, fechaHasta) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
  });

  const fechaImpresion = new Date().toLocaleString("es-CO");

  /* =========================
     ENCABEZADO
  ========================= */

  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("REPORTE DE HUÉSPEDES POR RANGO", { align: "center" });

  doc.moveDown();

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Periodo: ${fechaDesde} al ${fechaHasta}`, { align: "center" });

  doc.text(`Fecha de impresión: ${fechaImpresion}`, { align: "center" });

  doc.moveDown(1.5);
  doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown();

  /* =========================
     TABLA
  ========================= */

  const startX = 40;
  let y = doc.y;

  const cols = {
    habitacion: { x: startX, width: 50 },
    nombre: { x: startX + 50, width: 150 },
    documento: { x: startX + 200, width: 80 },
    ingreso: { x: startX + 280, width: 70 },
    salida: { x: startX + 350, width: 70 },
    estado: { x: startX + 420, width: 80 },
  };

  doc.fontSize(9).font("Helvetica-Bold");

  doc.text("Hab.", cols.habitacion.x, y);
  doc.text("Nombre", cols.nombre.x, y);
  doc.text("Doc.", cols.documento.x, y);
  doc.text("Check-In", cols.ingreso.x, y);
  doc.text("Check-Out", cols.salida.x, y);
  doc.text("Estado", cols.estado.x, y);

  y += 14;
  doc.moveTo(startX, y).lineTo(555, y).stroke();
  y += 6;

  doc.font("Helvetica");

  huespedes.forEach((h) => {
    doc.text(h.numero_habitacion, cols.habitacion.x, y);
    doc.text(h.nombre_completo, cols.nombre.x, y, {
      width: cols.nombre.width,
    });
    doc.text(h.doc_identificacion, cols.documento.x, y);
    doc.text(h.fecha_check_in?.toISOString().split("T")[0], cols.ingreso.x, y);
    doc.text(h.fecha_check_out?.toISOString().split("T")[0], cols.salida.x, y);
    doc.text(h.estado, cols.estado.x, y);

    y += 14;

    if (y > 760) {
      doc.addPage();
      y = 50;
    }
  });

  doc.moveDown(2);

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(`Total huéspedes en el periodo: ${huespedes.length}`, {
      align: "center",
    });

  doc.end();
  return doc;
}

module.exports = {
  generarPdfReporteHuespedes,
  generarPdfHuespedesActuales,
  generarPdfHuespedesRango,
};
