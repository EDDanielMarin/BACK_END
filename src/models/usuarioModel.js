const mongoose = require('mongoose');
const { Schema } = mongoose;

const Usuario = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el código'
    },
    cliente: {
        type: String,
        required:'Es necesaria la identificación del cliente',    
    },
    nombreUsuario: {
        type: String,
        required:'Es necesario el nombre de usuario'
    },
    password: {
        type: String,
        required:'Es necesario un password'
    },
    perfil: String,
    estado: Number
    
});

module.exports = mongoose.model('Usuario', Usuario,'Usuario');