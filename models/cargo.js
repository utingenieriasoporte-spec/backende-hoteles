const db = require("./db");

async function crearCargo(data) {
  const [result] = await db.execute(
    `INSERT INTO cargos
     (id_asignacion_habitacion, ref_concepto, observaciones, monto_abonado, total, estado, fecha_creacion)
     VALUES (?, ?, ?, ?, ?, 'PENDIENTE_PAGO', NOW())`,
    [
      data.id_asignacion_habitacion,
      data.ref_concepto,
      data.observaciones,
      data.monto_abonado || 0,
      data.total,
    ],
  );
  return result.insertId;
}

async function obtenerCargos() {
  const [rows] = await db.execute(
    `SELECT 
c.id_cargo, 
c.observaciones, 
c.monto_abonado, 
c.total, 
c.estado,
ah.id_solicitud_det,
h.numero_habitacion,
ah.id_asignacion,
ah.fecha_desde,
ah.fecha_asignacion,
ah.fecha_hasta,
h.piso,
con.detalle,
sad.num_solicitud
FROM cargos c 
JOIN asignaciones_habitacion ah
ON c.id_asignacion_habitacion = ah.id_asignacion
JOIN habitaciones h
ON ah.id_habitacion = h.id_habitacion
JOIN config con
ON con.codigo = c.ref_concepto
JOIN solicitudes_alojamiento_det sad
ON ah.id_solicitud_det = sad.id_solicitud_det;
`,
  );
  return rows;
}

async function listarCargosPorAsignacion(idAsignacion) {
  const [rows] = await db.execute(
    `SELECT 
      c.id_cargo, 
      c.observaciones, 
      c.monto_abonado, 
      c.total, 
      c.estado,
      ah.id_solicitud_det,
      h.numero_habitacion,
      ah.id_asignacion,
      ah.fecha_desde,
      ah.fecha_asignacion,
      ah.fecha_hasta,
      h.piso,
      con.detalle,
      sad.num_solicitud
    FROM cargos c 
    JOIN asignaciones_habitacion ah
      ON c.id_asignacion_habitacion = ah.id_asignacion
    JOIN habitaciones h
      ON ah.id_habitacion = h.id_habitacion
    JOIN config con
      ON con.codigo = c.ref_concepto
    JOIN solicitudes_alojamiento_det sad
      ON ah.id_solicitud_det = sad.id_solicitud_det
    WHERE ah.id_asignacion = ?`,
    [idAsignacion],
  );
  return rows;
}

async function listarCargosPorIdTitular(idTitular) {
  const [rows] = await db.execute(
    `SELECT 
  c.id_cargo,
  c.observaciones,
  c.monto_abonado,
  c.total,
  c.estado,
  ah.id_solicitud_det,
  h.numero_habitacion,
  ah.id_asignacion,
  ah.fecha_desde,
  ah.fecha_asignacion,
  ah.fecha_hasta,
  h.piso,
  con.detalle,
  sa.num_solicitud,
  sa.id_titular
FROM solicitudes_alojamiento sa
JOIN solicitudes_alojamiento_det sad
  ON sa.num_solicitud = sad.num_solicitud
JOIN asignaciones_habitacion ah
  ON ah.id_solicitud_det = sad.id_solicitud_det
JOIN cargos c
  ON c.id_asignacion_habitacion = ah.id_asignacion
JOIN config con
  ON con.codigo = c.ref_concepto
 AND con.entidad = 'CONCEPTO'
JOIN habitaciones h
  ON h.id_habitacion = ah.id_habitacion
WHERE sa.id_titular = ?;`,
    [idTitular],
  );
  return rows;
}

async function obtenerCargoPorId(idCargo) {
  const [rows] = await db.execute(
    `SELECT 
      c.id_cargo, 
      c.observaciones, 
      c.monto_abonado, 
      c.total, 
      c.estado,
      ah.id_solicitud_det,
      h.numero_habitacion,
      ah.id_asignacion,
      ah.fecha_desde,
      ah.fecha_asignacion,
      ah.fecha_hasta,
      h.piso,
      con.detalle,
      sad.num_solicitud
    FROM cargos c 
    JOIN asignaciones_habitacion ah
      ON c.id_asignacion_habitacion = ah.id_asignacion
    JOIN habitaciones h
      ON ah.id_habitacion = h.id_habitacion
    JOIN config con
      ON con.codigo = c.ref_concepto
    JOIN solicitudes_alojamiento_det sad
      ON ah.id_solicitud_det = sad.id_solicitud_det
    WHERE c.id_cargo = ?`,
    [idCargo],
  );
  return rows[0];
}

async function actualizarCargo(idCargo, data) {
  await db.execute(
    `UPDATE cargos
     SET ref_concepto = ?,
         observaciones = ?,
         monto_abonado = ?,
         total = ?,
         estado = ?,
         fecha_actualizacion = NOW()
     WHERE id_cargo = ?`,
    [
      data.ref_concepto,
      data.observaciones,
      data.monto_abonado,
      data.total,
      data.estado,
      idCargo,
    ],
  );
}

async function cancelarCargo(idCargo) {
  await db.execute(
    `UPDATE cargos
     SET estado = 'CANCELADO',
         fecha_actualizacion = NOW()
     WHERE id_cargo = ?`,
    [idCargo],
  );
}

async function obtenerFacturaExistente(conn, idSolicitudDet) {
  const [[factura]] = await conn.query(
    `
    SELECT num_factura, total_factura, estado_pago
    FROM factura_cobro
    WHERE id_solicitud_det = ?
      AND estado_pago <> 'NO_PAGA'
    LIMIT 1
    `,
    [idSolicitudDet],
  );

  return factura;
}
async function generarCargosPorTitular(conn, idTitular, idSolicitudDet) {
  // usa la MISMA transacción
  const [reservas] = await conn.query(
    `
    SELECT
  sa.num_solicitud,
  sad.id_solicitud_det,
  sa.total_pago,
  sa.monto_pagado,
  (sa.total_pago - IFNULL(sa.monto_pagado,0)) AS saldo,
  ah.id_asignacion
FROM solicitudes_alojamiento_det sad
JOIN asignaciones_habitacion ah ON ah.id_solicitud_det = sad.id_solicitud_det
JOIN solicitudes_alojamiento sa ON sa.num_solicitud = sad.num_solicitud
WHERE sa.id_titular = ?
AND sad.id_solicitud_det = ?
  AND sa.estado = 'PENDIENTE_PAGO'
  AND (sa.total_pago - IFNULL(sa.monto_pagado,0)) > 0;
    `,
    [idTitular, idSolicitudDet],
  );

  for (const r of reservas) {
    await conn.query(
      `
      INSERT INTO cargos
      (id_asignacion_habitacion, ref_concepto, total, monto_abonado, estado, fecha_creacion)
      VALUES (?, 'C001', ?, 0, 'PENDIENTE_PAGO', NOW())
      `,
      [r.id_asignacion, r.saldo],
    );
  }

  const [cargos] = await conn.query(
    `
    SELECT 
  c.id_cargo,
  c.observaciones,
  c.monto_abonado,
  c.total,
  c.estado,
  ah.id_solicitud_det,
  h.numero_habitacion,
  ah.id_asignacion,
  ah.fecha_desde,
  ah.fecha_asignacion,
  ah.fecha_hasta,
  h.piso,
  con.detalle,
  sa.num_solicitud,
  sa.id_titular
FROM solicitudes_alojamiento sa
JOIN solicitudes_alojamiento_det sad
  ON sa.num_solicitud = sad.num_solicitud
JOIN asignaciones_habitacion ah
  ON ah.id_solicitud_det = sad.id_solicitud_det
JOIN cargos c
  ON c.id_asignacion_habitacion = ah.id_asignacion
JOIN config con
  ON con.codigo = c.ref_concepto
 AND con.entidad = 'CONCEPTO'
JOIN habitaciones h
  ON h.id_habitacion = ah.id_habitacion
WHERE sa.id_titular = ? 
AND sad.id_solicitud_det = ?;
    `,
    [idTitular, idSolicitudDet],
  );

  return cargos;
}

async function obtenerTotalCargos(conn, idSolicitudDet) {
  const [[row]] = await conn.query(
    `
    SELECT IFNULL(SUM(c.total - c.monto_abonado),0) AS total
    FROM cargos c
    INNER JOIN asignaciones_habitacion ah
      ON ah.id_asignacion = c.id_asignacion_habitacion
    WHERE ah.id_solicitud_det = ?
      AND c.estado = 'PENDIENTE'
    `,
    [idSolicitudDet],
  );

  return Number(row.total || 0);
}

async function obtenerCargosPorNumReserva(numReserva) {
  const [rows] = await db.execute(
    `SELECT 
  c.id_cargo,
  c.observaciones,
  c.monto_abonado,
  c.total,
  c.estado,
  ah.id_solicitud_det,
  h.numero_habitacion,
  ah.id_asignacion,
  ah.fecha_desde,
  ah.fecha_asignacion,
  ah.fecha_hasta,
  h.piso,
  con.detalle,
  sad.num_solicitud
FROM solicitudes_alojamiento sa
JOIN solicitudes_alojamiento_det sad
  ON sa.num_solicitud = sad.num_solicitud
JOIN asignaciones_habitacion ah
  ON ah.id_solicitud_det = sad.id_solicitud_det
JOIN cargos c
  ON c.id_asignacion_habitacion = ah.id_asignacion
JOIN config con
	ON con.codigo = c.ref_concepto
	AND con.entidad = 'CONCEPTO'
JOIN habitaciones h
  ON h.id_habitacion = ah.id_habitacion
WHERE sa.num_solicitud = ?`,
    [numReserva],
  );
  return rows[0];
}

module.exports = {
  crearCargo,
  obtenerFacturaExistente,
  listarCargosPorAsignacion,
  obtenerCargoPorId,
  actualizarCargo,
  cancelarCargo,
  obtenerCargos,
  listarCargosPorIdTitular,
  generarCargosPorTitular,
  obtenerTotalCargos,
  obtenerCargosPorNumReserva,
};
