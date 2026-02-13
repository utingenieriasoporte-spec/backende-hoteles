const Cargos = require("./cargo.model");

async function crearCargo(data) {
  const idCargo = await Cargos.crearCargo(data);
  return { id_cargo: idCargo };
}

async function listarCargos(idAsignacion) {
  const listCargos = await Cargos.listarCargosPorAsignacion(idAsignacion);
  return listCargos.map((c) => ({
    id_cargo: c.id_cargo,
    asignacionVigente: {
      numReserva: c.num_solicitud,
      idAsignacionHabitacion: c.id_asignacion,
      habitacion: c.numero_habitacion,
      piso: c.piso,
      fechaAsignacion: c.fecha_asignacion,
      fechaDesde: c.fecha_desde,
      fechaHasta: c.fecha_hasta,
    },
    concepto: c.detalle,
    observaciones: c.observaciones,
    montoAbonado: c.monto_abonado,
    total: c.total,
    estado: c.estado,
  }));
}

async function listarTodosLosCargos() {
  const listCargos = await Cargos.obtenerCargos();
  const infoCargos = listCargos.map((c) => ({
    id_cargo: c.id_cargo,
    asignacionVigente: {
      numReserva: c.num_solicitud,
      idAsignacionHabitacion: c.id_asignacion,
      habitacion: c.numero_habitacion,
      piso: c.piso,
      fechaAsignacion: c.fecha_asignacion,
      fechaDesde: c.fecha_desde,
      fechaHasta: c.fecha_hasta,
    },
    concepto: c.detalle,
    observaciones: c.observaciones,
    montoAbonado: c.monto_abonado,
    total: c.total,
    estado: c.estado,
  }));
  return infoCargos;
}

async function obtenerCargo(idCargo) {
  const c = await Cargos.obtenerCargoPorId(idCargo);
  if (!c) {
    throw new Error("CARGO_NO_EXISTE");
  }

  return {
    id_cargo: c.id_cargo,
    asignacionVigente: {
      numReserva: c.num_solicitud,
      idAsignacionHabitacion: c.id_asignacion,
      habitacion: c.numero_habitacion,
      piso: c.piso,
      fechaAsignacion: c.fecha_asignacion,
      fechaDesde: c.fecha_desde,
      fechaHasta: c.fecha_hasta,
    },
    concepto: c.detalle,
    observaciones: c.observaciones,
    montoAbonado: c.monto_abonado,
    total: c.total,
    estado: c.estado,
  };
}

async function actualizarCargo(idCargo, data) {
  await obtenerCargo(idCargo);
  await Cargos.actualizarCargo(idCargo, data);
}

async function cancelarCargo(idCargo) {
  await obtenerCargo(idCargo);
  await Cargos.cancelarCargo(idCargo);
}

async function obtenerCargoPorNumReserva(numReserva) {
  const c = await Cargos.obtenerCargosPorNumReserva(numReserva);
  if (!c) {
    throw new Error("CARGO_NO_EXISTE");
  }

  return {
    id_cargo: c.id_cargo,
    asignacionVigente: {
      numReserva: c.num_solicitud,
      idAsignacionHabitacion: c.id_asignacion,
      habitacion: c.numero_habitacion,
      piso: c.piso,
      fechaAsignacion: c.fecha_asignacion,
      fechaDesde: c.fecha_desde,
      fechaHasta: c.fecha_hasta,
    },
    concepto: c.detalle,
    observaciones: c.observaciones,
    montoAbonado: c.monto_abonado,
    total: c.total,
    estado: c.estado,
  };
}

module.exports = {
  crearCargo,
  listarCargos,
  obtenerCargo,
  actualizarCargo,
  cancelarCargo,
  listarTodosLosCargos,
  obtenerCargoPorNumReserva,
};
