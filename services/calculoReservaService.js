const calculoModel = require("../models/calculoReservaModel");

async function calcularTotal(numSolicitud) {
  if (!numSolicitud) {
    throw new Error("El número de solicitud es obligatorio");
  }

  const data = await calculoModel.calcularTotalReserva(numSolicitud);

  return {
    numSolicitud: data.num_solicitud,
    noches: data.noches,
    valorNoche: data.valor_noche,
    cantidadPersonas: data.cantidad_personas,
    total: data.total,
  };
}

async function pagarParcialMente(data) {
  const { numSolicitud, id_solicitud_det, valor } = data;
  if (!numSolicitud || !valor || valor <= 0) {
    throw new Error("numSolicitud y valor son obligatorios");
  }
  return await calculoModel.aplicarPagoParcial(
    numSolicitud,
    id_solicitud_det,
    valor,
  );
}

module.exports = {
  calcularTotal,
  pagarParcialMente,
};
