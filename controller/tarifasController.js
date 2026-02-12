const tarifasService = require("../services/tarifaService");

async function getAll(req, res) {
  try {
    const data = await tarifasService.listarTarifas();
    res.json(data);
  } catch (error) {
    console.error("Error al listar tarifas", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getById(req, res) {
  try {
    const tarifa = await tarifasService.obtenerTarifa(req.params.id);
    if (!tarifa) {
      return res.status(404).json({ message: "Tarifa no encontrada" });
    }
    res.json(tarifa);
  } catch (error) {
    console.error("Error al obtener tarifa", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function crear(req, res) {
  try {
    const tarifa = await tarifasService.crearTarifa(req.body);
    res.status(201).json(tarifa);
  } catch (error) {
    console.error("Error al crear tarifa", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function actualizar(req, res) {
  try {
    const tarifa = await tarifasService.actualizarTarifa(
      req.params.id,
      req.body,
    );

    if (!tarifa) {
      return res.status(404).json({ message: "Tarifa no encontrada" });
    }

    res.json(tarifa);
  } catch (error) {
    console.error("Error al actualizar tarifa", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function eliminar(req, res) {
  try {
    const eliminado = await tarifasService.eliminarTarifa(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ message: "Tarifa no encontrada" });
    }
    res.json({ message: "Tarifa eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar tarifa", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = {
  getAll,
  getById,
  crear,
  actualizar,
  eliminar,
};
