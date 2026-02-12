const db = require("../db");

async function crearLog({ descripcion, operador }) {
  await db.execute(
    `
    INSERT INTO logs (descripcion, operador, fecha_creacion)
    VALUES (?, ?, NOW())
    `,
    [descripcion, operador],
  );
}

module.exports = {
  crearLog,
};
