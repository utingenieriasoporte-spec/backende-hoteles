const checkOutsModel = require("../models/checkOut");
const entidadModel = require("../models/entidades");
const tarifasModel = require("../models/tarifaModel");

async function procesarCheckOut(data) {
  const {
    numSolicitud,
    procesado_por,
    auto_checkout,
    ref_concepto,
    observaciones,
    monto_abonado,
  } = data;

  if (!numSolicitud) throw new Error("NUM_SOLICITUD_REQUERIDA");

  const asignacion =
    await checkOutsModel.obtenerEstadoSolicitudPorNumeroSolicitud(numSolicitud);

  if (!asignacion) throw new Error("ASIGNACION_NO_EXISTE");

  await checkOutsModel.crearCheckOut({
    id_asignacion_habitacion: asignacion.id_asignacion,
    procesado_por,
    auto_checkout: auto_checkout ?? false,
    estado: "COMPLETADO",
  });

  const personaLimpieza = await entidadModel.obtenerDetalleConfig(
    "OPERADOR_SISTEMA",
    "1001234567",
  );

  if (!personaLimpieza) throw new Error("PERSONA_LIMPIEZA_NO_CONFIGURADA");

  await checkOutsModel.actualizarLimpiezaAsignacion(
    asignacion.id_asignacion,
    personaLimpieza.codigo,
  );

  // await cargosModel.crearCargo({
  //   id_asignacion_habitacion: asignacion.id_asignacion,
  //   ref_concepto,
  //   observaciones,
  //   monto_abonado,
  //   total,
  //   procesado_por,
  // });

  return { success: true };
}

module.exports = {
  procesarCheckOut,
};
