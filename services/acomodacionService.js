const acomodacionModel = require("../models/acomodacion");

async function agregarAcomodacion(data) {
  return await acomodacionModel.crearAcomodacion(data);
}

async function listarAcomidaciones() {
  const lista_acomodaciones = await acomodacionModel.obtenerAcomodacion();
  const infoAcomodaciones = lista_acomodaciones.map((a) => ({
    id_acomodacion: a.id_acomodacion,
    ref_tipo_acomodacion: a.ref_tipo_acomodacion,
    descripcion: a.descripcion,
    ocupacion_max: a.ocupacion_max,
    activo: a.activo,
    tarifasVigentes: {
      valorPersona: a.valor,
      valorMes: a.valor_mes,
      valorHabitacion: a.valor_habitacion,
      valorAdicionalAdulto: a.valor_adicional_adulto,
      valorAdicionalMenor: a.valor_adicional_menor,
    },
    fecha_desde: a.fecha_desde,
    fecha_hasta: a.fecha_hasta,
  }));
  return infoAcomodaciones;
}

async function listarAcomodacionPorReferencia(referencia) {
  const lista_acomodaciones =
    await acomodacionModel.obtenerAcomodacionPorReferencia(referencia);
  return lista_acomodaciones;
}

async function editarAcomodacion(id, data) {
  return await acomodacionModel.actualizarAcomodacion(id, data);
}

async function borrarAcomodacion(id) {
  return await acomodacionModel.eliminarAcomodacion(id);
}
module.exports = {
  agregarAcomodacion,
  listarAcomidaciones,
  listarAcomodacionPorReferencia,
  editarAcomodacion,
  borrarAcomodacion,
};
