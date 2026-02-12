const pedidosAsignacionService = require("../services/pedidosAsignacionService");

async function postPedido(req, res) {
  try {
    const { id_pedido } = await pedidosAsignacionService.crearPedidoAsignacion(
      req.body,
    );

    res.status(201).json({
      message: "Pedido creado correctamente",
      id_pedido,
    });
  } catch (error) {
    console.error("Error al crear pedido de habitación", error);
    res.status(500).json({
      message: "Error al crear el pedido de habitación",
    });
  }
}

async function getByAsignacion(req, res) {
  try {
    const { idAsignacion } = req.params;

    const data =
      await pedidosAsignacionService.listarPedidosPorAsignacion(idAsignacion);

    res.json(data);
  } catch (error) {
    console.error("Error al listar pedidos por asignación", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

async function getPedidoAllByAsignacion(req, res) {
  try {
    const { idAsignacion } = req.params;

    const data =
      await pedidosAsignacionService.obtenerPedidoCompletoPorIdAsignacion(
        idAsignacion,
      );

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "No existen pedidos para la asignación indicada",
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Error al listar pedidos por asignación", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

async function procesarPedido(req, res) {
  try {
    const { idPedido } = req.params;

    const resultado = await pedidosAsignacionService.procesarPedido(idPedido);

    if (!resultado) {
      return res.status(404).json({
        message: "Pedido no encontrado",
      });
    }

    res.json({
      message: "Pedido procesado correctamente",
      data: resultado,
    });
  } catch (error) {
    console.error("Error al procesar pedido", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;

    const pedido = await pedidosAsignacionService.obtenerPedidoCompleto(id);

    if (!pedido) {
      return res.status(404).json({
        message: "Pedido no encontrado",
      });
    }

    res.json(pedido);
  } catch (error) {
    console.error("Error al obtener pedido", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

async function getAllPedidos(req, res) {
  try {
    const data = await pedidosAsignacionService.obtenerTodos();

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "No existen pedidos",
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Error al listar pedidos por asignación", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

module.exports = {
  postPedido,
  getByAsignacion,
  getById,
  getPedidoAllByAsignacion,
  procesarPedido,
  getAllPedidos,
};
