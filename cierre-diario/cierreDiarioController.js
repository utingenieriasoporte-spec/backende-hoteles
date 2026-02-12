// cierre.controller.js

const cierreService = require("./cierreDiarioService");

async function crearCierre(req, res) {
  try {
    const cierre = await cierreService.registrarCierre(req.body);

    res.status(201).json({
      ok: true,
      message: "Cierre diario registrado (simulado)",
      data: cierre,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

async function obtenerCierres(req, res) {
  try {
    const { operador } = req.query;

    const cierres = await cierreService.listarCierres(operador);

    res.json({
      ok: true,
      data: cierres,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

module.exports = {
  crearCierre,
  obtenerCierres,
};
