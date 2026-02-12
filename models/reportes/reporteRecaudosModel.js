const db = require("../db");

async function obtenerRecaudosPorRangoOperador(
  fechaDesde,
  fechaHasta,
  idOperador,
) {
  const [rows] = await db.execute(
    `
    SELECT
        r.id_recaudo,
        r.ref_operador,
        cfg.detalle AS operador,
        p.razon_social,
        pd.email,
        pd.telefono,
        r.nombre_cliente,
        r.factura,
        r.metodo_pago,
        r.valor,
        r.fecha_transaccion,
        DATE_FORMAT(r.fecha_transaccion, '%H:%i') AS hora_transaccion
    FROM recaudos r
    JOIN factura_cobro fc
        ON fc.num_factura = r.factura
       AND fc.estado_pago = 'PAGA'
    LEFT JOIN config cfg
        ON cfg.entidad = 'OPERADOR_SISTEMA'
       AND cfg.codigo = r.ref_operador
    LEFT JOIN personas p
        ON p.id_persona = r.ref_operador
    LEFT JOIN personas_det pd
        ON pd.id_persona = p.id_persona
    WHERE r.resp_estado = 'APROBADO'
      AND r.ref_operador = ?
      AND r.fecha_transaccion >= ?
      AND r.fecha_transaccion < DATE_ADD(?, INTERVAL 1 DAY)
    ORDER BY
        r.metodo_pago,
        r.fecha_transaccion;
    `,
    [idOperador, fechaDesde, fechaHasta],
  );

  return rows;
}

module.exports = {
  obtenerRecaudosPorRangoOperador,
};
