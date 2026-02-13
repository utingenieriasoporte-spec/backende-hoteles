const recaudoService = require("./recaudo.service");

// async function pagarReserva(req, res) {
//   try {
//     const resultado = await recaudoService.procesarPago(req.body);

//     res.status(201).json({
//       success: true,
//       message: "Pago registrado correctamente",
//       data: resultado,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

async function crearFactura(req, res) {
  try {
    const result = await recaudoService.generarFactura(req.body);

    res.status(201).json({
      success: true,
      message: "Factura creada correctamente",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function crearRecaudo(req, res) {
  try {
    const result = await recaudoService.registrarRecaudo(req.body);

    res.status(201).json({
      success: true,
      message: "Recaudo registrado correctamente",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function obtener(req, res) {
  try {
    const data = await recaudoService.obtenerListaRecaudo();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener el recaudo", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getFacturas(req, res, next) {
  try {
    const data = await recaudoService.listarFacturas();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getFacturaPorNumero(req, res, next) {
  try {
    const { numFactura } = req.params;
    const data = await recaudoService.obtenerFactura(numFactura);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function obtenerCargosPorFactura(req, res) {
  try {
    const { numFactura } = req.params;

    const result = await recaudoService.obtenerCargosFactura(numFactura);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Error al obtener cargos de la factura",
    });
  }
}

module.exports = {
  crearRecaudo,
  obtener,
  crearFactura,
  getFacturas,
  getFacturaPorNumero,
  obtenerCargosPorFactura,
};
