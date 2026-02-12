const db = require("../db");

async function obtenerReporteCargosPorConcepto(
  fechaDesde,
  fechaHasta,
  idOperador,
) {
  const [rows] = await db.execute(
    `
    SELECT
        r.factura,
        c.ref_concepto,
        cfg1.detalle AS concepto,
        c.observaciones AS cargo_detalle,
        r.metodo_pago,
        DATE_FORMAT(c.fecha_creacion, '%Y-%m-%d %H:%i') AS fecha_cargo,
        c.total AS valor,
        p.razon_social AS nombre_operador
    FROM recaudos r
    JOIN factura_cobro fc
        ON fc.num_factura = r.factura
    JOIN factura_cobro_det fcd
        ON fcd.num_factura = fc.num_factura
    JOIN cargos c
        ON c.id_cargo = fcd.id_cargo
    JOIN config cfg1
        ON cfg1.codigo = c.ref_concepto
    JOIN personas p
        ON p.id_persona = r.ref_operador
    WHERE r.resp_estado = 'APROBADO'
      AND r.ref_operador = ?
      AND r.fecha_transaccion >= ?
      AND r.fecha_transaccion < DATE_ADD(?, INTERVAL 1 DAY)
    ORDER BY
        c.ref_concepto,
        r.metodo_pago,
        c.fecha_creacion;
    `,
    [idOperador, fechaDesde, fechaHasta],
  );

  return rows;
}

module.exports = {
  obtenerReporteCargosPorConcepto,
};
