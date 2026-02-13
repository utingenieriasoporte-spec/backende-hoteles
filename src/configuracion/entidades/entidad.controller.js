const entidadesService = require("./entidad.service");

async function getAll(req, res) {
  try {
    const data = await entidadesService.listarEntidades();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener habitaciones", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function crear(req, res) {
  try {
    const nuevaEntidad = await entidadesService.crearEntidad(req.body);
    res.status(201).json(nuevaEntidad);
  } catch (error) {
    console.error("Error al crear entidad", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function actualizarDetalle(req, res) {
  try {
    const { entidad, codigo, detalle } = req.body;

    const result = await entidadesService.actualizarDetalle(
      entidad,
      codigo,
      detalle,
    );

    if (!result) {
      return res.status(404).json({ message: "Entidad no encontrada" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error al actualizar detalle", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function listarPorEntidad(req, res) {
  try {
    const result = await entidadesService.listarDetallePorEntidad(
      req.params.entidad,
    );

    if (!result) {
      return res.status(404).json({ message: "Entidad no encontrada" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error al encontrar detalle", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = {
  getAll,
  crear,
  actualizarDetalle,
  listarPorEntidad,
};
