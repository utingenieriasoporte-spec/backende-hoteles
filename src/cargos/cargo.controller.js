const CargosService = require("./cargo.service");

async function crearCargo(req, res) {
  try {
    const resultado = await CargosService.crearCargo(req.body);
    res.status(201).json({
      success: true,
      message: "Cargo creado correctamente",
      data: resultado,
    });
  } catch (error) {
    console.error("Error creando cargo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function listarCargos(req, res) {
  try {
    const { id_asignacion } = req.params;
    const cargos = await CargosService.listarCargos(id_asignacion);
    res.json(cargos);
  } catch (error) {
    console.error("Error listando cargos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function listarTodo(req, res) {
  try {
    const cargos = await CargosService.listarTodosLosCargos();
    res.json(cargos);
  } catch (error) {
    console.error("Error listando cargos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function obtenerCargo(req, res) {
  try {
    const cargo = await CargosService.obtenerCargo(req.params.id);
    res.json(cargo);
  } catch (error) {
    if (error.message === "CARGO_NO_EXISTE") {
      return res.status(404).json({ message: "Cargo no encontrado" });
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function actualizarCargo(req, res) {
  try {
    await CargosService.actualizarCargo(req.params.id, req.body);
    res.json({ message: "Cargo actualizado correctamente" });
  } catch (error) {
    if (error.message === "CARGO_NO_EXISTE") {
      return res.status(404).json({ message: "Cargo no encontrado" });
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function cancelarCargo(req, res) {
  try {
    await CargosService.cancelarCargo(req.params.id);
    res.json({ message: "Cargo cancelado correctamente" });
  } catch (error) {
    if (error.message === "CARGO_NO_EXISTE") {
      return res.status(404).json({ message: "Cargo no encontrado" });
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function listarCargosNumReserva(req, res) {
  try {
    const { numReserva } = req.params;
    const data = await CargosService.obtenerCargoPorNumReserva(numReserva);
    res.json(data);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  crearCargo,
  listarCargos,
  obtenerCargo,
  actualizarCargo,
  cancelarCargo,
  listarTodo,
  listarCargosNumReserva,
};
