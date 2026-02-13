const reservaService = require("./reserva.service");

async function crear(req, res) {
  try {
    const resultado = await reservaService.registrarReserva(req.body);
    res.status(201).json(resultado);
  } catch (err) {
    console.error("Error al registrar reserva:", err.message);

    const status = err.statusCode || 500;

    res.status(status).json({
      success: false,
      message: err.message || "Error interno al registrar la reserva",
    });
  }
}

async function crearReservaConAsignacion(req, res) {
  try {
    const resultado = await reservaService.registrarReservaConAsignacion(
      req.body,
    );
    res.status(201).json(resultado);
  } catch (err) {
    console.error("Error al registrar reserva:", err.message);

    const status = err.statusCode || 500;

    res.status(status).json({
      success: false,
      message: err.message || "Error interno al registrar la reserva",
    });
  }
}

async function crearAmpliacionReserva(req, res) {
  try {
    const result = await reservaService.crearAmpliacionReserva(req.body);

    res.status(201).json({
      success: true,
      message: "Ampliación creada correctamente",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function listar(req, res) {
  try {
    const reservasObtenidas = await reservaService.listarReservas();
    res.status(201).json(reservasObtenidas);
  } catch (err) {
    console.error("Error al obtener reservas:", err);
    res.status(500).json({ error: "Error interno al obtener la reserva" });
  }
}

async function actualizarEstado(req, res) {
  try {
    const { numReserva, nuevoEstado } = req.body;
    const resultado = await reservaService.cambiarEstadoReserva(
      numReserva,
      nuevoEstado,
    );
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al actualizar estado:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function listarReservaPorIdTitular(req, res) {
  try {
    const { idTitular } = req.params;
    const resultado = await reservaService.listarReservaPorIdTitular(idTitular);
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
async function cancelarReserva(req, res) {
  try {
    const { num_solicitud } = req.params;

    const resultado = await reservaService.cancelarReserva(num_solicitud);

    res.json({
      success: true,
      message: resultado.mensaje,
    });
  } catch (error) {
    console.error("Error al cancelar reserva:", error);

    if (error.message === "RESERVA_NO_EXISTE") {
      return res.status(404).json({
        success: false,
        message: "La reserva no existe",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}

async function actualizarNovedadYObservaciones(req, res) {
  try {
    const { numSolicitud, refNovedades, observaciones } = req.body;

    if (!numSolicitud) {
      return res.status(400).json({
        success: false,
        message: "numSolicitud es obligatorio",
      });
    }

    const resultado = await reservaService.actualizarNovedadYObservaciones(
      numSolicitud,
      refNovedades,
      observaciones,
    );

    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al actualizar novedad:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function adicionarPersonasController(req, res, next) {
  try {
    const { numReserva, adultos, menores, noches, idAsignacion } = req.body;

    if (!numReserva) {
      return res.status(400).json({
        success: false,
        message: "El número de reserva es obligatorio",
      });
    }

    const result = await reservaService.adicionarPersonas({
      numReserva,
      adultos,
      menores,
      noches,
      idAsignacion,
    });

    return res.status(200).json(result);
  } catch (error) {
    error.statusCode = error.statusCode || 400;
    next(error);
  }
}

module.exports = {
  crear,
  listar,
  actualizarEstado,
  crearAmpliacionReserva,
  cancelarReserva,
  listarReservaPorIdTitular,
  actualizarNovedadYObservaciones,
  adicionarPersonasController,
  crearReservaConAsignacion,
};
