const asignacionService = require("./asignacionhabitacion.service");

async function asignar(req, res) {
  try {
    const resultado = await asignacionService.asignarHabitacion(req.body);
    res.status(201).json(resultado);
  } catch (err) {
    console.error("Error al asignar habitación:", err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function cambiar(req, res) {
  try {
    const resultado = await asignacionService.cambiarHabitacion(req.body);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = { asignar, cambiar };
