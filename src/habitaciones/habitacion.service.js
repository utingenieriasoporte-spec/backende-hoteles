const habitacionModel = require("./habitacion.model");

async function listarInfoHabitaciones(fecha) {
  if (!fecha) {
    fecha = new Date().toISOString().split("T")[0];
  }

  const rows = await habitacionModel.obtenerInformacionHabitacion(fecha);

  const habitacionesMap = new Map();

  for (const h of rows) {
    if (!habitacionesMap.has(h.id)) {
      habitacionesMap.set(h.id, {
        id: h.id,
        estado: h.estado,
        piso: h.piso,
        numeroHabitacion: h.numero_habitacion,
        descripcion: h.descripcion_habitacion,
        tipoAcomodacion: {
          codigo: h.tipo_codigo,
          detalle: h.tipo_detalle,
        },
        ocupacionMax: h.ocupacion_max,
        capacidadInstalada: h.capacidad_instalada,
        imagenes: h.imagenes ? JSON.parse(h.imagenes) : [],
        tarifasVigentes: {
          valorPersona: h.valor_persona,
          valorMes: h.valor_mes,
          valorHabitacion: h.valor_habitacion,
          valorAdicionalAdulto: h.valor_adicional_adulto,
          valorAdicionalMenor: h.valor_adicional_menor,
        },
        reservas: null, // 👈 ahora es null por defecto
      });
    }

    // si tiene reserva asociada
    if (h.num_solicitud) {
      habitacionesMap.get(h.id).reservas = {
        idAsignacionHabitacion: h.id_asignacion,
        numSolicitud: h.num_solicitud,
        estado: h.estado_reserva,

        estadoPago: h.estado_pago,
        fechaCheckIn: h.fecha_check_in,
        fechaCheckOut: h.fecha_check_out,
        titular: h.id_titular
          ? {
              id: h.id_titular,
              nombre: h.nombre1,
              apellido: h.apellido1,
              razonSocial: h.razon_social,
              email: h.email,
              telefono: h.telefono,
            }
          : null,
      };
    }
  }

  return Array.from(habitacionesMap.values());
}

async function agregarHabitacion(data) {
  return await habitacionModel.crearHabitacion(data);
}
async function listarHabitacionesDisponibles(fechaCheckIn, noches) {
  const disponiblesRaw = await habitacionModel.obtenerDisponibilidad(
    fechaCheckIn,
    noches,
  );

  return disponiblesRaw.map((h) => ({
    idHabitacion: h.id_habitacion,
    numeroHabitacion: h.numero_habitacion,

    descripcion: h.descripcion,
    piso: h.piso,
    caracteristicas: h.caracteristicas,
    tipoAcomodacion: h.ref_tipo_acomodacion,

    // nochesTotales: h.noches_totales,
    nochesLibres: h.noches_libres,
    nochesOcupadas: h.noches_ocupadas,

    fechasDisponibles: h.fechas_disponibles
      ? h.fechas_disponibles.split(",")
      : [],

    // esIdeal: h.noches_libres === h.noches_totales,
  }));
}

async function obtenerHabitacion(id) {
  return await habitacionModel.obtenerHabitacionPorId(id);
}

async function editarHabitacion(id, data) {
  await habitacionModel.actualizarHabitacion(id, data);
}

async function eliminarHabitacion(id) {
  await habitacionModel.eliminarHabitacion(id);
}
module.exports = {
  listarInfoHabitaciones,
  agregarHabitacion,
  listarHabitacionesDisponibles,
  obtenerHabitacion,
  editarHabitacion,
  eliminarHabitacion,
};
