const db = require("../models/db");

async function obtenerTarifaEntreFechas(id_acomodacion, fecha1, fecha2) {
  const [rows] = await db.execute(
    `SELECT *
FROM tarifas
WHERE id_acomodacion = ?
AND activo = 1
AND ? <= fecha_hasta
AND ? >= fecha_desde;`,
    [id_acomodacion, fecha1, fecha2],
  );
  return rows;
}

async function obtenerTarifas() {
  const [rows] = await db.execute(`SELECT * FROM tarifas`);
  return rows;
}

async function obtenerTarifaPorId(id_tarifa) {
  const [rows] = await db.execute(
    `SELECT * FROM tarifas WHERE id_tarifa = ? LIMIT 1`,
    [id_tarifa],
  );
  return rows[0] || null;
}

async function crearTarifa(data) {
  const {
    id_acomodacion,
    fecha_desde,
    fecha_hasta,
    ref_modificador_tarifa,
    valor,
    valor_mes,
    valor_habitacion,
    valor_adicional_adulto,
    valor_adicional_menor,
  } = data;

  const [result] = await db.execute(
    `
    INSERT INTO tarifas 
    (id_acomodacion, fecha_desde, fecha_hasta, ref_modificador_tarifa, valor, valor_mes, valor_habitacion, valor_adicional_adulto, valor_adicional_menor)
    VALUES (?, ?, ?, ?, ?, ?, ?,?,?)
    `,
    [
      id_acomodacion,
      fecha_desde,
      fecha_hasta,
      "MT01",
      valor,
      valor_mes,
      valor_habitacion,
      valor_adicional_adulto,
      valor_adicional_menor,
    ],
  );

  return result.insertId;
}

async function actualizarTarifa(id_tarifa, data) {
  const {
    fecha_desde,
    fecha_hasta,
    ref_modificador_tarifa,
    valor,
    valor_mes,
    valor_habitacion,
    valor_adicional_adulto,
    valor_adicional_menor,
  } = data;

  const [result] = await db.execute(
    `
    UPDATE tarifas
    SET fecha_desde = ?,
        fecha_hasta = ?,
        ref_modificador_tarifa = ?,
        valor = ?,
        valor_mes = ?,
        valor_habitacion = ?,
        valor_adicional_adulto = ?,
        valor_adicional_menor = ?
    WHERE id_tarifa = ?
    `,
    [
      fecha_desde,
      fecha_hasta,
      ref_modificador_tarifa,
      valor,
      valor_mes,
      valor_habitacion,
      valor_adicional_adulto,
      valor_adicional_menor,

      id_tarifa,
    ],
  );

  return result.affectedRows;
}

async function eliminarTarifa(id_tarifa) {
  const [result] = await db.execute(
    `
    UPDATE tarifas
    SET activo = 0
    WHERE id_tarifa = ? AND activo = 1
    `,
    [id_tarifa],
  );

  return result.affectedRows;
}
module.exports = {
  obtenerTarifas,
  obtenerTarifaPorId,
  crearTarifa,
  actualizarTarifa,
  eliminarTarifa,
  obtenerTarifaEntreFechas,
};
