const pool = require("../../../db");
const cargos = require("../../cargos/cargo.model");
async function obtenerDetalleSolicitud(numSolicitud, conn) {
  const [rows] = await conn.query(
    `
    SELECT sad.id_solicitud_det,
		sa.fecha_check_in,
		sa.fecha_check_out
    FROM solicitudes_alojamiento_det sad
    JOIN solicitudes_alojamiento sa
    ON sad.num_solicitud = sa.num_solicitud
    WHERE sad.num_solicitud = ?
    `,
    [numSolicitud],
  );
  return rows[0];
}

async function obtenerTotalReserva(id_solicitud_det, conn) {
  const [rows] = await conn.query(
    `
    SELECT ah.id_asignacion, sa.total_pago 
FROM solicitudes_alojamiento sa
JOIN solicitudes_alojamiento_det sad 
ON sa.num_solicitud = sad.num_solicitud
JOIN asignaciones_habitacion ah
ON ah.id_solicitud_det = sad.id_solicitud_det
WHERE sad.id_solicitud_det = ?;
    `,
    [id_solicitud_det],
  );
  return {
    id_asignacion: rows[0].id_asignacion,
    total: rows[0].total_pago,
  };
}

async function habitacionDisponible(idHabitacion, conn) {
  const [rows] = await conn.query(
    `
    SELECT estado
    FROM habitaciones
    WHERE id_habitacion = ? AND estado = "ACTIVO"
    `,
    [idHabitacion],
  );
  return rows.length && rows[0].estado === "ACTIVO";
}

async function existeAsignacion(idSolicitudDet, conn) {
  const [rows] = await conn.query(
    `
    SELECT id_asignacion
    FROM asignaciones_habitacion
    WHERE id_solicitud_det = ?
    `,
    [idSolicitudDet],
  );
  return rows.length > 0;
}

async function asignarHabitacion(numSolicitud, idHabitacion) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const detalle = await obtenerDetalleSolicitud(numSolicitud, conn);
    if (!detalle) {
      throw new Error("No existe el detalle de la solicitud");
    }

    const yaAsignada = await existeAsignacion(detalle.id_solicitud_det, conn);
    if (yaAsignada) {
      throw new Error("La reserva ya tiene una habitación asignada");
    }

    const disponible = await habitacionDisponible(idHabitacion, conn);
    if (!disponible) {
      throw new Error("La habitación no está disponible");
    }

    // Insertar asignación
    const [result] = await conn.query(
      `
      INSERT INTO asignaciones_habitacion
      (id_solicitud_det, id_habitacion, fecha_asignacion, fecha_desde, fecha_hasta)
      VALUES (?, ?, NOW(),?, ?)
      `,
      [
        detalle.id_solicitud_det,
        idHabitacion,
        detalle.fecha_check_in,
        detalle.fecha_check_out,
      ],
    );

    const asignacion = await obtenerTotalReserva(
      detalle.id_solicitud_det,
      conn,
    );

    const dataCargos = {
      id_asignacion_habitacion: result.insertId,
      ref_concepto: "C001",
      observaciones: "",
      total: asignacion.total,
    };
    cargos.crearCargo(dataCargos);

    // Cambiar estado de la habitación
    await conn.query(
      `
      UPDATE habitaciones
      SET estado = 'ACTIVO', fecha_actualizacion = NOW()
      WHERE id_habitacion = ?
      `,
      [idHabitacion],
    );

    await conn.query(
      `
      UPDATE solicitudes_alojamiento
      SET estado = 'CONFIRMADO',
          fecha_actualizacion = NOW()
      WHERE num_solicitud = ?
      `,
      [numSolicitud],
    );

    await conn.commit();
    return {
      success: true,
      message: "Habitación asignada correctamente",
      idAsignacion: result.insertId,
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function obtenerSolicitud(numSolicitud, conn) {
  const [rows] = await conn.query(
    `
    SELECT fecha_check_in, fecha_check_out
    FROM solicitudes_alojamiento
    WHERE num_solicitud = ?
    `,
    [numSolicitud],
  );
  return rows[0];
}

async function obtenerAsignacionActiva(idSolicitudDet, conn) {
  const [rows] = await conn.query(
    `
    SELECT id_asignacion, id_habitacion
    FROM asignaciones_habitacion
    WHERE id_solicitud_det = ? AND activo = 1
    `,
    [idSolicitudDet],
  );
  return rows[0];
}

async function cambiarHabitacion(
  numSolicitud,
  idHabitacionNueva,
  fechaAsignacion,
) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const detalle = await obtenerDetalleSolicitud(numSolicitud, conn);
    if (!detalle) throw new Error("No existe la solicitud");

    const solicitud = await obtenerSolicitud(numSolicitud, conn);

    const asignacionActual = await obtenerAsignacionActiva(
      detalle.id_solicitud_det,
      conn,
    );
    if (!asignacionActual)
      throw new Error("La reserva no tiene habitación asignada");

    const disponible = await habitacionDisponible(idHabitacionNueva, conn);
    if (!disponible) throw new Error("La nueva habitación no está disponible");

    // Normalizar fecha de asignación (fecha + hora)
    if (fechaAsignacion && isNaN(new Date(fechaAsignacion).getTime())) {
      throw new Error("fechaAsignacion no tiene un formato válido");
    }

    const fechaAsignacionFinal = fechaAsignacion
      ? new Date(fechaAsignacion)
      : new Date(); // NOW con hora

    // 1️⃣ Desactivar asignación actual
    await conn.query(
      `
      UPDATE asignaciones_habitacion
      SET activo = 0,
          fecha_hasta = NOW()
      WHERE id_asignacion = ?
      `,
      [asignacionActual.id_asignacion],
    );

    // 2️⃣ Liberar habitación anterior
    await conn.query(
      `
      UPDATE habitaciones
      SET estado = 'ACTIVO', fecha_actualizacion = NOW()
      WHERE id_habitacion = ?
      `,
      [asignacionActual.id_habitacion],
    );

    // 3️⃣ Crear nueva asignación
    await conn.query(
      `
      INSERT INTO asignaciones_habitacion
      (id_solicitud_det, id_habitacion, fecha_desde, fecha_hasta, fecha_asignacion, activo)
      VALUES (?, ?, ?, ?, ?, 1)
      `,
      [
        detalle.id_solicitud_det,
        idHabitacionNueva,
        solicitud.fecha_check_in,
        solicitud.fecha_check_out,
        fechaAsignacionFinal,
      ],
    );

    // 4️⃣ Ocupar nueva habitación
    await conn.query(
      `
      UPDATE habitaciones
      SET estado = 'ACTIVO', fecha_actualizacion = NOW()
      WHERE id_habitacion = ?
      `,
      [idHabitacionNueva],
    );

    await conn.commit();
    return { success: true, message: "Habitación cambiada correctamente" };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

module.exports = {
  asignarHabitacion,
  cambiarHabitacion,
};
