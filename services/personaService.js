const personaModel = require("../models/personaModel");

async function crearPersona(data) {
  return await personaModel.crearPersona(data);
}

async function listarPersonas() {
  const personasRaw = await personaModel.listarPersonas();
  return personasRaw.map((p) => ({
    id_persona: p.id_persona,
    tipo_id: p.tipo_id,
    digVerif: p.digVerif,
    razon_social: p.razon_social,
    apellido1: p.apellido1,
    apellido2: p.apellido2,
    nombre1: p.nombre1,
    nombre2: p.nombre2,
    fecha_nacimiento: p.fecha_nacimiento,
    ref_genero: p.ref_genero,
    nacionalidad: p.detalle,
    activo: p.activo,
    id_persona_det: p.id_persona_det,
    direccion: p.direccion,
    direccion_c: p.direccion_c,
    cod_munic: p.cod_munic,
    email: p.email,
    telefono: p.telefono,
    contacto: p.contacto,
    latitud: p.latitud,
    longitud: p.longitud,
    token: p.token,
  }));
}

async function obtenerPersona(id_persona) {
  const persona = await personaModel.obtenerPersonaPorId(id_persona);
  if (!persona) throw new Error("Persona no encontrada");
  return persona;
}

async function actualizarPersona(id_persona, data) {
  return await personaModel.actualizarPersona(id_persona, data);
}

async function eliminarPersona(id_persona) {
  return await personaModel.eliminarPersona(id_persona);
}

module.exports = {
  crearPersona,
  listarPersonas,
  obtenerPersona,
  actualizarPersona,
  eliminarPersona,
};
