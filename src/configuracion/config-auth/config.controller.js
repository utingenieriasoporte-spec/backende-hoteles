const authService = require("./config.service");

async function login(req, res) {
  try {
    const { idPersona, password } = req.body;

    if (!idPersona || !password) {
      return res.status(400).json({
        success: false,
        message: "idPersona y password son requeridos",
      });
    }

    const persona = await authService.validarCredenciales(idPersona, password);

    return res.json({
      success: true,
      message: "Credenciales válidas",
      data: persona,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Error interno",
    });
  }
}

module.exports = {
  login,
};
