const pool = require("../models/db");

async function calcularTotalReserva(numSolicitud) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `
      SELECT
        s.num_solicitud,
        d.cantidad_personas,
        DATEDIFF(s.fecha_check_out, s.fecha_check_in) AS noches,
        t.valor AS valor_noche,
        (DATEDIFF(s.fecha_check_out, s.fecha_check_in) * t.valor * d.cantidad_personas) AS total
      FROM solicitudes_alojamiento s
      JOIN solicitudes_alojamiento_det d
        ON d.num_solicitud = s.num_solicitud
      JOIN acomodaciones a
        ON a.id_acomodacion = d.id_acomodacion
      JOIN tarifas t
        ON t.id_acomodacion = a.id_acomodacion
      WHERE s.num_solicitud = ?
        AND NOW() BETWEEN t.fecha_desde AND t.fecha_hasta
      `,
      [numSolicitud],
    );

    if (rows.length === 0) {
      throw new Error("No se pudo calcular la tarifa para la reserva");
    }

    return rows[0];
  } finally {
    conn.release();
  }
}

async function aplicarPagoParcial(numSolicitud, id_solicitud_det, valorPago) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1️⃣ Bloquear reserva
    const [[reserva]] = await conn.execute(
      `
      SELECT total_pago, monto_pagado, estado
      FROM solicitudes_alojamiento
      WHERE num_solicitud = ?
      FOR UPDATE
      `,
      [numSolicitud],
    );

    if (!reserva) {
      throw new Error("Solicitud no encontrada");
    }

    if (reserva.estado !== "PENDIENTE_PAGO") {
      throw new Error("La reserva no admite pagos");
    }

    const total = Number(reserva.total_pago);
    const pagado = Number(reserva.monto_pagado) || 0;
    const nuevoPagado = pagado + Number(valorPago);

    if (nuevoPagado > total) {
      throw new Error("El pago supera el total de la reserva");
    }

    // 2️⃣ Crear factura parcial
    const numFactura = `FAC-P-${Date.now()}`;

    await conn.execute(
      `
      INSERT INTO factura_cobro
      (num_factura, id_solicitud_det, fecha_emision, hora_emision,
       tipo_factura, subtotal_factura, total_factura, estado_pago, metodo_pago)
      VALUES (?, ?, NOW(), CURTIME(), 'P', ?, ?, 'PAGA', 'EFECTIVO')
      `,
      [numFactura, id_solicitud_det, valorPago, valorPago],
    );

    // 3️⃣ Crear recaudo
    await conn.execute(
      `
      INSERT INTO recaudos
      (factura, fecha_transaccion, valor, concepto, resp_estado)
      VALUES (?, NOW(), ?, 'Pago parcial de reserva', 'APROBADO')
      `,
      [numFactura, valorPago],
    );

    // 4️⃣ Actualizar reserva
    await conn.execute(
      `
      UPDATE solicitudes_alojamiento
      SET monto_pagado = ?, fecha_actualizacion = NOW()
      WHERE num_solicitud = ?
      `,
      [nuevoPagado, numSolicitud],
    );

    await conn.commit();

    return {
      numSolicitud,
      pagoAplicado: valorPago,
      monto_pagado: nuevoPagado,
      saldo_pendiente: total - nuevoPagado,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  calcularTotalReserva,
  aplicarPagoParcial,
};
