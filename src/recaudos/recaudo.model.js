const pool = require("../../db");

async function crearFactura(conn, { cargos }) {
  // Validar y calcular total de la factur
  let totalFactura = 0;

  for (const cargo of cargos) {
    if (!cargo.id_cargo || typeof cargo.total !== "number") {
      throw new Error("Cada cargo debe tener id_cargo y total como número");
    }
    totalFactura += cargo.total;
  }

  if (totalFactura <= 0) {
    throw new Error("No hay saldo pendiente para facturar");
  }

  // Crear número de factura
  const numFactura = `FAC-${Date.now()}`;

  // Insertar la factura
  await conn.query(
    `
    INSERT INTO factura_cobro
    (num_factura, fecha_emision, hora_emision,
     tipo_factura, subtotal_factura, total_factura, estado_pago, metodo_pago)
    VALUES (?, NOW(), CURTIME(), 'E', ?, ?, 'NO_PAGA', ?)
    `,
    [numFactura, totalFactura, totalFactura, "EFECTIVO"],
  );

  // Marcar los cargos como facturados
  for (const cargo of cargos) {
    await conn.query(
      `
      UPDATE cargos
      SET num_factura = ?
      WHERE id_cargo = ?
      `,
      [numFactura, cargo.id_cargo],
    );

    await conn.query(
      `
    INSERT INTO factura_cobro_det
    (num_factura, id_cargo)
    VALUES (?, ?)
    `,
      [numFactura, cargo.id_cargo],
    );
  }

  return {
    numFactura,
    totalFactura,
    facturadoCargos: cargos.map((c) => c.id_cargo),
  };
}

async function crearRecaudo(
  conn,
  {
    numFactura,
    idClienteDet,
    nombreCliente,
    correo,
    telefono,
    concepto,
    ref1,
    ref2,
    valor,
    respCus,
    respBanco,
    ref_operador,
    metodo_pago,
    cargos, // 👈 NUEVO (array opcional)
  },
) {
  // 1️⃣ Obtener factura
  const [facturaRows] = await conn.query(
    `
    SELECT total_factura, estado_pago
    FROM factura_cobro
    WHERE num_factura = ?
    LIMIT 1
    `,
    [numFactura],
  );

  const factura = facturaRows[0];

  if (!factura) throw new Error("Factura no encontrada");
  if (factura.estado_pago === "PAGA")
    throw new Error("La factura ya está pagada");

  // 2️⃣ Obtener saldo pendiente TOTAL
  const [saldoRows] = await conn.query(
    `
    SELECT 
      SUM(c.total - COALESCE(c.monto_abonado, 0)) AS saldo_pendiente
    FROM factura_cobro_det fd
    JOIN cargos c ON c.id_cargo = fd.id_cargo
    WHERE fd.num_factura = ?
    `,
    [numFactura],
  );

  const saldoPendiente = Number(saldoRows[0]?.saldo_pendiente || 0);

  if (Number(valor) > saldoPendiente) {
    throw new Error(
      `No se puede pagar con un monto mayor al saldo pendiente (${saldoPendiente})`,
    );
  }

  // 3️⃣ Pago parcial o total
  const cargosParcial = Array.isArray(cargos) ? cargos : [];

  if (cargosParcial.length > 0) {
    let totalAplicado = 0;

    for (const c of cargosParcial) {
      if (!c.id_cargo || !c.monto) {
        throw new Error("Cada cargo debe tener id_cargo y monto");
      }

      const [cargoRows] = await conn.query(
        `
        SELECT total, COALESCE(monto_abonado, 0) AS abonado
        FROM cargos
        WHERE id_cargo = ? AND num_factura = ?
        `,
        [c.id_cargo, numFactura],
      );

      if (!cargoRows.length) {
        throw new Error(`El cargo ${c.id_cargo} no pertenece a la factura`);
      }

      const saldoCargo = cargoRows[0].total - cargoRows[0].abonado;

      if (Number(c.monto) > saldoCargo) {
        throw new Error(`El monto supera el saldo del cargo ${c.id_cargo}`);
      }

      totalAplicado += Number(c.monto);
    }

    if (totalAplicado !== Number(valor)) {
      throw new Error(
        "La suma de los cargos no coincide con el valor del recaudo",
      );
    }

    for (const c of cargosParcial) {
      await conn.query(
        `
        UPDATE cargos
        SET 
          monto_abonado = COALESCE(monto_abonado, 0) + ?,
          fecha_actualizacion = NOW()
        WHERE id_cargo = ?
        `,
        [c.monto, c.id_cargo],
      );

      await conn.query(
        `
        UPDATE cargos
        SET estado = CASE
          WHEN monto_abonado >= total THEN 'PAGADO'
          ELSE 'PENDIENTE_PAGO'
        END
        WHERE id_cargo = ?
        `,
        [c.id_cargo],
      );
    }
  }

  if (cargosParcial.length === 0) {
    await conn.query(
      `
      UPDATE cargos
      SET 
        monto_abonado = total,
        estado = 'PAGADO',
        fecha_actualizacion = NOW()
      WHERE num_factura = ?
      `,
      [numFactura],
    );
  }

  // 4️⃣ Insertar recaudo
  await conn.query(
    `
    INSERT INTO recaudos
    (factura, id_cliente, nombre_cliente, correo, telefono,
     fecha_transaccion, ref1, ref2, valor, concepto,
     resp_estado, resp_cus, resp_banco, resp_fecha_rb, ref_operador, metodo_pago)
    VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, 'APROBADO', ?, ?, NOW(), ?, ?)
    `,
    [
      numFactura,
      idClienteDet,
      nombreCliente,
      correo,
      telefono,
      ref1,
      ref2,
      valor,
      concepto || "Pago reserva + cargos",
      respCus,
      respBanco,
      ref_operador,
      metodo_pago,
    ],
  );

  // 5️⃣ Verificar si la factura quedó paga
  const [pendienteRows] = await conn.query(
    `
    SELECT SUM(total - COALESCE(monto_abonado, 0)) AS pendiente
    FROM cargos
    WHERE num_factura = ?
    `,
    [numFactura],
  );

  if (Number(pendienteRows[0]?.pendiente || 0) === 0) {
    await conn.query(
      `
      UPDATE factura_cobro
      SET estado_pago = 'PAGA'
      WHERE num_factura = ?
      `,
      [numFactura],
    );
  }

  // 6️⃣ 🔥 OBTENER SOLICITUD ASOCIADA A LA FACTURA
  const [solRows] = await conn.query(
    `
    SELECT sa.num_solicitud
    FROM factura_cobro fc
		JOIN factura_cobro_det fcd
		ON fcd.num_factura = fc.num_factura
		JOIN cargos c
		ON fcd.id_cargo = c.id_cargo
		JOIN asignaciones_habitacion ah
		ON ah.id_asignacion = c.id_asignacion_habitacion
    JOIN solicitudes_alojamiento_det sad
      ON ah.id_solicitud_det = sad.id_solicitud_det
    JOIN solicitudes_alojamiento sa
      ON sad.num_solicitud = sa.num_solicitud

    WHERE fc.num_factura = ? LIMIT 1
    `,
    [numFactura],
  );

  if (!solRows.length) {
    throw new Error("No se encontró la solicitud asociada a la factura");
  }

  const numSolicitud = solRows[0].num_solicitud;

  // 7️⃣ 🔥 VERIFICAR SI TODOS LOS CARGOS ESTÁN PAGADOS
  const [estadoCargos] = await conn.query(
    `
    SELECT
      COUNT(*) AS total_cargos,
      SUM(CASE WHEN c.estado = 'PAGADO' THEN 1 ELSE 0 END) AS cargos_pagados
    FROM solicitudes_alojamiento sa
    JOIN solicitudes_alojamiento_det sad
      ON sa.num_solicitud = sad.num_solicitud
    JOIN asignaciones_habitacion ah
      ON ah.id_solicitud_det = sad.id_solicitud_det
    JOIN cargos c
      ON c.id_asignacion_habitacion = ah.id_asignacion
    WHERE sa.num_solicitud = ?
    `,
    [numSolicitud],
  );

  const { total_cargos, cargos_pagados } = estadoCargos[0];

  // 8️⃣ 🔥 ACTUALIZAR ESTADO DE LA SOLICITUD
  const nuevoEstado =
    Number(total_cargos) === Number(cargos_pagados)
      ? "PAGADA"
      : "PENDIENTE_PAGO";

  await conn.query(
    `
    UPDATE solicitudes_alojamiento
    SET estado_pago = ?, fecha_actualizacion = NOW()
    WHERE num_solicitud = ?
    `,
    [nuevoEstado, numSolicitud],
  );

  return {
    message: "Recaudo registrado correctamente",
    saldoPendienteAntes: saldoPendiente,
    estadoSolicitud: nuevoEstado,
  };
}

// async function crearFacturaYRecaudo(data) {
//   const conn = await pool.getConnection();

//   try {
//     await conn.beginTransaction();

//     const {
//       idTitular,
//       numSolicitud,
//       idSolicitudDet,
//       tipoFactura,
//       idClienteDet,
//       nombreCliente,
//       correo,
//       telefono,
//       concepto,
//       ref1,
//       ref2,
//       respBanco,
//       respCus,
//       metodo_pago,
//       ref_operador,
//     } = data;

//     //  Generar cargos
//     if (idTitular) {
//       await cargosModel.generarCargosPorTitular(conn, idTitular);
//     }

//     //  Solicitud
//     const [[solicitud]] = await conn.query(
//       `
//       SELECT total_pago, monto_pagado, estado
//       FROM solicitudes_alojamiento
//       WHERE num_solicitud = ?
//       `,
//       [numSolicitud],
//     );

//     if (!solicitud) throw new Error("Solicitud no encontrada");
//     if (solicitud.estado !== "PENDIENTE_PAGO")
//       throw new Error("La solicitud no está pendiente de pago");

//     const totalReserva = Number(solicitud.total_pago);
//     const montoPagado = Number(solicitud.monto_pagado) || 0;
//     const saldoReserva = totalReserva - montoPagado;

//     if (saldoReserva <= 0)
//       throw new Error("La reserva ya está completamente pagada");

//     //  Cargos
//     const totalCargos = await cargosModel.obtenerTotalCargos(
//       conn,
//       idSolicitudDet,
//     );

//     const totalFinal = saldoReserva + totalCargos;

//     //  FACTURA
//     const numFactura = await crearFactura(conn, {
//       idSolicitudDet,
//       tipoFactura,
//       subtotal: saldoReserva,
//       total: totalFinal,
//       metodo_pago,
//     });

//     //  RECAUDO
//     await crearRecaudo(conn, {
//       numFactura,
//       idClienteDet,
//       nombreCliente,
//       correo,
//       telefono,
//       total: totalFinal,
//       concepto,
//       ref1,
//       ref2,
//       respCus,
//       respBanco,
//       ref_operador,
//     });

//     //  Marcar cargos pagados
//     await conn.query(
//       `
//       UPDATE cargos c
//       INNER JOIN asignaciones_habitacion ah
//         ON ah.id_asignacion = c.id_asignacion_habitacion
//       SET c.estado = 'PAGADO',
//           c.monto_abonado = c.total,
//           c.fecha_actualizacion = NOW()
//       WHERE ah.id_solicitud_det = ?
//         AND c.estado = 'PENDIENTE'
//       `,
//       [idSolicitudDet],
//     );

//     //  Actualizar solicitud
//     await conn.query(
//       `
//       UPDATE solicitudes_alojamiento
//       SET estado = 'PAGADO',
//           monto_pagado = total_pago,
//           fecha_actualizacion = NOW()
//       WHERE num_solicitud = ?
//       `,
//       [numSolicitud],
//     );

//     await conn.commit();

//     return {
//       success: true,
//       numFactura,
//       totalReserva,
//       totalCargos,
//       totalPagado: totalFinal,
//     };
//   } catch (error) {
//     await conn.rollback();
//     throw error;
//   } finally {
//     conn.release();
//   }
// }

async function obtenerTotalCargos(conn, idSolicitudDet) {
  const [[result]] = await conn.query(
    `
    SELECT COALESCE(SUM(c.total), 0) AS total_cargos
    FROM cargos c
    INNER JOIN asignaciones_habitacion ah
      ON ah.id_asignacion = c.id_asignacion_habitacion
    WHERE ah.id_solicitud_det = ?
      AND c.estado = 'PENDIENTE_PAGO'
    `,
    [idSolicitudDet],
  );

  return Number(result.total_cargos);
}

async function obtenerRecaudos() {
  const conn = await pool.getConnection();

  try {
    const [resultados] = await conn.query(`
      SELECT
          r.id_recaudo          AS idRecaudo,
          r.factura,
          r.fecha_transaccion  AS fechaTransaccion,
          r.valor,
          r.concepto,
          r.resp_estado        AS estado,

          r.id_cliente         AS idCliente,
          r.nombre_cliente     AS nombreCliente,
          r.correo,
          r.telefono,

          r.ref_operador       AS idOperador,
          p.nombre1            AS nombreOperador
      FROM recaudos r
      LEFT JOIN personas p
          ON p.id_persona = r.ref_operador
      ORDER BY r.fecha_transaccion DESC
    `);

    return resultados.map((r) => ({
      idRecaudo: r.idRecaudo,
      factura: r.factura,
      fechaTransaccion: r.fechaTransaccion,
      valor: r.valor,
      concepto: r.concepto,
      estado: r.estado,

      cliente: {
        id: r.idCliente,
        nombre: r.nombreCliente,
        correo: r.correo,
        telefono: r.telefono,
      },

      operador: {
        id: r.idOperador,
        nombre: r.nombreOperador,
      },
    }));
  } finally {
    conn.release();
  }
}

async function obtenerFacturas() {
  const [rows] = await pool.query(`SELECT
    fc.num_factura,
    fc.fecha_emision,
    fc.hora_emision,
    fc.tipo_factura,
    fc.total_factura,
    fc.estado_pago,

    -- TOTALES POR FACTURA
    SUM(c.total) OVER (PARTITION BY fc.num_factura) AS total_cargos,
    SUM(COALESCE(c.monto_abonado, 0)) OVER (PARTITION BY fc.num_factura) AS total_abonado,
    SUM(c.total - COALESCE(c.monto_abonado, 0)) OVER (PARTITION BY fc.num_factura) AS saldo_pendiente,

    -- 🔹 DETALLE CARGO
    c.id_cargo,
    sa.num_solicitud,
    c.ref_concepto,
    c.total,
    c.estado,
    COALESCE(c.monto_abonado, 0) AS monto_abonado,

    -- 🔹 TITULAR
    p.id_persona,
    CONCAT_WS(' ', p.nombre1, p.nombre2, p.apellido1, p.apellido2) AS nombre,
    pd.email,
    pd.telefono

FROM factura_cobro fc
JOIN factura_cobro_det fd 
  ON fd.num_factura = fc.num_factura
JOIN cargos c 
  ON c.id_cargo = fd.id_cargo
JOIN asignaciones_habitacion ah
  ON c.id_asignacion_habitacion = ah.id_asignacion
JOIN solicitudes_alojamiento_det sad
  ON ah.id_solicitud_det = sad.id_solicitud_det
JOIN solicitudes_alojamiento sa 
  ON sad.num_solicitud = sa.num_solicitud
JOIN personas p
  ON sa.id_titular = p.id_persona
JOIN personas_det pd
  ON p.id_persona = pd.id_persona
ORDER BY fc.num_factura;


`);
  return rows;
}

async function obtenerFacturaPorNumero(numFactura) {
  const [rows] = await pool.query(
    `SELECT
    fc.num_factura,
    fc.fecha_emision,
    fc.hora_emision,
    fc.tipo_factura,
    fc.subtotal_factura,
    fc.total_factura,
    fc.estado_pago,

    SUM(c.total) AS total_cargos,
    SUM(COALESCE(c.monto_abonado, 0)) AS total_abonado,
    SUM(c.total - COALESCE(c.monto_abonado, 0)) AS saldo_pendiente

FROM factura_cobro fc
JOIN factura_cobro_det fd ON fd.num_factura = fc.num_factura
JOIN cargos c ON c.id_cargo = fd.id_cargo
WHERE fc.num_factura = ?
GROUP BY
    fc.num_factura,
    fc.fecha_emision,
    fc.hora_emision,
    fc.tipo_factura,
    fc.subtotal_factura,
    fc.total_factura,
    fc.estado_pago;`,
    [numFactura],
  );
  return rows[0];
}

async function obtenerCargosPorFactura(numFactura) {
  const [rows] = await pool.query(
    `
    SELECT
      c.id_cargo,
      c.id_asignacion_habitacion,
      c.ref_concepto,
      c.observaciones,
      c.total,
      COALESCE(c.monto_abonado, 0) AS monto_abonado,
      (c.total - COALESCE(c.monto_abonado, 0)) AS saldo_pendiente,
      c.estado,
      c.fecha_creacion,
      c.fecha_actualizacion
    FROM factura_cobro_det fd
    JOIN cargos c 
      ON c.id_cargo = fd.id_cargo
    WHERE fd.num_factura = ?
    `,
    [numFactura],
  );

  return rows;
}

module.exports = {
  crearRecaudo,
  crearFactura,
  obtenerTotalCargos,
  obtenerRecaudos,
  obtenerFacturas,
  obtenerFacturaPorNumero,
  obtenerCargosPorFactura,
};
