const db = require("../../db");
const pedidosAsignacionModel = require("./pedidosasignacion.model");
const inventarioModel = require("../inventario/inventario.model");
const inventarioBodegaModel = require("../inventario/inventariobodega.model");
const configModel = require("../configuracion/entidades/entidad.model");

async function crearPedidoAsignacion({
  idAsignacion,
  items,
  observaciones,
  operador,
}) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const configBodega = await configModel.obtenerDetalleConfig(
      "VARIABLES_GLOBALES",
      "BODEGA_CONSUMO",
    );

    if (!configBodega) {
      throw new Error("No está configurada la bodega de consumo");
    }

    const ID_BODEGA_CONSUMO = parseInt(configBodega.detalle, 10);

    const id_pedido = await pedidosAsignacionModel.crearPedidoAsignacion(
      {
        idAsignacion,
        observaciones,
        operador,
      },
      connection,
    );

    for (const item of items) {
      const { idItemInventario, cantidad } = item;

      const itemInventario = await inventarioModel.obtenerItemInventarioPorId(
        idItemInventario,
        connection,
      );

      if (!itemInventario) {
        throw new Error(`El ítem ${idItemInventario} no existe`);
      }

      const stockActual = await inventarioBodegaModel.obtenerStockItem(
        idItemInventario,
        ID_BODEGA_CONSUMO,
        connection,
      );

      // if (stockActual < cantidad) {
      //   throw new Error(`Stock insuficiente para ${itemInventario.detalle}`);
      // }

      await pedidosAsignacionModel.agregarItemPedidoAsignacion(
        {
          id_pedido,
          idItemInventario,
          cantidad,
          valor_unitario: itemInventario.valor_unitario,
        },
        connection,
      );

      await inventarioBodegaModel.registrarSalida(
        {
          idItemInventario,
          idBodega: ID_BODEGA_CONSUMO,
          cantidad,
          valorItem: itemInventario.valor_unitario,
          personaResponsable: operador,
          referencia: `PED-${id_pedido}`,
        },
        connection,
      );

      await inventarioBodegaModel.descontarStock(
        idItemInventario,
        ID_BODEGA_CONSUMO,
        cantidad,
        connection,
      );
    }

    await connection.commit();
    return { id_pedido };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function listarPedidosPorAsignacion(id_asignacion) {
  return await pedidosAsignacionModel.obtenerPedidosPorAsignacion(
    id_asignacion,
  );
}

async function obtenerPedidoCompletoPorIdAsignacion(id_asignacion) {
  const rows =
    await pedidosAsignacionModel.obtenerPedidoCompletoPorAsignacion(
      id_asignacion,
    );

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map((data) => ({
    idPedido: data.id_pedido,
    idAsignacion: data.id_asignacion,
    fechaPedido: data.fecha_pedido,
    estado: data.estado,
    observacion: data.observacion,
    totalPedido: parseFloat(data.total_pedido),
  }));
}

async function obtenerPedidoCompleto(id_pedido) {
  const pedido = await pedidosAsignacionModel.obtenerPedidoPorId(id_pedido);

  if (!pedido) return null;

  const detalle = await pedidosAsignacionModel.obtenerDetallePedido(id_pedido);

  return {
    ...pedido,
    items: detalle,
  };
}

async function procesarPedido(idPedido) {
  const filasAfectadas =
    await pedidosAsignacionModel.marcarPedidoComoProcesado(idPedido);

  if (filasAfectadas === 0) {
    return null;
  }

  return {
    idPedido,
    estado: "PROCESADO",
  };
}

async function obtenerTodos() {
  const rows = await pedidosAsignacionModel.obtenerPedidos();

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map((pa) => ({
    idPedido: pa.id_pedido,
    fechaPedido: pa.fecha_pedido,
    estado: pa.estado,
    observacion: pa.observacion,
    operador: pa.operador,
    infoHabitacion: {
      idAsignacion: pa.id_asignacion,
      idHabitacion: pa.id_habitacion,
      numeroHabitacion: pa.numero_habitacion,
      piso: pa.piso,
      numSolicitud: pa.num_solicitud,
    },
    infoPersona: {
      idTitular: pa.id_titular,
      razonSocial: pa.razon_social,
      email: pa.email,
      telefono: pa.telefono,
    },
  }));
}

module.exports = {
  crearPedidoAsignacion,
  listarPedidosPorAsignacion,
  obtenerPedidoCompleto,
  obtenerPedidoCompletoPorIdAsignacion,
  procesarPedido,
  obtenerTodos,
};
