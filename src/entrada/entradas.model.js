const db = require("../../db");

async function crearEntrada(data) {
  const {
    numero_referencia = null,
    id_item_inventario,
    id_bodega,
    cantidad,
    valor_item,
    persona_responsable,
  } = data;

  const [result] = await db.execute(
    `
    INSERT INTO entradas (
      numero_referencia,
      id_item_inventario,
      id_bodega,
      cantidad,
      valor_item,
      persona_responsable
    ) VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      numero_referencia,
      id_item_inventario,
      id_bodega,
      cantidad,
      valor_item,
      persona_responsable,
    ],
  );

  return result.insertId;
}

async function obtenerEntradasPorIdBodega(idBodega) {
  const [rows] = await db.execute(
    `
    SELECT
      e.id_entrada,
      e.numero_referencia,
      e.fecha,
      e.cantidad,
      e.valor_item,
      e.persona_responsable,

      i.id_item_inventario,
      i.detalle AS item,

      cu.detalle AS unidad_presentacion,
      cc.detalle AS categoria
    FROM entradas e
    JOIN items_inventario i
      ON i.id_item_inventario = e.id_item_inventario

    LEFT JOIN config cu
      ON cu.codigo = i.ref_unidad_presentacion
     AND cu.entidad = 'UNIDAD_PRESENTACION'

    LEFT JOIN config cc
      ON cc.codigo = i.ref_categoria
     AND cc.entidad = 'TIPO_CATEGORIA_INVENTARIO'

    WHERE e.id_bodega = ?
    ORDER BY e.fecha DESC
    `,
    [idBodega],
  );

  return rows;
}

module.exports = {
  crearEntrada,
  obtenerEntradasPorIdBodega,
};
