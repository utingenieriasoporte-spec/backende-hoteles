const AlojadosService = require('../services/alojamientoService');

async function getAlojados(req, res) {
    try {
      const alojados = await AlojadosService.listarAlojados();
      res.json(alojados);
    } catch (error) {
      console.error('Error al obtener alojados:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  module.exports = {
    getAlojados
  };
