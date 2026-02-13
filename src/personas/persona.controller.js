const personaService = require("./persona.service");

async function crear(req, res) {
  try {
    const result = await personaService.crearPersona(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function listar(req, res) {
  try {
    const personas = await personaService.listarPersonas();
    res.status(200).json(personas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function obtenerPorId(req, res) {
  try {
    const persona = await personaService.obtenerPersona(req.params.id);
    res.status(200).json(persona);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function actualizar(req, res) {
  try {
    const result = await personaService.actualizarPersona(
      req.params.id,
      req.body,
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function eliminar(req, res) {
  try {
    const result = await personaService.eliminarPersona(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  crear,
  listar,
  obtenerPorId,
  actualizar,
  eliminar,
};
