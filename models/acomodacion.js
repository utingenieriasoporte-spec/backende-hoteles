const db = require("../models/db");

async function crearAcomodacion(data) {
  const {
    ref_tipo_acomodacion,
    descripcion,
    ocupacion_max,
    imagenes,
    capacidad_instalada,
    activo = true,
  } = data;

  const [result] = await db.execute(
    `INSERT INTO acomodaciones (
      ref_tipo_acomodacion, descripcion, ocupacion_max, 
      imagenes, capacidad_instalada, activo, fecha_creacion, fecha_actualizacion
    ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      ref_tipo_acomodacion,
      descripcion,
      ocupacion_max,
      imagenes,
      capacidad_instalada,
      activo,
    ],
  );

  return result.insertId;
}

async function obtenerAcomodacion() {
  const [rows] = await db.execute(`SELECT 
a.id_acomodacion, 
a.ref_tipo_acomodacion, 
a.descripcion, 
a.ocupacion_max, 
a.activo,
t.valor,
t.valor_mes,
t.valor_habitacion,
t.valor_adicional_adulto,
t.valor_adicional_menor,
t.fecha_desde, 
t.fecha_hasta
FROM acomodaciones a
JOIN tarifas t ON t.id_acomodacion = a.id_acomodacion
WHERE NOW()  BETWEEN t.fecha_desde AND t.fecha_hasta
;`);
  return rows;
}

async function obtenerAcomodacionPorReferencia(ref_tipo_acomodacion) {
  const [rows] = await db.execute(
    `SELECT * FROM acomodaciones WHERE ref_tipo_acomodacion = ?`,
    [ref_tipo_acomodacion],
  );
  return rows;
}

async function actualizarAcomodacion(id_acomodacion, data) {
  const campos = [];
  const valores = [];

  for (const [key, value] of Object.entries(data)) {
    campos.push(`${key} = ?`);
    valores.push(value);
  }

  valores.push(id_acomodacion);

  const [result] = await db.execute(
    `UPDATE acomodaciones 
     SET ${campos.join(", ")}, fecha_actualizacion = NOW()
     WHERE id_acomodacion = ?`,
    valores,
  );

  return result.affectedRows;
}

async function eliminarAcomodacion(id_acomodacion) {
  const [result] = await db.execute(
    `DELETE FROM acomodaciones WHERE id_acomodacion = ?`,
    [id_acomodacion],
  );
  return result.affectedRows;
}

module.exports = {
  crearAcomodacion,
  obtenerAcomodacion,
  obtenerAcomodacionPorReferencia,
  actualizarAcomodacion,
  eliminarAcomodacion,
};
