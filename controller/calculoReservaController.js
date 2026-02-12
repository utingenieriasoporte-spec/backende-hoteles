const calculoService = require("../services/calculoReservaService");

async function calcular(req, res) {
  try {
    const { numSolicitud } = req.params;
    const resultado = await calculoService.calcularTotal(numSolicitud);
    res.status(200).json(resultado);
  } catch (err) {
    console.error("Error al calcular reserva:", err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function pagarParcial(req, res) {
  try {
    const resultado = await calculoService.pagarParcialMente(req.body);

    res.status(200).json({
      success: true,
      message: "Pago parcial aplicado correctamente",
      data: resultado,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  calcular,
  pagarParcial,
};
