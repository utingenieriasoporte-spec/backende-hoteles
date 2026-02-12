const db = require("../db");

async function obtenerReporteComandasHabitacion() {
  const [rows] = await db.execute(`
    SELECT 
      h.numero_habitacion,
      ph.fecha_pedido,
      phd.id_item_inventario,
      phd.cantidad,
      phd.valor_unitario,
      ii.detalle
    FROM pedidos_habitacion ph
    JOIN asignaciones_habitacion ah
      ON ph.id_asignacion = ah.id_asignacion
    JOIN habitaciones h
      ON ah.id_habitacion = h.id_habitacion
    JOIN pedidos_habitacion_det phd
      ON ph.id_pedido = phd.id_pedido
    JOIN items_inventario ii
      ON phd.id_item_inventario = ii.id_item_inventario
    ORDER BY h.numero_habitacion, ph.fecha_pedido;
  `);

  return rows;
}

module.exports = {
  obtenerReporteComandasHabitacion,
};
