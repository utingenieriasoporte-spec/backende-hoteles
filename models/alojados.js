const db = require('./db');

async function obtenerHuespedesActuales(){
    const [rows] = await db.execute(` SELECT hci.nombre_completo, hci.doc_identificacion, hci.tipo_identificacion,
             hci.fecha_nacimiento, hci.titular, ch.estado, ch.fecha_creacion
      FROM huespedes_check_in hci
      JOIN check_ins ch ON ch.id_check_in = hci.id_check_in
      WHERE ch.estado = 'EN_PROCESO'`);
      return rows;
}



module.exports = {
    obtenerHuespedesActuales,
};