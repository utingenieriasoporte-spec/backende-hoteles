const tarifasModel = require("../models/tarifaModel");

async function listarTarifas() {
  return await tarifasModel.obtenerTarifas();
}

async function obtenerTarifa(id_tarifa) {
  return await tarifasModel.obtenerTarifaPorId(id_tarifa);
}

async function crearTarifa(data) {
  const { id_acomodacion, fecha_desde, fecha_hasta } = data;
  const tarifasExistentes = await tarifasModel.obtenerTarifaEntreFechas(
    id_acomodacion,
    fecha_desde,
    fecha_hasta,
  );

  if (tarifasExistentes.length > 0) {
    return { message: "Ya existe una tarifa en el rango de fecha establecido" };
  }

  const id = await tarifasModel.crearTarifa(data);
  return { id_tarifa: id, ...data };
}

async function actualizarTarifa(id_tarifa, data) {
  const affected = await tarifasModel.actualizarTarifa(id_tarifa, data);
  if (affected === 0) return null;
  return { id_tarifa, ...data };
}

async function eliminarTarifa(id_tarifa) {
  const affected = await tarifasModel.eliminarTarifa(id_tarifa);
  return affected > 0;
}

module.exports = {
  listarTarifas,
  obtenerTarifa,
  crearTarifa,
  actualizarTarifa,
  eliminarTarifa,
};
