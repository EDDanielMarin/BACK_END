const mongoose = require('mongoose');
const { Schema } = mongoose;

const TipoNotificacion = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el codigo'
    },
    descripcion: {
        type: String,
        required:'Es necesaria la descripcion'
    }
});

module.exports = mongoose.model('TipoNotificacion', TipoNotificacion,'TipoNotificacion');