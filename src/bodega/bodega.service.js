const bodegasModel = require("./bodega.model");

async function listarBodegas() {
  const bodegasRaw = await bodegasModel.obtenerBodegas();

  return bodegasRaw.map((b) => ({
    idBodega: b.id_bodega,
    detalle: b.detalle,
    tipo: b.tipo,
    estado: b.estado,
  }));
}

async function agregarBodega(data) {
  const { detalle, tipo, estado } = data;

  return await bodegasModel.crearBodega({
    detalle,
    tipo,
    estado,
  });
}

async function listarItemsPorBodega(idBodega) {
  const itemsRaw = await bodegasModel.obtenerItemsPorBodega(idBodega);

  return itemsRaw.map((item) => ({
    idBodega: item.id_bodega,
    bodega: item.bodega,

    idItemInventario: item.id_item_inventario,
    detalle: item.item,
    unidadPresentacion: item.ref_unidad_presentacion,
    categoria: item.ref_categoria,
    valorUnitario: parseFloat(item.valor_unitario),
    existencias: item.existencias,
  }));
}

module.exports = {
  listarBodegas,
  agregarBodega,
  listarItemsPorBodega,
};
