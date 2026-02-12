const pool = require("../models/db");

// =========================
// CREATE
// =========================
async function crearPersona(data) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const {
      id_persona,
      tipo_id,
      digverif,
      razon_social,
      apellido1,
      apellido2,
      nombre1,
      nombre2,
      fecha_nacimiento,
      ref_genero,
      nacionalidad,
      direccion,
      direccion_c,
      cod_munic,
      email,
      telefono,
      contacto,
      latitud,
      longitud,
      token,
    } = data;

    await conn.query(
      `INSERT INTO personas
      (id_persona, tipo_id, digverif, razon_social, apellido1, apellido2,
       nombre1, nombre2, fecha_nacimiento, ref_genero, nacionalidad)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_persona,
        tipo_id,
        digverif,
        razon_social,
        apellido1,
        apellido2,
        nombre1,
        nombre2,
        fecha_nacimiento,
        ref_genero,
        nacionalidad,
      ],
    );

    await conn.query(
      `INSERT INTO personas_det
      (id_persona, direccion, direccion_c, cod_munic, email, telefono,
       contacto, latitud, longitud, token)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_persona,
        direccion,
        direccion_c,
        cod_munic,
        email,
        telefono,
        contacto,
        latitud,
        longitud,
        token,
      ],
    );

    await conn.commit();
    return { success: true, message: "Persona creada correctamente" };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

// =========================
// READ ALL
// =========================
async function listarPersonas() {
  const conn = await pool.getConnection();

  try {
    const [rows] = await conn.query(`
      SELECT 
        p.*,
        pa.detalle,
        pd.id_persona_det,
        pd.direccion,
        pd.direccion_c,
        pd.cod_munic,
        pd.email,
        pd.telefono,
        pd.contacto,
        pd.latitud,
        pd.longitud,
        pd.token
      FROM personas p
      LEFT JOIN personas_det pd ON p.id_persona = pd.id_persona
      LEFT JOIN paises pa ON p.nacionalidad = pa.cod_pais;
    `);

    return rows;
  } finally {
    conn.release();
  }
}

// =========================
// READ BY ID
// =========================
async function obtenerPersonaPorId(id_persona) {
  const conn = await pool.getConnection();

  try {
    const [rows] = await conn.query(
      `
      SELECT 
        p.*,
        pd.id_persona_det,
        pd.direccion,
        pd.direccion_c,
        pd.cod_munic,
        pd.email,
        pd.telefono,
        pd.contacto,
        pd.latitud,
        pd.longitud,
        pd.token
      FROM personas p
      LEFT JOIN personas_det pd ON p.id_persona = pd.id_persona
      WHERE p.id_persona = ?
      `,
      [id_persona],
    );

    return rows[0] || null;
  } finally {
    conn.release();
  }
}

// =========================
// UPDATE
// =========================
async function actualizarPersona(id_persona, data) {
  const idStr = String(id_persona);
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(
      `
      UPDATE personas SET
        tipo_id = ?,
        digverif = ?,
        razon_social = ?,
        apellido1 = ?,
        apellido2 = ?,
        nombre1 = ?,
        nombre2 = ?,
        fecha_nacimiento = ?,
        ref_genero = ?,
        nacionalidad = ?
      WHERE id_persona = ?
      `,
      [
        data.tipo_id,
        data.digverif,
        data.razon_social,
        data.apellido1,
        data.apellido2,
        data.nombre1,
        data.nombre2,
        data.fecha_nacimiento,
        data.ref_genero,
        data.nacionalidad,
        idStr,
      ],
    );

    await conn.query(
      `
  UPDATE personas_det SET
    direccion = ?,
    direccion_c = ?,
    cod_munic = ?,
    email = ?,
    telefono = ?,
    contacto = ?,
    latitud = ?,
    longitud = ?,
    token = ?
  WHERE id_persona = ?
  `,
      [
        data.direccion,
        data.direccion_c,
        data.cod_munic,
        data.email,
        data.telefono,
        data.contacto,
        data.latitud,
        data.longitud,
        data.token,
        idStr,
      ],
    );

    await conn.commit();
    return { success: true, message: "Persona actualizada correctamente" };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

// =========================
// DELETE MODIFICAR
// =========================
async function eliminarPersona(id_persona) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE personas 
       SET activo = 0 
       WHERE id_persona = ? AND activo = 1`,
      [id_persona],
    );

    await conn.commit();
    return { success: true, message: "Persona desactivada correctamente" };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

module.exports = {
  crearPersona,
  listarPersonas,
  obtenerPersonaPorId,
  actualizarPersona,
  eliminarPersona,
};
