const cierreModel = require("./cierreDiarioModel");

function formatearFechaMySQL(fechaInput) {
  const date = new Date(fechaInput);

  if (isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function registrarCierre(data) {
  const { operador, fecha_desde, fecha_hasta } = data;

  if (!operador || !fecha_desde || !fecha_hasta) {
    throw new Error("operador, fecha_desde y fecha_hasta son obligatorios");
  }

  // Normalizamos formato
  const fechaDesdeFormateada = formatearFechaMySQL(fecha_desde);
  const fechaHastaFormateada = formatearFechaMySQL(fecha_hasta);

  if (!fechaDesdeFormateada || !fechaHastaFormateada) {
    throw new Error("Formato de fecha inválido");
  }

  if (new Date(fechaDesdeFormateada) >= new Date(fechaHastaFormateada)) {
    throw new Error("fecha_desde debe ser menor que fecha_hasta");
  }

  const existeCierre = await cierreModel.existeCierreDiario(
    operador,
    fechaDesdeFormateada,
    fechaHastaFormateada,
  );

  if (existeCierre) {
    throw new Error("Ya existe un cierre que se cruza con ese rango de fechas");
  }

  // Totales
  const totales = await cierreModel.obtenerTotalesRecaudos(
    fechaDesdeFormateada,
    fechaHastaFormateada,
  );

  const cierreData = {
    operador,
    fecha_desde: fechaDesdeFormateada,
    fecha_hasta: fechaHastaFormateada,
    cant_transacciones: totales.cant_transacciones,
    monto: totales.monto,
  };

  return await cierreModel.crearCierre(cierreData);
}

async function listarCierres(operador) {
  if (!operador) {
    throw new Error("Operador es obligatorio");
  }

  const rol = await cierreModel.obtenerRolOperador(operador);

  if (!rol) {
    throw new Error("Operador no existe en configuración");
  }

  // Si es ADMINISTRADOR → devuelve todos
  if (rol === "ADMINISTRADOR") {
    return cierreModel.obtenerCierres({});
  }

  // Si no → solo los suyos
  return cierreModel.obtenerCierres({ operador });
}

module.exports = {
  registrarCierre,
  listarCierres,
};
