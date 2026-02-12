const db = require("../db");

async function obtenerHuespedesCheckin() {
  const [rows] = await db.execute(`
    SELECT 
      hci.doc_identificacion,
      hci.tipo_identificacion,
      hci.nombre_completo,
      hci.ref_genero,
      h.numero_habitacion,
      s.num_solicitud,
      s.total_pago,
      s.estado_pago
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
    ON ah.id_habitacion = h.id_habitacion;
  `);

  return rows;
}

module.exports = {
  obtenerHuespedesCheckin,
};
