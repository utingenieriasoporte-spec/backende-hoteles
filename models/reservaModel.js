const pool = require("../models/db");
const { generarCodigoReserva } = require("../utils/utils");
const cargos = require("../models/cargo");

async function obtenerSolicitud(numSolicitud) {
  const [rows] = await pool.execute(
    `SELECT estado
     FROM solicitudes_alojamiento
     WHERE num_solicitud = ?`,
    [numSolicitud],
  );
  return rows[0];
}

async function cancelarSolicitud(numSolicitud) {
  await pool.execute(
    `UPDATE solicitudes_alojamiento
     SET estado = 'CANCELADO', fecha_actualizacion = NOW()
     WHERE num_solicitud = ?`,
    [numSolicitud],
  );
}

async function obtenerAsignacion(numSolicitud) {
  const [rows] = await pool.execute(
    `SELECT ah.id_asignacion, ah.id_habitacion
     FROM asignaciones_habitacion ah
     JOIN solicitudes_alojamiento_det sad
       ON sad.id_solicitud_det = ah.id_solicitud_det
     WHERE sad.num_solicitud = ?`,
    [numSolicitud],
  );
  return rows[0];
}

async function liberarHabitacion(idHabitacion) {
  await pool.execute(
    `UPDATE habitaciones
     SET estado = 'ACTIVO', fecha_actualizacion = NOW()
     WHERE id_habitacion = ?`,
    [idHabitacion],
  );
}

async function cancelarCheckIn(idAsignacion) {
  await pool.execute(
    `UPDATE check_ins
     SET estado = 'CANCELADO'
     WHERE id_asignacion_habitacion = ?`,
    [idAsignacion],
  );
}

async function validarConfig(entidad, codigo, conn) {
  const [rows] = await conn.query(
    `SELECT 1 FROM config WHERE entidad = ? AND codigo = ?`,
    [entidad, codigo],
  );
  if (rows.length === 0) {
    throw new Error(`Valor inválido para ${entidad}: ${codigo}`);
  }
  return true;
}

async function crearReservaCompleta(data) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // =========================
    // 1️⃣ Datos del titular
    // =========================
    const titular = {
      id: data.idTitular,
      nombre: data.nombreTitular,
      email: data.emailTitular?.trim() || "No registra",
      telefono: data.telefonoTitular,
    };

    // =========================
    // 2️⃣ Datos de la reserva
    // =========================
    const detalle = data.detalles[0];
    const fechaLlegada = detalle.fechaDeLlegada;
    const fechaSalida = detalle.fechaDeSalida;
    const horaEstimada = detalle.horaEstimadaLlegada;
    const cantidadPersonas = parseInt(detalle.numeroPersonas, 10);
    const idAcomodacion = detalle.idAcomodacion;
    const origenReserva = data.refOrigen;
    const observacionReserva = data.observaciones;
    const operador = data.procesado_por;
    const adultoSol = data.adultos || 0;
    const menoresSol = data.menores || 0;

    if (!operador) {
      const err = new Error(
        "El operador que procesa la reserva es obligatorio",
      );
      err.statusCode = 400;
      throw err;
    }
    if (!cantidadPersonas || cantidadPersonas <= 0) {
      throw new Error("La cantidad de personas debe ser mayor a 0");
    }

    const numReserva = generarCodigoReserva();

    // =========================
    // 3️⃣ Crear persona si no existe
    // =========================
    const [personaExistente] = await conn.query(
      "SELECT 1 FROM personas WHERE id_persona = ?",
      [titular.id],
    );

    if (personaExistente.length === 0) {
      await conn.query(
        `INSERT INTO personas
         (id_persona, tipo_id, razon_social, nombre1, fecha_nacimiento, ref_genero, nacionalidad)
         VALUES (?, 'C', ?, ?, CURDATE(), 'GENERO_MASCULINO', 1)`,
        [titular.id, titular.nombre, titular.nombre],
      );

      await conn.query(
        `INSERT INTO personas_det
         (id_persona, direccion, email, telefono)
         VALUES (?, 'Sin dirección', ?, ?)`,
        [titular.id, titular.email, titular.telefono],
      );
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaLlegadaDate = new Date(fechaLlegada);
    fechaLlegadaDate.setHours(0, 0, 0, 0);

    if (fechaLlegadaDate < hoy) {
      const err = new Error(
        "No se puede crear una reserva con fecha de llegada en el pasado",
      );
      err.statusCode = 400;
      throw err;
    }
    // =========================
    // 4️⃣ Calcular tarifa REAL
    // =========================
    const [tarifaRows] = await conn.query(
      `
      SELECT
        t.valor AS tarifa_persona_noche,
        DATEDIFF(?, ?) AS noches,
        (t.valor * ? * DATEDIFF(?, ?)) AS total
      FROM tarifas t
      WHERE t.id_acomodacion = ?
        AND ? BETWEEN t.fecha_desde AND t.fecha_hasta
      `,
      [
        fechaSalida,
        fechaLlegada,
        cantidadPersonas,
        fechaSalida,
        fechaLlegada,
        idAcomodacion,
        fechaLlegada,
      ],
    );

    if (tarifaRows.length === 0) {
      throw new Error(
        "No existe tarifa vigente para la acomodación seleccionada",
      );
    }

    const { tarifa_persona_noche, noches, total } = tarifaRows[0];

    if (noches <= 0) {
      throw new Error(
        "La fecha de salida debe ser mayor a la fecha de llegada",
      );
    }

    // =========================
    // 5️⃣ Insertar solicitud principal
    // =========================
    const [rowSolicitud] = await conn.query(
      `
      INSERT INTO solicitudes_alojamiento
      (num_solicitud, id_titular, fecha_check_in, fecha_check_out, noches,
       hora_estimada_llegada, total_pago, monto_pagado, estado,estado_pago ,fecha_creacion,
   ref_origen, ref_novedades, observaciones, procesado_por)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,NOW(), ?, ?, ?, ?)
      `,
      [
        numReserva,
        titular.id,
        fechaLlegada,
        fechaSalida,
        noches,
        horaEstimada,
        total,
        0,
        "CONFIRMADO",
        "PENDIENTE_PAGO",
        origenReserva,
        "NOV001",
        observacionReserva,
        operador,
      ],
    );

    // =========================
    //  Insertar detalle
    // =========================
    await conn.query(
      `
      INSERT INTO solicitudes_alojamiento_det
      (id_acomodacion, num_solicitud, cantidad_personas,
       precio_noche_actual, subtotal, notas, fecha_creacion)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        idAcomodacion,
        numReserva,
        cantidadPersonas,
        tarifa_persona_noche * cantidadPersonas, // valor de UNA noche completa
        total,
        `Reserva acomodación ${idAcomodacion},
         ${cantidadPersonas} persona(s),
         entrada ${fechaLlegada},
         salida ${fechaSalida},
         llegada ${horaEstimada}`,
      ],
    );

    await conn.commit();

    return {
      success: true,
      message: "Reserva creada correctamente",
      numReserva,
      // total,
      adultoSol,
      menoresSol,
      noches,
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function crearAmpliacionReserva(data) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const {
      numReservaOriginal,
      nuevaFechaSalida,
      horaSalida,
      observaciones,
      procesado_por,
    } = data;
    const nuevoNumReserva = generarCodigoReserva();

    // =========================
    // 1️⃣ Obtener reserva original + habitación
    // =========================
    const [rows] = await conn.query(
      `
       	SELECT 
	        s.id_titular,
	        s.fecha_check_in,
	        s.fecha_check_out as fecha_inicio,
	        d.id_acomodacion,
	        d.cantidad_personas,
	        d.precio_noche_actual,
	        ah.id_habitacion,
	        s.ref_origen,
          s.estado,
	        s.ref_novedades,
	        s.observaciones,
          s.procesado_por
	      FROM solicitudes_alojamiento s
	      JOIN solicitudes_alojamiento_det d
	        ON s.num_solicitud = d.num_solicitud
	      LEFT JOIN asignaciones_habitacion ah
	        ON ah.id_solicitud_det = d.id_solicitud_det 
	      WHERE s.num_solicitud = ? AND ah.activo = 1
      `,
      [numReservaOriginal],
    );

    if (rows.length === 0) {
      throw new Error("Reserva original no encontrada");
    }

    const original = rows[0];

    if (!original.id_habitacion) {
      throw new Error("La reserva original no tiene habitación asignada");
    }

    // =========================
    // 2️⃣ Calcular noches
    // =========================
    let noches = Math.ceil(
      (new Date(nuevaFechaSalida) - new Date(original.fecha_inicio)) /
        (1000 * 60 * 60 * 24),
    );

    if (noches <= 0) {
      throw new Error(
        "La nueva fecha de salida debe ser mayor al checkout actual",
      );
    }

    // =========================
    // 3️⃣ Ajuste por hora de salida
    // (si sale después de las 12, cobra una noche más)
    // =========================
    const [hora, minutos] = horaSalida.split(":").map(Number);

    if (hora > 12 || (hora === 12 && minutos > 0)) {
      noches += 1;
    }

    // =========================
    // 4️⃣ Calcular total
    // precio_noche_actual YA es por noche completa
    // =========================
    const totalPago = original.precio_noche_actual * noches;

    // =========================
    // 5️⃣ Insertar nueva solicitud
    // =========================
    await conn.query(
      `
      INSERT INTO solicitudes_alojamiento
      (num_solicitud, id_titular, fecha_check_in, fecha_check_out,
       noches, hora_estimada_llegada, total_pago,
       monto_pagado, estado, fecha_creacion, fecha_actualizacion, 
       ref_origen, ref_novedades, observaciones, procesado_por)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?)
      `,
      [
        nuevoNumReserva,
        original.id_titular,
        original.fecha_inicio,
        nuevaFechaSalida,
        noches,
        horaSalida,
        totalPago,
        0,
        original.estado,
        original.ref_origen,
        "NOV003",
        observaciones,
        procesado_por,
      ],
    );

    // =========================
    // 6️⃣ Insertar detalle
    // =========================
    const [detalleResult] = await conn.query(
      `
      INSERT INTO solicitudes_alojamiento_det
      (id_acomodacion, num_solicitud, cantidad_personas,
       precio_noche_actual, subtotal, notas, fecha_creacion)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        original.id_acomodacion,
        nuevoNumReserva,
        original.cantidad_personas,
        original.precio_noche_actual,
        totalPago,
        `Ampliación de la reserva ${numReservaOriginal}`,
      ],
    );

    const nuevoIdDetalle = detalleResult.insertId;

    // =========================
    // 7️⃣ ASIGNAR LA MISMA HABITACIÓN
    //
    // =========================
    await conn.query(
      `
      INSERT INTO asignaciones_habitacion
      (id_habitacion, id_solicitud_det, fecha_asignacion, fecha_desde, fecha_hasta)
      VALUES (?, ?, NOW(), ?, ?)
      `,
      [
        original.id_habitacion,
        nuevoIdDetalle,
        original.fecha_check_in,
        original.fecha_inicio,
      ],
    );

    await conn.commit();

    return {
      success: true,
      message: "Reserva ampliada correctamente",
      numReservaNueva: nuevoNumReserva,
      noches,
      totalPago,
      habitacion: original.id_habitacion,
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
async function obtenerReservaPorIdTitular(idTitular) {
  const [rows] = await pool.execute(
    `SELECT * FROM solicitudes_alojamiento WHERE id_titular = ?`,
    [idTitular],
  );
  return rows[0];
}

async function obtenerReservas() {
  const conn = await pool.getConnection();

  try {
    const [resultados] = await conn.query(
      `SELECT 
  d.id_solicitud_det AS idSolicitudDet,
  s.num_solicitud AS numReserva,
  ah.id_asignacion AS idAsignacion,
  p.id_persona AS idTitular,
  p.nombre1 AS nombreTitular,
  pd.email AS emailTitular,
  pd.telefono AS telefonoTitular,
  s.fecha_check_in AS fecha_inicio,
  s.fecha_check_out AS fecha_salida,
  s.hora_estimada_llegada AS hora,
  s.total_pago AS totalPago,
  s.estado,
  s.estado_pago,
  s.ref_origen AS origenSolicitud,
  s.noches AS noches,
  s.ref_novedades AS novedadSolicitud,
  s.observaciones AS observaciones,
  d.id_acomodacion,
  d.cantidad_personas AS cuposReservados,
  d.notas AS detalle,
  h.id_habitacion AS id_habitacion,
  h.numero_habitacion AS numeroHabitacion,
  s.procesado_por AS operador,
  con.detalle AS detalleOrigen,
  con2.detalle AS detalleSolicitud,
  s.monto_pagado AS montoPagado
FROM solicitudes_alojamiento s
JOIN personas p 
  ON s.id_titular = p.id_persona
JOIN personas_det pd 
  ON p.id_persona = pd.id_persona
JOIN solicitudes_alojamiento_det d 
  ON s.num_solicitud = d.num_solicitud
JOIN config con
ON con.codigo = s.ref_origen
	JOIN config con2
	ON con2.codigo = s.ref_novedades
LEFT JOIN factura_cobro fc 
  ON fc.id_solicitud_det = d.id_solicitud_det
LEFT JOIN asignaciones_habitacion ah
  ON ah.id_solicitud_det = d.id_solicitud_det
LEFT JOIN habitaciones h
  ON h.id_habitacion = ah.id_habitacion
  WHERE ah.activo = 1;
    `,
    );

    return resultados.map((r) => ({
      idSolicitudDet: r.idSolicitudDet,
      numReserva: r.numReserva,
      id_asignacion: r.idAsignacion,
      habitacion: {
        id_habitacion: r.id_habitacion,
        numHabitacion: r.numeroHabitacion,
      },
      titular: {
        id: r.idTitular,
        nombre: r.nombreTitular,
        email: r.emailTitular,
        telefono: r.telefonoTitular,
      },
      detalle: r.detalle,
      fecha_inicio: r.fecha_inicio,
      fecha_salida: r.fecha_salida,
      nochesEstadia: r.noches,
      hora: r.hora,
      cuposReservados: r.cuposReservados,
      totalPago: r.totalPago,
      montoPagado: r.montoPagado,
      estado: r.estado,
      estadoPago: r.estado_pago,
      novedadSolicitud: r.detalleSolicitud,
      origenSolicitud: r.detalleOrigen,
      observaciones: r.observaciones,
      operador: r.operador,
    }));
  } finally {
    conn.release();
  }
}

async function actualizarEstadoReserva(numReserva, nuevoEstado) {
  const conn = await pool.getConnection();
  try {
    const [resultado] = await conn.query(
      `UPDATE solicitudes_alojamiento 
       SET estado = ?, fecha_actualizacion = NOW()
       WHERE num_solicitud = ?`,
      [nuevoEstado, numReserva],
    );
    return resultado.affectedRows > 0;
  } finally {
    conn.release();
  }
}

async function actualizarNovedadYObservaciones(
  numSolicitud,
  refNovedades,
  observaciones,
) {
  const [result] = await pool.query(
    `
    UPDATE solicitudes_alojamiento
    SET
      ref_novedades = ?,
      observaciones = ?
    WHERE num_solicitud = ?
    `,
    [refNovedades, observaciones, numSolicitud],
  );

  return result.affectedRows > 0;
}

async function adicionarPersonasReserva(data) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const {
      numReserva,
      adultos = 0,
      menores = 0,
      noches = 0,
      idAsignacion,
    } = data;

    if (adultos < 0 || menores < 0 || noches < 0) {
      throw new Error("Las cantidades no pueden ser negativas");
    }

    //  Obtener reserva
    const [reservaRows] = await conn.query(
      `
      SELECT
        sa.num_solicitud,
        sad.id_solicitud_det,
        sa.noches,
        sad.id_acomodacion,
        sa.total_pago,
        sad.cantidad_personas,
        sad.notas,
        sa.fecha_check_out AS fecha_salida
      FROM solicitudes_alojamiento sa
      JOIN solicitudes_alojamiento_det sad
        ON sa.num_solicitud = sad.num_solicitud
      WHERE sa.num_solicitud = ?
      `,
      [numReserva],
    );

    if (reservaRows.length === 0) {
      throw new Error("La reserva no existe");
    }

    const reserva = reservaRows[0];

    const newCantidadPersonas = reserva.cantidad_personas + adultos + menores;

    await pool.execute(
      `UPDATE solicitudes_alojamiento_det
     SET cantidad_personas = ?, notas = ?
     WHERE id_solicitud_det = ?`,
      [
        newCantidadPersonas,
        `${reserva.notas},
        adicion personas: ${new Date()} 
        adultos ${adultos}, 
        menores ${menores} `,
        reserva.id_solicitud_det,
      ],
    );

    //  Obtener tarifa vigente
    const [tarifaRows] = await conn.query(
      `
      SELECT
        valor_adicional_adulto,
        valor_adicional_menor
      FROM tarifas
      WHERE id_acomodacion = ?
        AND ? BETWEEN fecha_desde AND fecha_hasta
      `,
      [reserva.id_acomodacion, reserva.fecha_salida],
    );

    if (tarifaRows.length === 0) {
      throw new Error("No existe tarifa vigente");
    }

    if (!idAsignacion) {
      const [asignacionReserva] = await conn.query(
        `
        SELECT
          ah.id_asignacion,
          sa.num_solicitud
        FROM asignaciones_habitacion ah
        JOIN solicitudes_alojamiento_det sad
          ON ah.id_solicitud_det = sad.id_solicitud_det
        JOIN solicitudes_alojamiento sa
          ON sad.num_solicitud = sa.num_solicitud
        WHERE sa.num_solicitud = ? AND ah.activo = 1;
      `,
        [numReserva],
      );

      if (asignacionReserva.length === 0) {
        throw new Error("no tiene habitacion vigente");
      }
    }

    const asignacion = idAsignacion;
    const tarifa = tarifaRows[0];

    // 3️⃣ Calcular adicionales
    const adicionalAdultos =
      adultos * (tarifa.valor_adicional_adulto || 0) * noches;

    const adicionalMenores =
      menores * (tarifa.valor_adicional_menor || 0) * noches;

    const totalAdicional = adicionalAdultos + adicionalMenores;

    if (adultos > 0 && menores > 0) {
      await cargos.crearCargo({
        id_asignacion_habitacion: asignacion,
        ref_concepto: "C001",
        observaciones: "Adición de personas",
        monto_abonado: 0,
        total: totalAdicional,
      });
    }

    await conn.commit();

    return {
      success: true,
      message: "Adicionales aplicados correctamente",
      totalAdicional,
      detalle: {
        adultos,
        menores,
        adicionalAdultos,
        adicionalMenores,
      },
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

module.exports = {
  crearReservaCompleta,
  obtenerReservas,
  actualizarEstadoReserva,
  crearAmpliacionReserva,
  obtenerSolicitud,
  cancelarSolicitud,
  obtenerAsignacion,
  liberarHabitacion,
  cancelarCheckIn,
  obtenerReservaPorIdTitular,
  actualizarEstadoReserva,
  actualizarNovedadYObservaciones,
  adicionarPersonasReserva,
};
