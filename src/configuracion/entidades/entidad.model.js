const db = require("../../../db");

async function obtenerInformacionEntidades() {
  const [rows] = await db.execute(`SELECT * FROM config;`);
  return rows;
}

async function crearEntidad(data) {
  const { entidad, codigo, detalle } = data;

  const [result] = await db.execute(
    `INSERT INTO config (entidad, codigo, detalle) VALUES (?, ?, ?)`,
    [entidad, codigo, detalle],
  );

  return result.insertId;
}

async function obtenerDetalleConfig(entidad, codigo) {
  const [rows] = await db.execute(
    `
    SELECT entidad, codigo, detalle
    FROM config
    WHERE entidad = ?
      AND codigo = ?
    LIMIT 1
    `,
    [entidad, codigo],
  );

  return rows[0] || null;
}

async function obtenerDetallePorEntidad(entidad) {
  const [rows] = await db.execute(`SELECT * FROM config WHERE entidad = ?;`, [
    entidad,
  ]);
  return rows;
}

async function actualizarDetalle(entidad, codigo, detalle) {
  const [result] = await db.execute(
    `
    UPDATE config
    SET detalle = ?
    WHERE entidad = ?
      AND codigo = ?
    `,
    [detalle, entidad, codigo],
  );

  return result.affectedRows;
}

module.exports = {
  obtenerInformacionEntidades,
  crearEntidad,
  obtenerDetalleConfig,
  actualizarDetalle,
  obtenerDetallePorEntidad,
};
