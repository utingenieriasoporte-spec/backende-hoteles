const db = require("../../db");

const entradasModel = require("../entrada/entradas.model");
const salidasModel = require("../salida/salidas.model");
const inventarioBodegaModel = require("../inventario/inventariobodega.model");

/**
 * Registrar una ENTRADA de inventario
 */
async function registrarEntrada(data) {
  const {
    numeroReferencia,
    idItemInventario,
    idBodega,
    cantidad,
    valorItem,
    personaResponsable,
  } = data;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const idEntrada = await entradasModel.crearEntrada({
      numero_referencia: numeroReferencia,
      id_item_inventario: idItemInventario,
      id_bodega: idBodega,
      cantidad,
      valor_item: valorItem,
      persona_responsable: personaResponsable,
    });

    await inventarioBodegaModel.aumentarExistencias(
      idItemInventario,
      idBodega,
      cantidad,
    );

    await conn.commit();

    return idEntrada;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

/**
 * Registrar una SALIDA de inventario
 */
async function registrarSalida(data) {
  const {
    numeroReferencia,
    idItemInventario,
    idBodega,
    idBodegaDestino = null,
    cantidad,
    valorItem,
    personaResponsable,
  } = data;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Disminuir existencias (validación de stock)
    const affectedRows = await inventarioBodegaModel.disminuirExistencias(
      idItemInventario,
      idBodega,
      cantidad,
    );

    if (affectedRows === 0) {
      throw new Error("Stock insuficiente para realizar la salida");
    }

    // 2. Registrar salida
    const idSalida = await salidasModel.crearSalida({
      numero_referencia: numeroReferencia,
      id_item_inventario: idItemInventario,
      id_bodega: idBodega,
      id_bodega_destino: idBodegaDestino,
      cantidad,
      valor_item: valorItem,
      persona_responsable: personaResponsable,
    });

    // 3. Si hay bodega destino → aumentar existencias
    if (idBodegaDestino) {
      await inventarioBodegaModel.aumentarExistencias(
        idItemInventario,
        idBodegaDestino,
        cantidad,
      );
    }

    await conn.commit();

    return idSalida;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function listarInventarioPorBodega(idBodega) {
  const inventarioRaw =
    await inventarioBodegaModel.obtenerInventarioPorBodega(idBodega);

  return inventarioRaw.map((item) => ({
    idItemInventario: item.id_item_inventario,
    detalle: item.item,
    existencias: item.existencias,
  }));
}

async function obtenerEntradasPorBodega(idBodega) {
  const inventarioRaw =
    await entradasModel.obtenerEntradasPorIdBodega(idBodega);

  return inventarioRaw.map((item) => ({
    idEntrada: item.id_entrada,
    numeroReferencia: item.numero_referencia,
    fechaRealizado: item.fecha,
    cantidad: item.cantidad,
    valoritem: item.valor_item,
    personaResponsable: item.persona_responsable,
    idItemInventario: item.id_item_inventario,
    detalleItem: item.item,
    unidadPresentacion: item.unidad_presentacion,
    categoria: item.categoria,
  }));
}

async function obtenerSalidasPorBodega(idBodega) {
  const inventarioRaw = await salidasModel.obtenerSalidasPorIdBodega(idBodega);

  return inventarioRaw.map((item) => ({
    idSalida: item.id_salida,
    numeroReferencia: item.numero_referencia,
    fechaRealizado: item.fecha,
    cantidad: item.cantidad,
    valoritem: item.valor_item,
    personaResponsable: item.persona_responsable,
    idBodegaDestino: item.id_bodega_destino,
    idItemInventario: item.id_item_inventario,
    detalleItem: item.item,
    unidadPresentacion: item.unidad_presentacion,
    categoria: item.categoria,
  }));
}

module.exports = {
  registrarEntrada,
  registrarSalida,
  listarInventarioPorBodega,
  obtenerEntradasPorBodega,
  obtenerSalidasPorBodega,
};
