const pool = require("../../db");

async function obtenerRolOperador(operador) {
  const [rows] = await pool.execute(
    `
    SELECT con.detalle, p.razon_social
    FROM config con
    JOIN personas p
    ON con.codigo = p.id_persona
    WHERE entidad = 'OPERADOR_SISTEMA'
      AND codigo = ?
    LIMIT 1
    `,
    [operador],
  );

  return rows[0]?.detalle || null;
}

async function obtenerTotalesRecaudos(fechaDesde, fechaHasta) {
  const [rows] = await pool.execute(
    `
    SELECT 
      COUNT(id_recaudo) AS cant_transacciones,
      COALESCE(SUM(valor), 0) AS monto
    FROM recaudos
    WHERE fecha_transaccion >= ? AND fecha_transaccion < ?
    `,
    [fechaDesde, fechaHasta],
  );

  return rows[0];
}

async function crearCierre(data) {
  const { operador, fecha_desde, fecha_hasta, cant_transacciones, monto } =
    data;

  const [result] = await pool.execute(
    `
    INSERT INTO cierre_diario 
    (operador, fecha_desde, fecha_hasta, cant_transacciones, monto, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
    `,
    [operador, fecha_desde, fecha_hasta, cant_transacciones, monto],
  );

  return {
    id: result.insertId,
    ...data,
  };
}

async function obtenerCierres(filtros = {}) {
  let sql = `
    SELECT 
      cd.id,
      cd.operador,
      p.razon_social,
      cd.fecha_desde,
      cd.fecha_hasta,
      cd.cant_transacciones,
      cd.monto,
      cd.created_at
    FROM cierre_diario cd
    LEFT JOIN personas p 
      ON p.id_persona = cd.operador
    WHERE 1=1
  `;

  const params = [];

  if (filtros.operador) {
    sql += ` AND cd.operador = ?`;
    params.push(filtros.operador);
  }

  sql += ` ORDER BY cd.created_at DESC`;

  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function existeCierreDiario(operador, fechaDesde, fechaHasta) {
  const [rows] = await pool.execute(
    `
    SELECT id
    FROM cierre_diario
    WHERE operador = ?
      AND fecha_desde < ?
      AND fecha_hasta > ?
    LIMIT 1
    `,
    [operador, fechaHasta, fechaDesde],
  );

  return rows.length > 0;
}

module.exports = {
  obtenerTotalesRecaudos,
  crearCierre,
  obtenerCierres,
  existeCierreDiario,
  obtenerRolOperador,
};
