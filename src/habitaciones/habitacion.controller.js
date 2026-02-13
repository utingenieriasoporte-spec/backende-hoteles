const habitacionesService = require("./habitacion.service");
const { agregarHabitacion } = require("./habitacion.service");

async function getAll(req, res) {
  try {
    const data = await habitacionesService.listarInfoHabitaciones(
      req.params.fecha,
    );
    res.json(data);
  } catch (error) {
    console.error("Error al obtener habitaciones", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function postHabitacion(req, res) {
  try {
    const id = await agregarHabitacion(req.body);
    res.status(201).json({ message: "Habitación creada", id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la habitación" });
  }
}

async function getHabitacion(req, res) {
  try {
    const habitacion = await habitacionesService.obtenerHabitacion(
      req.params.id,
    );
    res.json(habitacion);
  } catch (error) {
    res.status(404).json({ message: "Habitación no encontrada" });
  }
}

async function putHabitacion(req, res) {
  try {
    await habitacionesService.editarHabitacion(req.params.id, req.body);
    res.json({ message: "Habitación actualizada correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteHabitacion(req, res) {
  try {
    await habitacionesService.eliminarHabitacion(req.params.id);
    res.json({ message: "Habitación desactivada correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getDisponibilidad(req, res) {
  try {
    const { fecha, noches } = req.query;

    if (!fecha || !noches) {
      return res.status(400).json({
        message: "Faltan parámetros requeridos: fecha (YYYY-MM-DD) y noches",
      });
    }

    const data = await habitacionesService.listarHabitacionesDisponibles(
      fecha,
      parseInt(noches),
    );

    res.json(data);
  } catch (error) {
    console.error("Error al obtener disponibilidad", error);
    res.status(500).json({ message: "Error al consultar disponibilidad" });
  }
}

module.exports = {
  getAll,
  postHabitacion,
  getDisponibilidad,
  getHabitacion,
  putHabitacion,
  deleteHabitacion,
};
