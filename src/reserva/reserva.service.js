const reservaModel = require("./reserva.model");
const asignacionHabitacionModel = require("../habitaciones/habitacion.model");
// const cargosModel = require("../models/cargo");

async function registrarReserva(data) {
  const res = await reservaModel.crearReservaCompleta(data);
  return res;
}

async function registrarReservaConAsignacion(data) {
  const step1 = await reservaModel.crearReservaCompleta(data);

  let step2 = null;

  if (step1.success) {
    step2 = await asignacionHabitacionModel.asignarHabitacion(
      step1.numReserva,
      data.idHabitacion,
    );
  }

  if (step1.success) {
    const step3 = await reservaModel.adicionarPersonasReserva({
      idAsignacion: step2.idAsignacion,
      numReserva: step1.numReserva,
      adultos: step1.adultoSol,
      menores: step1.menoresSol,
      noches: data.noches,
    });
  }

  return step1;
}

async function crearAmpliacionReserva(data) {
  if (!data.numReservaOriginal) {
    throw new Error("numReservaOriginal es obligatorio");
  }

  if (!data.nuevaFechaSalida || !data.horaSalida) {
    throw new Error("Fecha y hora de salida son obligatorias");
  }

  return await reservaModel.crearAmpliacionReserva(data);
}

async function listarReservas() {
  return await reservaModel.obtenerReservas();
}

async function listarReservaPorIdTitular(idTitular) {
  return await reservaModel.obtenerReservaPorIdTitular(idTitular);
}

async function cambiarEstadoReserva(numReserva, nuevoEstado) {
  const actualizado = await reservaModel.actualizarEstadoReserva(
    numReserva,
    nuevoEstado,
  );
  verificarEstadoValido(actualizado);
  return { success: true, message: "Estado actualizado correctamente" };
}

function verificarEstadoValido(actualizado) {
  if (!actualizado) {
    throw new Error("No se encontró la reserva o no se pudo actualizar.");
  }
}

async function cancelarReserva(numSolicitud) {
  const solicitud = await reservaModel.obtenerSolicitud(numSolicitud);

  if (!solicitud) {
    throw new Error("RESERVA_NO_EXISTE");
  }

  if (solicitud.estado === "CANCELADO") {
    return { mensaje: "La reserva ya estaba cancelada" };
  }

  const asignacion = await reservaModel.obtenerAsignacion(numSolicitud);

  if (asignacion) {
    await reservaModel.cancelarCheckIn(asignacion.id_asignacion);
    await reservaModel.liberarHabitacion(asignacion.id_habitacion);
  }

  await reservaModel.cancelarSolicitud(numSolicitud);

  return { mensaje: "Reserva cancelada correctamente" };
}

async function actualizarNovedadYObservaciones(
  numSolicitud,
  refNovedades,
  observaciones,
) {
  const actualizado = await reservaModel.actualizarNovedadYObservaciones(
    numSolicitud,
    refNovedades,
    observaciones,
  );

  if (!actualizado) {
    throw new Error("No se encontró la reserva o no se pudo actualizar");
  }

  return {
    success: true,
    message: "Novedad y observaciones actualizadas correctamente",
  };
}

async function adicionarPersonas(data) {
  return await reservaModel.adicionarPersonasReserva(data);
}

module.exports = {
  registrarReserva,
  listarReservas,
  cambiarEstadoReserva,
  crearAmpliacionReserva,
  cancelarReserva,
  listarReservaPorIdTitular,
  actualizarNovedadYObservaciones,
  adicionarPersonas,
  registrarReservaConAsignacion,
};
