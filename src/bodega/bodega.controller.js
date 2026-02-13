const bodegasService = require("./bodega.service");

async function getAll(req, res) {
  try {
    const data = await bodegasService.listarBodegas();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener bodegas", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function postBodega(req, res) {
  try {
    const id = await bodegasService.agregarBodega(req.body);
    res.status(201).json({ message: "Bodega creada", id });
  } catch (error) {
    console.error("Error al crear bodega", error);
    res.status(500).json({ message: "Error al crear la bodega" });
  }
}

async function getItemsByBodega(req, res) {
  try {
    const { id } = req.params;

    const items = await bodegasService.listarItemsPorBodega(id);

    res.json(items);
  } catch (error) {
    console.error("Error al obtener items por bodega", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = {
  getAll,
  postBodega,
  getItemsByBodega,
};
