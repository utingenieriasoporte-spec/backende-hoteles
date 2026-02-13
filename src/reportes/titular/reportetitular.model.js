const db = require("../../../db");

async function obtenerCargosPendientesPorTitular(idPersona) {
  const [rows] = await db.execute(
    `
    SELECT
        p.id_persona,
        p.razon_social,
        sa.num_solicitud,
        h.numero_habitacion,
        cfg.detalle,
        c.observaciones,
        c.monto_abonado,
        c.total
    FROM cargos c
    JOIN asignaciones_habitacion ah
        ON ah.id_asignacion = c.id_asignacion_habitacion
    JOIN solicitudes_alojamiento_det sad
        ON sad.id_solicitud_det = ah.id_solicitud_det
    JOIN solicitudes_alojamiento sa
        ON sa.num_solicitud = sad.num_solicitud
    JOIN personas p
        ON sa.id_titular = p.id_persona
    JOIN habitaciones h
        ON h.id_habitacion = ah.id_habitacion
    JOIN config cfg
        ON cfg.codigo = c.ref_concepto
    WHERE p.id_persona = ?
      AND c.estado = 'PENDIENTE_PAGO';
    `,
    [idPersona],
  );

  return rows;
}

module.exports = {
  obtenerCargosPendientesPorTitular,
};
