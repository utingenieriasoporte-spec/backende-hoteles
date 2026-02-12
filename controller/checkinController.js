const CheckInService = require("../services/checkinService");

async function crearCheckIn(req, res) {
  try {
    const {
      id_asignacion_habitacion,
      id_habitacion,
      num_solicitud,
      auto_checkin,
      hora_checkin,
      huespedes,
    } = req.body;

    //  const procesado_por = req.user.id_usuario;

    const resultado = await CheckInService.realizarCheckIn({
      id_asignacion_habitacion,
      id_habitacion,
      num_solicitud,
      auto_checkin,
      hora_checkin,
      procesado_por: "1002345678",
      huespedes,
    });

    res.status(201).json({
      success: true,
      message: "Check-in realizado correctamente",
      data: resultado,
    });
  } catch (error) {
    console.error("Error en check-in:", error);
    res.status(500).json({
      success: false,
      message: "Error al realizar el check-in",
    });
  }
}

module.exports = {
  crearCheckIn,
};
