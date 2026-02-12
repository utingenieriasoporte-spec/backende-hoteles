const db = require("./db");

async function crearCheckIn({
  idAsignacionHabitacion,
  procesadoPor,
  autoCheckin,
  horaCheckin,
}) {
  const [result] = await db.execute(
    `INSERT INTO check_ins
     (id_asignacion_habitacion, procesado_por, auto_checkin, hora_checkin, estado, fecha_creacion)
     VALUES (?, ?, ?, ?, 'COMPLETADO', NOW())`,
    [idAsignacionHabitacion, procesadoPor, autoCheckin, horaCheckin],
  );

  await actualizarEstadoSolicitudPorAsignacion(idAsignacionHabitacion);
  return result.insertId;
}

async function actualizarEstadoSolicitudPorAsignacion(
  id_asignacion_habitacion,
) {
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
        estado = "OCUPADA"
      WHERE num_solicitud = ?
      `,
    [numReserva[0].num_solicitud],
  );
}

async function insertarHuesped(idCheckIn, huesped) {
  await db.execute(
    `INSERT INTO huespedes_check_in
     (id_check_in, doc_identificacion, tipo_identificacion, nombre_completo,
      fecha_nacimiento, ref_genero, titular, observacion, fecha_registro)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      idCheckIn,
      huesped.doc_identificacion,
      huesped.tipo_identificacion,
      huesped.nombre_completo,
      huesped.fecha_nacimiento,
      huesped.ref_genero,
      huesped.titular,
      huesped.observacion,
    ],
  );
}

async function actualizarEstadoSolicitud(numSolicitud) {
  await db.execute(
    `UPDATE solicitudes_alojamiento
     SET estado = 'PENDIENTE_PAGO', fecha_actualizacion = NOW()
     WHERE num_solicitud = ?`,
    [numSolicitud],
  );
}

async function actualizarEstadoHabitacion(idHabitacion) {
  await db.execute(
    `UPDATE habitaciones
     SET estado = 'OCUPADA', fecha_actualizacion = NOW()
     WHERE id_habitacion = ?`,
    [idHabitacion],
  );
}

async function obtenerEmailTitularPorCheckIn(idCheckIn) {
  const [rows] = await db.execute(
    `
    SELECT pd.email, hci.nombre_completo
    FROM huespedes_check_in hci
    JOIN personas_det pd 
      ON hci.doc_identificacion = pd.id_persona
    WHERE hci.id_check_in = ?
      AND hci.titular = true
    LIMIT 1
    `,
    [idCheckIn],
  );

  return rows.length ? rows[0] : null;
}

module.exports = {
  crearCheckIn,
  insertarHuesped,
  actualizarEstadoSolicitud,
  actualizarEstadoHabitacion,
  obtenerEmailTitularPorCheckIn,
};
