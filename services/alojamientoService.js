const Alojados = require('../models/alojados');

async function listarAlojados(){
    return await Alojados.obtenerHuespedesActuales();
}

module.exports = {
    listarAlojados,
};
