const checkOutsService = require("../services/checkOutsService");

async function crear(req, res) {
  try {
    const result = await checkOutsService.procesarCheckOut(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error en checkout", error.message);

    if (error.message === "ASIGNACION_NO_EXISTE") {
      return res.status(404).json({ message: "Asignación no encontrada" });
    }

    if (error.message === "ASIGNACION_NO_PAGADA") {
      return res.status(400).json({ message: "La asignación no está pagada" });
    }

    if (error.message === "PERSONA_LIMPIEZA_NO_CONFIGURADA") {
      return res
        .status(500)
        .json({ message: "No hay persona de limpieza configurada" });
    }

    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = {
  crear,
};
