const db = require("./db");

async function obtenerBodegas() {
  const [rows] = await db.execute(`
    SELECT
      id_bodega,
      detalle,
      tipo,
      estado
    FROM bodegas
    ORDER BY detalle ASC
  `);

  return rows;
}

async function crearBodega(data) {
  const { detalle, tipo, estado = 1 } = data;

  const [result] = await db.execute(
    `
    INSERT INTO bodegas (
      detalle,
      tipo,
      estado
    ) VALUES (?, ?, ?)
  `,
    [detalle, tipo, estado]
  );

  return result.insertId;
}

async function obtenerItemsPorBodega(id_bodega) {
  const [rows] = await db.execute(
    `
    SELECT
      sb.id_bodega,
      b.detalle AS bodega,
      i.id_item_inventario,
      i.detalle AS item,
      i.ref_unidad_presentacion,
      i.ref_categoria,
      i.valor_unitario,
      ib.existencias
    FROM inventario_bodega ib
    JOIN items_inventario i
      ON i.id_item_inventario = ib.id_item_inventario
    JOIN bodegas b
      ON b.id_bodega = ib.id_bodega
    WHERE ib.id_bodega = ?
    ORDER BY i.detalle ASC
  `,
    [id_bodega]
  );

  return rows;
}

module.exports = {
  obtenerBodegas,
  crearBodega,
  obtenerItemsPorBodega
};
