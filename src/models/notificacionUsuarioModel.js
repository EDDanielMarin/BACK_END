const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificacionUsuario = new Schema({
    usuario:{
        type:Number,
        required: 'Es necesario el codigo de usuario'
    },
    notificacion: {
        type: Number,
        required:'Es necesario el numero de notificacion'
    }
});

module.exports = mongoose.model('NotificacionUsuario', notificacionUsuario,'NotificacionUsuario');