const db = require("./db");

async function obtenerPersonaPorCodigo(idPersona) {
  const [rows] = await db.execute(
    `
  SELECT 
c.detalle AS perfil,
p.nombre1 AS nombreCompleto,
pd.email AS correo,
p.id_persona AS idPersona,
pd.telefono AS telefono,
pd.token AS token
    FROM config c
    JOIN personas p ON c.codigo = p.id_persona
    JOIN personas_det pd ON p.id_persona = pd.id_persona
    WHERE c.entidad = 'OPERADOR_SISTEMA'
      AND p.id_persona = ?
    `,
    [idPersona],
  );

  return rows[0]; // solo uno
}

module.exports = {
  obtenerPersonaPorCodigo,
};
