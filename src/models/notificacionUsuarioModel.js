const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificacionUsuario = new Schema({
    usuario:{
        type:Number,
        required: 'Es necesario el código de usuario'
    },
    notificacion: {
        type: Number,
        required:'Es necesario el número de notificación'
    }
});

module.exports = mongoose.model('NotificacionUsuario', NotificacionUsuario,'NotificacionUsuario');