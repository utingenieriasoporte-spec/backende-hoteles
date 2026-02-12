const configModel = require("../models/configModel");
const logModel = require("../models/logs/logModel");
async function validarCredenciales(idPersona, password) {
  // 1. Buscar persona
  const persona = await configModel.obtenerPersonaPorCodigo(idPersona);

  if (!persona) {
    await logModel.crearLog({
      descripcion: `Intento de login fallido: usuario no existe (${idPersona})`,
      operador: idPersona,
    });

    throw {
      status: 401,
      message: "Credenciales inválidas",
    };
  }

  // 2. Validar token
  if (password !== persona.token) {
    await logModel.crearLog({
      descripcion: `Intento de login fallido: contraseña incorrecta`,
      operador: idPersona,
    });

    throw {
      status: 401,
      message: "Credenciales inválidas",
    };
  }

  // 3. Éxito

  await logModel.crearLog({
    descripcion: `Login exitoso`,
    operador: idPersona,
  });
  return persona;
}

module.exports = {
  validarCredenciales,
};
