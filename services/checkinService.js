const CheckIn = require("../models/checkin");

async function realizarCheckIn(data) {
  const idCheckIn = await CheckIn.crearCheckIn({
    idAsignacionHabitacion: data.id_asignacion_habitacion,
    procesadoPor: data.procesado_por,
    autoCheckin: data.auto_checkin,
    horaCheckin: data.hora_checkin,
  });

  for (const huesped of data.huespedes) {
    await CheckIn.insertarHuesped(idCheckIn, huesped);
  }

  // await CheckIn.actualizarEstadoSolicitud(data.num_solicitud);
  //  await CheckIn.actualizarEstadoHabitacion(data.id_habitacion);
  const titular = await CheckIn.obtenerEmailTitularPorCheckIn(idCheckIn);

  if (titular?.email) {
    try {
      await EmailClient.enviarCorreoCheckIn({
        email: titular.email,
        nombre: titular.nombre_completo,
        numSolicitud: data.num_solicitud,
      });
    } catch (error) {
      console.error("No se pudo enviar correo de check-in:", error);
    }
  }
  return {
    id_check_in: idCheckIn,
  };
}

module.exports = {
  realizarCheckIn,
};
