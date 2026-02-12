const db = require("./db");

async function obtenerPedidos() {
  const [rows] = await db.execute(
    `SELECT
  pa.id_pedido,
  pa.fecha_pedido,
  pa.estado,
  pa.observacion,
  pa.operador,

  ah.id_asignacion,

  h.id_habitacion,
  h.numero_habitacion,
  h.piso,

  sa.num_solicitud,
  sa.id_titular,
  p.razon_social,
  pd.email,
  pd.telefono

FROM pedidos_habitacion pa
JOIN asignaciones_habitacion ah
  ON ah.id_asignacion = pa.id_asignacion
JOIN habitaciones h
  ON h.id_habitacion = ah.id_habitacion
JOIN solicitudes_alojamiento_det sad
  ON sad.id_solicitud_det = ah.id_solicitud_det
JOIN solicitudes_alojamiento sa
  ON sa.num_solicitud = sad.num_solicitud
JOIN personas p
  ON p.id_persona = sa.id_titular
JOIN personas_det pd
  ON pd.id_persona = p.id_persona

GROUP BY pa.id_pedido
ORDER BY pa.fecha_pedido DESC;
  `,
  );

  return rows;
}

async function crearPedidoAsignacion(data) {
  const {
    idAsignacion,
    estado = "REGISTRADO",
    observaciones = null,
    operador,
  } = data;

  const [result] = await db.execute(
    `
    INSERT INTO pedidos_habitacion (
      id_asignacion,
      fecha_pedido,
      estado,
      observacion,
      operador
    ) VALUES (?, NOW(), ?, ?, ?)
  `,
    [idAsignacion, estado, observaciones, operador],
  );

  return result.insertId;
}

async function agregarItemPedidoAsignacion(data) {
  const { id_pedido, idItemInventario, cantidad, valor_unitario } = data;

  const [result] = await db.execute(
    `
    INSERT INTO pedidos_habitacion_det (
      id_pedido,
      id_item_inventario,
      cantidad,
      valor_unitario
    ) VALUES (?, ?, ?, ?)
  `,
    [id_pedido, idItemInventario, cantidad, valor_unitario],
  );

  return result.insertId;
}

async function obtenerPedidosPorAsignacion(id_asignacion) {
  const [rows] = await db.execute(
    `
    SELECT
      pa.id_pedido,
      pa.fecha_pedido,
      pa.estado,
      pa.observacion
    FROM pedidos_habitacion pa
    WHERE pa.id_asignacion = ?
    ORDER BY pa.fecha_pedido DESC
  `,
    [id_asignacion],
  );

  return rows;
}

async function obtenerDetallePedido(id_pedido) {
  const [rows] = await db.execute(
    `
    SELECT
      pad.id_pedido_det,
      i.id_item_inventario,
      i.detalle AS item,
      i.ref_unidad_presentacion,
      pad.cantidad,
      pad.valor_unitario,
      i.ref_categoria AS ref_categoria
    FROM pedidos_habitacion_det pad
    JOIN items_inventario i
      ON i.id_item_inventario = pad.id_item_inventario
    WHERE pad.id_pedido = ?
  `,
    [id_pedido],
  );

  return rows;
}

async function obtenerPedidoPorId(id_pedido) {
  const [rows] = await db.execute(
    `
    SELECT
      pa.id_pedido,
      pa.id_asignacion,
      pa.fecha_pedido,
      pa.estado,
      pa.observacion
    FROM pedidos_habitacion pa
    WHERE pa.id_pedido = ?
    `,
    [id_pedido],
  );

  return rows[0] || null;
}

async function obtenerPedidoCompletoPorAsignacion(idAsignacion) {
  const [rows] = await db.execute(
    `
    SELECT
      ph.id_pedido,
      ph.id_asignacion,
      ph.fecha_pedido,
      ph.estado,
      ph.observacion,
      IFNULL(SUM(pdh.cantidad * pdh.valor_unitario), 0) AS total_pedido
    FROM pedidos_habitacion ph
    LEFT JOIN pedidos_habitacion_det pdh
      ON pdh.id_pedido = ph.id_pedido
    WHERE ph.id_asignacion = ?
    GROUP BY
      ph.id_pedido,
      ph.id_asignacion,
      ph.fecha_pedido,
      ph.estado,
      ph.observacion
    ORDER BY ph.fecha_pedido DESC
    `,
    [idAsignacion],
  );

  return rows;
}

async function marcarPedidoComoProcesado(idPedido) {
  const [result] = await db.execute(
    `
    UPDATE pedidos_habitacion
    SET estado = 'PROCESADO'
    WHERE id_pedido = ?
    `,
    [idPedido],
  );

  return result.affectedRows;
}

module.exports = {
  marcarPedidoComoProcesado,
};

module.exports = {
  crearPedidoAsignacion,
  agregarItemPedidoAsignacion,
  obtenerPedidosPorAsignacion,
  obtenerDetallePedido,
  obtenerPedidoPorId,
  obtenerPedidoCompletoPorAsignacion,
  marcarPedidoComoProcesado,
  obtenerPedidos,
};
