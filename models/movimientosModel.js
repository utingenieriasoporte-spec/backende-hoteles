const db = require("./db");

async function obtenerMovimientosPorItem(id_item_inventario) {
  const [rows] = await db.execute(
    `
    SELECT
      'ENTRADA' AS tipo,
      id_entrada AS id_movimiento,
      fecha,
      cantidad,
      id_bodega,
      NULL AS id_bodega_destino
    FROM entradas
    WHERE id_item_inventario = ?

    UNION ALL

    SELECT
      'SALIDA' AS tipo,
      id_salida AS id_movimiento,
      fecha,
      cantidad,
      id_bodega,
      id_bodega_destino
    FROM salidas
    WHERE id_item_inventario = ?

    ORDER BY fecha DESC
    `,
    [id_item_inventario, id_item_inventario]
  );

  return rows;
}

module.exports = {
  obtenerMovimientosPorItem,
};
