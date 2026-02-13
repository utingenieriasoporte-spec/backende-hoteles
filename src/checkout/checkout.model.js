const db = require("../../db");

async function obtenerEstadoSolicitudPorNumeroSolicitud(numSolicitud) {
  const [rows] = await db.execute(
    `
    SELECT sa.estado , ah.id_asignacion 
FROM asignaciones_habitacion ah
JOIN solicitudes_alojamiento_det sad 
ON ah.id_solicitud_det = sad.id_solicitud_det
JOIN solicitudes_alojamiento sa 
ON sad.num_solicitud = sa.num_solicitud
WHERE sa.num_solicitud = ?
    `,
    [numSolicitud],
  );

  return rows[0] || null;
}

async function crearCheckOut(data) {
  const { id_asignacion_habitacion, procesado_por, auto_checkout, estado } =
    data;
  console.log(JSON.stringify(data));
  const [result] = await db.execute(
    `
    INSERT INTO check_outs (
      id_asignacion_habitacion,
      procesado_por,
      auto_checkout,
      hora_checkout,
      estado,
      fecha_creacion
    )
    VALUES (?, ?, 0, NOW(), ?, NOW())
    `,
    [id_asignacion_habitacion, procesado_por, estado],
  );

  const [numReserva] = await db.execute(
    `SELECT sa.num_solicitud, sad.id_solicitud_det, ah.id_asignacion
FROM solicitudes_alojamiento sa
JOIN solicitudes_alojamiento_det sad
ON sa.num_solicitud = sad.num_solicitud
JOIN asignaciones_habitacion ah
ON ah.id_solicitud_det = sad.id_solicitud_det
WHERE ah.id_asignacion = ?`,
    [id_asignacion_habitacion],
  );

  if (!numReserva) {
    throw new Error("No hay reservas asignadas");
  }

  await db.execute(
    `
    UPDATE solicitudes_alojamiento
    SET
      estado = "CHECKOUT"
    WHERE num_solicitud = ?
    `,
    [numReserva[0].num_solicitud],
  );

  return result.insertId;
}

async function actualizarLimpiezaAsignacion(idAsignacion, personaLimpieza) {
  const [result] = await db.execute(
    `
    UPDATE asignaciones_habitacion
    SET
      fecha_limpieza = NOW(),
      persona_limpieza = ?,
      fecha_finalizacion_limpieza = NULL
    WHERE id_asignacion = ?
    `,
    [personaLimpieza, idAsignacion],
  );

  return result.affectedRows;
}

module.exports = {
  obtenerEstadoSolicitudPorNumeroSolicitud,
  crearCheckOut,
  actualizarLimpiezaAsignacion,
};
