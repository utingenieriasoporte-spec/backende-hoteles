function generarCodigoReserva(){
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for(let i = 0; i < 6; i++){
        codigo += letras.charAt(Math.floor(Math.random()* letras.length));
    }
    return codigo;
}

module.exports = {
    generarCodigoReserva
};