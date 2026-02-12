const db = require("./db");

async function obtenerInventarioPorBodega(id_bodega) {
  const [rows] = await db.execute(
    `
    SELECT
      ib.id_item_inventario,
      i.detalle AS item,
      ib.existencias
    FROM inventario_bodega ib
    JOIN items_inventario i
      ON i.id_item_inventario = ib.id_item_inventario
    WHERE ib.id_bodega = ?
    ORDER BY i.detalle ASC
    `,
    [id_bodega]
  );

  return rows;
}

async function aumentarExistencias(id_item, id_bodega, cantidad) {
  await db.execute(
    `
    INSERT INTO inventario_bodega (
      id_item_inventario,
      id_bodega,
      existencias
    ) VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      existencias = existencias + VALUES(existencias)
    `,
    [id_item, id_bodega, cantidad]
  );
}

async function disminuirExistencias(id_item, id_bodega, cantidad) {
  const [result] = await db.execute(
    `
    UPDATE inventario_bodega
    SET existencias = existencias - ?
    WHERE id_item_inventario = ?
      AND id_bodega = ?
      AND existencias >= ?
    `,
    [cantidad, id_item, id_bodega, cantidad]
  );

  return result.affectedRows;
}

async function obtenerStockItem(idItem, idBodega, connection) {
  const [rows] = await connection.execute(
    `
    SELECT existencias
    FROM inventario_bodega
    WHERE id_item_inventario = ? AND id_bodega = ?
    `,
    [idItem, idBodega]
  );

  return rows[0]?.existencias ?? 0;
}

async function descontarStock(idItem, idBodega, cantidad, connection) {
  await connection.execute(
    `
    UPDATE inventario_bodega
    SET existencias = existencias - ?
    WHERE id_item_inventario = ? AND id_bodega = ?
    `,
    [cantidad, idItem, idBodega]
  );
}

async function registrarSalida(data, connection) {
  const {
    idItemInventario,
    idBodega,
    cantidad,
    valorItem,
    personaResponsable,
    referencia,
  } = data;

  await connection.execute(
    `
    INSERT INTO salidas (
      numero_referencia,
      id_item_inventario,
      id_bodega,
      cantidad,
      valor_item,
      persona_responsable
    ) VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      referencia,
      idItemInventario,
      idBodega,
      cantidad,
      valorItem,
      personaResponsable,
    ]
  );
}

module.exports = {
  obtenerInventarioPorBodega,
  aumentarExistencias,
  disminuirExistencias,
  descontarStock,
  obtenerStockItem,
  registrarSalida
};
