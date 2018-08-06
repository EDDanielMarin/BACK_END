const mongoose = require('mongoose');
const { Schema } = mongoose;

const Equipo = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el código'
    },
    usuario:{
        type:Number,
        required:'Es necesario el código de Usuario'
    },
    tipo: {
        type: String
    },
    ip: {
        type: String
    },
    estado: {
        type: Number
    }
    
});

module.exports = mongoose.model('Equipo', Equipo,'Equipo');