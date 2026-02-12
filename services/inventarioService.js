const inventarioModel = require("../models/inventarioModel");

async function listarItemsInventario() {
  const itemsRaw = await inventarioModel.obtenerItemsInventario();

  return itemsRaw.map((item) => ({
    idItemInventario: item.id_item_inventario,
    detalle: item.detalle,
    unidadPresentacion: item.unidad_presentacion,
    categoria: item.categoria,
    existencias: item.existencias,
    valorUnitario: parseFloat(item.valor_unitario),
    // creadoEn: item.created_at,
    // actualizadoEn: item.updated_at,
  }));
}

async function obtenerItemInventario(idItemInventario) {
  const item = await inventarioModel.obtenerItemInventarioPorId(
    idItemInventario
  );

  if (!item) return null;

  return {
    idItemInventario: item.id_item_inventario,
    detalle: item.detalle,
    unidadPresentacion: item.ref_unidad_presentacion,
    categoria: item.ref_categoria,
    valorUnitario: parseFloat(item.valor_unitario),
    // creadoEn: item.created_at,
    // actualizadoEn: item.updated_at
  };
}

async function agregarItemInventario(data) {
  const { detalle, unidadPresentacion, categoria, valorUnitario } = data;

  return await inventarioModel.crearItemInventario({
    detalle,
    ref_unidad_presentacion: unidadPresentacion,
    ref_categoria: categoria,
    valor_unitario: valorUnitario,
  });
}

async function actualizarItemInventario(idItemInventario, data) {
  const { detalle, unidadPresentacion, categoria, valorUnitario } = data;

  await inventarioModel.actualizarItemInventario(idItemInventario, {
    detalle,
    ref_unidad_presentacion: unidadPresentacion,
    ref_categoria: categoria,
    valor_unitario: valorUnitario,
  });

  return true;
}

module.exports = {
  listarItemsInventario,
  obtenerItemInventario,
  agregarItemInventario,
  actualizarItemInventario,
};
