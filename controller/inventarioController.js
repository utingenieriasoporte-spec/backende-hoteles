const inventarioService = require("../services/inventarioService");
const movimientosInventarioService = require("../services/movimientosInventarioService");

async function getAll(req, res) {
  try {
    const data = await inventarioService.listarItemsInventario();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener items de inventario", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;

    const item = await inventarioService.obtenerItemInventario(id);

    if (!item) {
      return res
        .status(404)
        .json({ message: "Item de inventario no encontrado" });
    }

    res.json(item);
  } catch (error) {
    console.error("Error al obtener item de inventario", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function postItem(req, res) {
  try {
    const id = await inventarioService.agregarItemInventario(req.body);
    res.status(201).json({ message: "Item de inventario creado", id });
  } catch (error) {
    console.error("Error al crear item de inventario", error);
    res.status(500).json({ message: "Error al crear el item de inventario" });
  }
}

async function putItem(req, res) {
  try {
    const { id } = req.params;

    await inventarioService.actualizarItemInventario(id, req.body);

    res.json({ message: "Item de inventario actualizado" });
  } catch (error) {
    console.error("Error al actualizar item de inventario", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el item de inventario" });
  }
}

/**
 * POST /inventario/entradas
 */
async function postEntrada(req, res) {
  try {
    const id = await movimientosInventarioService.registrarEntrada(req.body);

    res.status(201).json({
      message: "Entrada registrada correctamente",
      id,
    });
  } catch (error) {
    console.error("Error al registrar entrada", error);
    res.status(500).json({
      message: error.message || "Error al registrar la entrada",
    });
  }
}

/**
 * POST /inventario/salidas
 */
async function postSalida(req, res) {
  try {
    const id = await movimientosInventarioService.registrarSalida(req.body);

    res.status(201).json({
      message: "Salida registrada correctamente",
      id,
    });
  } catch (error) {
    console.error("Error al registrar salida", error);

    // Error de stock controlado
    if (error.message === "Stock insuficiente para realizar la salida") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: "Error al registrar la salida",
    });
  }
}

/**
 * GET /inventario/bodegas/:id
 */
async function getInventarioByBodega(req, res) {
  try {
    const { id } = req.params;

    const inventario =
      await movimientosInventarioService.listarInventarioPorBodega(id);

    res.json(inventario);
  } catch (error) {
    console.error("Error al obtener inventario por bodega", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

async function getEntradasByBodega(req, res) {
  try {
    const { idBodega } = req.params;

    const inventario =
      await movimientosInventarioService.obtenerEntradasPorBodega(idBodega);

    res.json(inventario);
  } catch (error) {
    console.error("Error al obtener entradas por bodega", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

async function getSalidasByBodega(req, res) {
  try {
    const { idBodega } = req.params;

    const inventario =
      await movimientosInventarioService.obtenerSalidasPorBodega(idBodega);

    res.json(inventario);
  } catch (error) {
    console.error("Error al obtener entradas por bodega", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

module.exports = {
  getAll,
  getById,
  postItem,
  putItem,
  postEntrada,
  postSalida,
  getInventarioByBodega,
  getEntradasByBodega,
  getSalidasByBodega,
};
