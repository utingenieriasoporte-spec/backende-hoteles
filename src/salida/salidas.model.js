const db = require("../../db");

async function crearSalida(data) {
  const {
    numero_referencia = null,
    id_item_inventario,
    id_bodega,
    id_bodega_destino = null,
    cantidad,
    valor_item,
    persona_responsable,
  } = data;

  const [result] = await db.execute(
    `
    INSERT INTO salidas (
      numero_referencia,
      id_item_inventario,
      id_bodega,
      id_bodega_destino,
      cantidad,
      valor_item,
      persona_responsable
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      numero_referencia,
      id_item_inventario,
      id_bodega,
      id_bodega_destino,
      cantidad,
      valor_item,
      persona_responsable,
    ],
  );

  return result.insertId;
}

async function obtenerSalidasPorIdBodega(idBodega) {
  const [rows] = await db.execute(
    `
    SELECT
      s.id_salida,
      s.numero_referencia,
      s.fecha,
      s.cantidad,
      s.valor_item,
      s.persona_responsable,
      s.id_bodega_destino,

      i.id_item_inventario,
      i.detalle AS item,

      cu.detalle AS unidad_presentacion,
      cc.detalle AS categoria
    FROM salidas s
    JOIN items_inventario i
      ON i.id_item_inventario = s.id_item_inventario

    LEFT JOIN config cu
      ON cu.codigo = i.ref_unidad_presentacion
     AND cu.entidad = 'UNIDAD_PRESENTACION'

    LEFT JOIN config cc
      ON cc.codigo = i.ref_categoria
     AND cc.entidad = 'TIPO_CATEGORIA_INVENTARIO'

    WHERE s.id_bodega = ?
    ORDER BY s.fecha DESC
    `,
    [idBodega],
  );

  return rows;
}

module.exports = {
  crearSalida,
  obtenerSalidasPorIdBodega,
};
