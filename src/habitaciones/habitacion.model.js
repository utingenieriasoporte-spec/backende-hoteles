const db = require("../../db");

async function obtenerInformacionHabitacion(fecha) {
  const [rows] = await db.execute(
    `SELECT 
    h.id_habitacion AS id,
    r.id_asignacion, 
    h.piso,  
    a.id_acomodacion,
    h.estado,
    h.numero_habitacion,
    h.descripcion AS descripcion_habitacion, 
    a.ref_tipo_acomodacion AS tipo_codigo, 
    a.descripcion AS tipo_detalle, 
    a.ocupacion_max, 
    a.capacidad_instalada, 
    a.imagenes, 
    a.activo,
    
    t.valor AS valor_persona,
    t.valor_mes,
    t.valor_habitacion,
    t.valor_adicional_adulto,
    t.valor_adicional_menor,

    r.num_solicitud,
    r.id_titular,
    r.fecha_check_in,
    r.fecha_check_out,
    r.estado_reserva,
    r.estado_pago,

    pd.email,
    pd.telefono,
    p.nombre1, 
    p.apellido1,
    p.razon_social


FROM habitaciones h
JOIN acomodaciones a 
    ON a.id_acomodacion = h.id_acomodacion

JOIN tarifas t 
    ON t.id_acomodacion = h.id_acomodacion
   AND ? BETWEEN t.fecha_desde AND t.fecha_hasta

LEFT JOIN (
    SELECT
        ah.id_asignacion,          
        ah.id_habitacion,
        ah.activo,
        sad.num_solicitud,
        sa.id_titular,
        sa.fecha_check_in,
        sa.fecha_check_out,
        sa.estado AS estado_reserva,
        sa.estado_pago
    FROM asignaciones_habitacion ah
    JOIN solicitudes_alojamiento_det sad 
        ON sad.id_solicitud_det = ah.id_solicitud_det
    JOIN solicitudes_alojamiento sa 
        ON sa.num_solicitud = sad.num_solicitud
    WHERE ? BETWEEN sa.fecha_check_in AND sa.fecha_check_out
      AND sa.estado != 'CHECKOUT'
) r 
    ON r.id_habitacion = h.id_habitacion
   AND r.activo = 1
   LEFT JOIN personas_det pd 
    ON r.id_titular = pd.id_persona

LEFT JOIN personas p 
    ON pd.id_persona = p.id_persona

     ORDER BY h.id_habitacion
   `,
    [fecha, fecha],
  );

  return rows;
}

async function crearHabitacion(data) {
  const {
    id_acomodacion,
    numero_habitacion,
    descripcion,
    piso,
    caracteristicas,
  } = data;
  const [result] = await db.execute(
    `INSERT INTO habitaciones (
      id_acomodacion, numero_habitacion, descripcion, piso,
      estado, caracteristicas, activo, fecha_creacion, fecha_actualizacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      id_acomodacion,
      numero_habitacion,
      descripcion,
      piso,
      "ACTIVO",
      caracteristicas,
      1,
    ],
  );

  return result.insertId;
}

async function obtenerHabitacionPorId(idHabitacion) {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM habitaciones
    WHERE id_habitacion = ?
    `,
    [idHabitacion],
  );

  return rows[0];
}

async function actualizarHabitacion(idHabitacion, data) {
  const {
    id_acomodacion,
    numero_habitacion,
    descripcion,
    piso,
    caracteristicas,
  } = data;

  await db.execute(
    `
    UPDATE habitaciones
    SET
      id_acomodacion = ?,
      numero_habitacion = ?,
      descripcion = ?,
      piso = ?,
      caracteristicas = ?,
      fecha_actualizacion = NOW()
    WHERE id_habitacion = ?
    `,
    [
      id_acomodacion,
      numero_habitacion,
      descripcion,
      piso,
      caracteristicas,
      idHabitacion,
    ],
  );
}

async function eliminarHabitacion(idHabitacion) {
  await db.execute(
    `
    UPDATE habitaciones
    SET estado = 'INACTIVO', activo = 0,
        fecha_actualizacion = NOW()
    WHERE id_habitacion = ?
    `,
    [idHabitacion],
  );
}

async function obtenerDisponibilidad(fecha_check_in, noches) {
  const query = `
    WITH RECURSIVE Calendario AS (
        SELECT 
            CAST(? AS DATE) AS fecha_noche,
            1 AS n
        UNION ALL
        SELECT 
            fecha_noche + INTERVAL 1 DAY,
            n + 1
        FROM Calendario
        WHERE n < ?
    ),

    Ocupacion AS (
        SELECT DISTINCT
            ah.id_habitacion,
            c.fecha_noche
        FROM Calendario c
        JOIN solicitudes_alojamiento sa
            ON c.fecha_noche >= DATE(sa.fecha_check_in)
           AND c.fecha_noche < DATE(sa.fecha_check_out)
           AND sa.estado NOT IN ('CANCELADO')
        JOIN solicitudes_alojamiento_det sad
            ON sa.num_solicitud = sad.num_solicitud
        JOIN asignaciones_habitacion ah
            ON sad.id_solicitud_det = ah.id_solicitud_det
    ),

    Disponibilidad AS (
        SELECT
            h.id_habitacion,
            h.numero_habitacion,
            h.descripcion,
            h.piso,
            h.caracteristicas,
            a.ref_tipo_acomodacion,

            COUNT(c.fecha_noche) AS noches_totales,
            COUNT(o.fecha_noche) AS noches_ocupadas,
            COUNT(c.fecha_noche) - COUNT(o.fecha_noche) AS noches_libres,

            GROUP_CONCAT(
                CASE 
                    WHEN o.fecha_noche IS NULL THEN c.fecha_noche
                END
                ORDER BY c.fecha_noche
            ) AS fechas_disponibles

        FROM habitaciones h
        JOIN acomodaciones a 
            ON h.id_acomodacion = a.id_acomodacion
        CROSS JOIN Calendario c
        LEFT JOIN Ocupacion o
            ON o.id_habitacion = h.id_habitacion
           AND o.fecha_noche = c.fecha_noche

        WHERE h.activo = TRUE

        GROUP BY
            h.id_habitacion,
            h.numero_habitacion,
            h.descripcion,
            h.piso,
            h.caracteristicas,
            a.ref_tipo_acomodacion
    )

    SELECT *
    FROM Disponibilidad
    WHERE noches_libres > 0
    ORDER BY
        CASE 
            WHEN noches_libres = noches_totales THEN 1
            ELSE 2 
        END,
        noches_libres DESC,
        numero_habitacion ASC;
  `;

  const [rows] = await db.execute(query, [fecha_check_in, noches]);

  return rows;
}

module.exports = {
  obtenerInformacionHabitacion,
  crearHabitacion,
  obtenerDisponibilidad,
  obtenerHabitacionPorId,
  actualizarHabitacion,
  eliminarHabitacion,
};
