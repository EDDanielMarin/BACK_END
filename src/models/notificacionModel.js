const mongoose = require('mongoose');
const { Schema } = mongoose;

const Notificacion = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el código'
    },
    tipo: {
        type: Number,
        required:'Es necesario el número del tipo'
    },
    medio: {
        type: Number,
        required:'Es necesario el número del medio'
    },
    asunto: {
        type: String,
		required:'Es necesario el asunto'
    },
    descripcion: {
        type: String
		required:'Es necesario la descripción'
    },
    hora: {
        type: Date
		required:'Es necesario la hora'
    }
});

module.exports = mongoose.model('Notificacion', Notificacion,'Notificacion');