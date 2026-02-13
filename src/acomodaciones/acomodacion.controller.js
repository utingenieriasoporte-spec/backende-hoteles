const acomodacionService = require("./acomodacion.service");

async function crearAcomodacion(req, res) {
  try {
    const id = await acomodacionService.agregarAcomodacion(req.body);
    res.status(201).json({ message: "Acomodación creada", id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la acomodación" });
  }
}

async function listarAcomodaciones(req, res) {
  try {
    const acodamaciones = await acomodacionService.listarAcomidaciones();
    res.status(200).json(acodamaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar las acomodaciones" });
  }
}

async function listarAcomodacionPorReferencia(req, res) {
  try {
    const { ref_tipo_acomodacion } = req.params;
    const acomodaciones =
      await acomodacionService.listarAcomodacionPorReferencia(
        ref_tipo_acomodacion,
      );
    res.status(200).json(acomodaciones);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al listar acomodación por referencia" });
  }
}

async function actualizarAcomodacion(req, res) {
  try {
    const { id } = req.params;
    const rows = await acomodacionService.editarAcomodacion(id, req.body);

    if (!rows) {
      return res.status(404).json({ message: "Acomodación no encontrada" });
    }

    res.status(200).json({ message: "Acomodación actualizada" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la acomodación" });
  }
}

async function eliminarAcomodacion(req, res) {
  try {
    const { id } = req.params;
    const rows = await acomodacionService.borrarAcomodacion(id);

    if (!rows) {
      return res.status(404).json({ message: "Acomodación no encontrada" });
    }

    res.status(200).json({ message: "Acomodación eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la acomodación" });
  }
}

module.exports = {
  crearAcomodacion,
  listarAcomodaciones,
  listarAcomodacionPorReferencia,
  actualizarAcomodacion,
  eliminarAcomodacion,
};
