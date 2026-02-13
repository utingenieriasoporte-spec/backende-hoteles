const recaudoModel = require("./recaudo.model");
const pool = require("../../db");
// async function procesarPago(data) {
//   validarPago(data);
//   return await recaudoModel.crearFacturaYRecaudo(data);
// }

async function listarFacturas() {
  const rows = await recaudoModel.obtenerFacturas();
  const map = {};

  for (const r of rows) {
    if (!map[r.num_factura]) {
      map[r.num_factura] = {
        num_factura: r.num_factura,
        num_solicitud: r.num_solicitud,
        fecha_emision: r.fecha_emision,
        hora_emision: r.hora_emision,
        tipo_factura: r.tipo_factura,
        total_factura: r.total_factura,
        estado_pago: r.estado_pago,
        totales: {
          total_cargos: Number(r.total_cargos),
          total_abonado: Number(r.total_abonado),
          saldo_pendiente: Number(r.saldo_pendiente),
        },
        cargosAsociados: [],
        infoTitular: {
          idTitular: r.id_persona,
          nombre: r.nombre,
          email: r.email,
          telefono: r.telefono,
        },
      };
    }

    map[r.num_factura].cargosAsociados.push({
      idCargo: r.id_cargo,
      concepto: r.ref_concepto,
      estado: r.estado,
      total: r.total,
      montoAbonado: r.monto_abonado,
    });
  }

  return Object.values(map);
}

async function obtenerFactura(numFactura) {
  const factura = await recaudoModel.obtenerFacturaPorNumero(numFactura);

  if (!factura || factura.length === 0) {
    throw {
      status: 404,
      message: "Factura no encontrada",
    };
  }

  // porque viene de BD

  const infoFactura = {
    num_factura: factura.num_factura,
    fecha_emision: factura.fecha_emision,
    hora_emision: factura.hora_emision,
    tipo_factura: factura.tipo_factura,
    subtotal_factura: factura.subtotal_factura,
    total_factura: factura.total_factura,
    estado_pago: factura.estado_pago,
    totales: {
      total_cargos: Number(factura.total_cargos),
      total_abonado: Number(factura.total_abonado),
      saldo_pendiente: Number(factura.saldo_pendiente),
    },
    cargosAsociados: [
      {
        idCargo: factura.id_cargo,
        concepto: factura.ref_concepto,
        total: factura.total,
      },
    ],
    infoTitular: {
      idTitular: factura.id_persona,
      nombre: factura.nombre1,
      email: factura.email,
      telefono: factura.telefono,
    },
  };

  return infoFactura;
}

async function generarFactura(data) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const { cargos } = data;

    if (!Array.isArray(cargos) || cargos.length === 0) {
      throw new Error("Debe enviar una lista de cargos para facturar");
    }

    // Crear la factura usando los cargos proporcionados
    const factura = await recaudoModel.crearFactura(conn, {
      cargos,
    });

    await conn.commit();

    return factura;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function registrarRecaudo(data) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const obligatorios = [
      "numFactura",
      "idClienteDet",
      "nombreCliente",
      "correo",
      "valor",
      "telefono",
      "ref_operador",
      "metodo_pago",
      "cargos",
    ];

    for (const campo of obligatorios) {
      if (!data[campo]) {
        throw new Error(`El campo ${campo} es obligatorio`);
      }
    }

    await recaudoModel.crearRecaudo(conn, data);

    await conn.commit();

    return { success: true };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

function validarPago(data) {
  const obligatorios = [
    "idTitular",
    "numSolicitud",
    "idSolicitudDet",
    "idClienteDet",
    "nombreCliente",
    "correo",
    "telefono",
    "valor",
    "metodo_pago",
    "ref_operador",
  ];

  for (const campo of obligatorios) {
    if (!data[campo]) {
      throw new Error(`El campo ${campo} es obligatorio`);
    }
  }
}

async function obtenerListaRecaudo() {
  return await recaudoModel.obtenerRecaudos();
}

async function obtenerCargosFactura(numFactura) {
  const cargos = await recaudoModel.obtenerCargosPorFactura(numFactura);

  if (!cargos || cargos.length === 0) {
    throw {
      status: 404,
      message: "No se encontraron cargos para la factura",
    };
  }

  return {
    num_factura: numFactura,
    total_cargos: cargos.length,
    cargos,
  };
}

module.exports = {
  //procesarPago,
  generarFactura,
  registrarRecaudo,
  obtenerListaRecaudo,
  listarFacturas,
  obtenerCargosFactura,
  obtenerFactura,
};
