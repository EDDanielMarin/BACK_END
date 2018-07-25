const mongoose = require('mongoose');
const { Schema } = mongoose;

const Notificacion = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el codigo'
    },
    tipo: {
        type: Number,
        required:'Es necesario el numero del tipo'
    },
    medio: {
        type: Number,
        required:'Es necesario el numero del medio'
    },
    asunto: {
        type: String
    },
    descripcion: {
        type: String
    },
    hora: {
        type: Date
    }
    
});

module.exports = mongoose.model('Notificacion', Notificacion,'Notificacion');