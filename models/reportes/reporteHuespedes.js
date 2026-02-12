const db = require("../db");

async function obtenerHuespedesCheckin(fechaDesde, fechaHasta) {
  const [rows] = await db.execute(
    `
    SELECT 
      hci.doc_identificacion,
      hci.tipo_identificacion,
      hci.nombre_completo,
      hci.ref_genero,
      h.numero_habitacion,
      s.num_solicitud,
      s.total_pago,
      s.estado_pago,
      ci.fecha_creacion
    FROM huespedes_check_in hci
    JOIN check_ins ci
      ON hci.id_check_in = ci.id_check_in
    JOIN asignaciones_habitacion ah
      ON ci.id_asignacion_habitacion = ah.id_asignacion
    JOIN solicitudes_alojamiento_det sad
      ON ah.id_solicitud_det = sad.id_solicitud_det
    JOIN solicitudes_alojamiento s
      ON sad.num_solicitud = s.num_solicitud
    JOIN habitaciones h
      ON ah.id_habitacion = h.id_habitacion
    WHERE ci.fecha_creacion >= ?
      AND ci.fecha_creacion < DATE_ADD(?, INTERVAL 1 DAY)
    ORDER BY ci.fecha_creacion;
    `,
    [fechaDesde, fechaHasta],
  );

  return rows;
}

async function obtenerHuespedesPorFecha(fecha) {
  const [rows] = await db.execute(
    `
    SELECT 
        hci.doc_identificacion,
        hci.tipo_identificacion,
        hci.nombre_completo,
        hci.ref_genero,
        h.numero_habitacion,
        s.num_solicitud,
        s.total_pago,
        s.estado_pago,
        ci.fecha_creacion
    FROM huespedes_check_in hci
    JOIN check_ins ci
        ON hci.id_check_in = ci.id_check_in
    JOIN asignaciones_habitacion ah
        ON ci.id_asignacion_habitacion = ah.id_asignacion
    JOIN solicitudes_alojamiento_det sad
        ON ah.id_solicitud_det = sad.id_solicitud_det
    JOIN solicitudes_alojamiento s
        ON sad.num_solicitud = s.num_solicitud
    JOIN habitaciones h
        ON ah.id_habitacion = h.id_habitacion
    WHERE ? BETWEEN s.fecha_check_in AND s.fecha_check_out
      AND s.estado = 'OCUPADA'
    ORDER BY h.numero_habitacion;
    `,
    [fecha],
  );

  return rows;
}

async function obtenerHuespedesPorRango(fechaDesde, fechaHasta) {
  const [rows] = await db.execute(
    `
    SELECT 
        hci.doc_identificacion,
        hci.tipo_identificacion,
        hci.nombre_completo,
        hci.ref_genero,
        h.numero_habitacion,
        s.num_solicitud,
        s.total_pago,
        s.estado_pago,
        s.estado,
        s.fecha_check_in,
        s.fecha_check_out
    FROM solicitudes_alojamiento s
    JOIN solicitudes_alojamiento_det sad
        ON sad.num_solicitud = s.num_solicitud
    JOIN asignaciones_habitacion ah
        ON ah.id_solicitud_det = sad.id_solicitud_det
    JOIN check_ins ci
        ON ci.id_asignacion_habitacion = ah.id_asignacion
    JOIN huespedes_check_in hci
        ON hci.id_check_in = ci.id_check_in
    JOIN habitaciones h
        ON ah.id_habitacion = h.id_habitacion
    WHERE s.fecha_check_in < DATE_ADD(?, INTERVAL 1 DAY)
      AND s.fecha_check_out > ?
    ORDER BY h.numero_habitacion ASC;
    `,
    [fechaHasta, fechaDesde],
  );

  return rows;
}

module.exports = {
  obtenerHuespedesCheckin,
  obtenerHuespedesPorFecha,
  obtenerHuespedesPorRango,
};
