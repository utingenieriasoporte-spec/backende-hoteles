const entidadesModel = require("../models/entidades");

async function listarEntidades() {
  const entidadRaw = await entidadesModel.obtenerInformacionEntidades();
  const entidadesInfo = entidadRaw.map((e) => ({
    entidad: e.entidad,
    codigo: e.codigo,
    detalle: e.detalle,
  }));
  return entidadesInfo;
}

async function listarDetallePorEntidad(entidad) {
  const entidadRaw = await entidadesModel.obtenerDetallePorEntidad(entidad);
  const entidadesInfo = entidadRaw.map((e) => ({
    entidad: e.entidad,
    codigo: e.codigo,
    detalle: e.detalle,
  }));
  return entidadesInfo;
}

async function crearEntidad(data) {
  const newId = await entidadesModel.crearEntidad(data);
  return { id: newId, ...data };
}

async function actualizarDetalle(entidad, codigo, detalle) {
  const affectedRows = await entidadesModel.actualizarDetalle(
    entidad,
    codigo,
    detalle,
  );

  if (affectedRows === 0) {
    return null;
  }

  return { entidad, codigo, detalle };
}

module.exports = {
  listarEntidades,
  crearEntidad,
  actualizarDetalle,
  listarDetallePorEntidad,
};
