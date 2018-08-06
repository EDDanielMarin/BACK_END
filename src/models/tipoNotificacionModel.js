const mongoose = require('mongoose');
const { Schema } = mongoose;

const TipoNotificacion = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el código'
    },
    descripcion: {
        type: String,
        required:'Es necesaria la descripción'
    }
});

module.exports = mongoose.model('TipoNotificacion', TipoNotificacion,'TipoNotificacion');