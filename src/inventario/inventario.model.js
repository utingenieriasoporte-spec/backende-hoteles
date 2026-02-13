const db = require("../../db");

async function obtenerItemsInventario() {
  const [rows] = await db.execute(`
    SELECT
      i.id_item_inventario,
      i.detalle,

      cu.detalle AS unidad_presentacion,
      cc.detalle AS categoria,

      i.valor_unitario,

      IFNULL(SUM(ib.existencias), 0) AS existencias

    FROM items_inventario i

    LEFT JOIN config cu
      ON cu.codigo = i.ref_unidad_presentacion
     AND cu.entidad = 'UNIDAD_PRESENTACION'

    LEFT JOIN config cc
      ON cc.codigo = i.ref_categoria
     AND cc.entidad = 'TIPO_CATEGORIA_INVENTARIO'

    LEFT JOIN inventario_bodega ib
      ON ib.id_item_inventario = i.id_item_inventario

    GROUP BY
      i.id_item_inventario,
      i.detalle,
      cu.detalle,
      cc.detalle,
      i.valor_unitario

    ORDER BY i.detalle ASC
  `);

  return rows;
}

async function obtenerItemInventarioPorId(id_item_inventario) {
  const [rows] = await db.execute(
    `
    SELECT
      id_item_inventario,
      detalle,
      ref_unidad_presentacion,
      ref_categoria,
      valor_unitario,
      created_at,
      updated_at
    FROM items_inventario
    WHERE id_item_inventario = ?
  `,
    [id_item_inventario],
  );

  return rows[0] || null;
}

async function crearItemInventario(data) {
  const { detalle, ref_unidad_presentacion, ref_categoria, valor_unitario } =
    data;

  const [result] = await db.execute(
    `
    INSERT INTO items_inventario (
      detalle,
      ref_unidad_presentacion,
      ref_categoria,
      valor_unitario,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, NOW(), NOW())
  `,
    [detalle, ref_unidad_presentacion, ref_categoria, valor_unitario],
  );

  return result.insertId;
}

async function actualizarItemInventario(id_item_inventario, data) {
  const { detalle, ref_unidad_presentacion, ref_categoria, valor_unitario } =
    data;

  await db.execute(
    `
    UPDATE items_inventario
    SET
      detalle = ?,
      ref_unidad_presentacion = ?,
      ref_categoria = ?,
      valor_unitario = ?,
      updated_at = NOW()
    WHERE id_item_inventario = ?
  `,
    [
      detalle,
      ref_unidad_presentacion,
      ref_categoria,
      valor_unitario,
      id_item_inventario,
    ],
  );

  return true;
}

// /**
//  * Eliminar un item de inventario
//  * (recomendado: solo si NO tiene movimientos)
//  */
// async function eliminarItemInventario(id_item_inventario) {
//   await db.execute(`
//     DELETE FROM items_inventario
//     WHERE id_item_inventario = ?
//   `, [id_item_inventario]);

//   return true;
// }

module.exports = {
  obtenerItemsInventario,
  obtenerItemInventarioPorId,
  crearItemInventario,
  actualizarItemInventario,
  //   eliminarItemInventario
};
