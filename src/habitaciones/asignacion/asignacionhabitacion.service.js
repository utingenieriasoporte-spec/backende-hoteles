const asignacionHabitacionModel = require("./asignacionhabitacion.model");

async function asignarHabitacion(data) {
  const { numSolicitud, idHabitacion } = data;

  if (!numSolicitud || !idHabitacion) {
    throw new Error("numSolicitud e idHabitacion son obligatorios");
  }

  return await asignacionHabitacionModel.asignarHabitacion(
    numSolicitud,
    idHabitacion,
  );
}

async function cambiarHabitacion(data) {
  const { numSolicitud, idHabitacionNueva, fechaAsignacion } = data;

  if (!numSolicitud || !idHabitacionNueva || !fechaAsignacion) {
    throw new Error(
      "numSolicitud, idHabitacionNueva, fechaAsignacion son obligatorios",
    );
  }

  return await asignacionHabitacionModel.cambiarHabitacion(
    numSolicitud,
    idHabitacionNueva,
    fechaAsignacion,
  );
}

module.exports = {
  asignarHabitacion,
  cambiarHabitacion,
};
