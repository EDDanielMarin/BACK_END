const mongoose = require('mongoose');
const { Schema } = mongoose;

const Usuario = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el codigo'
    },
    cliente: {
        type: String,
        required:'Es necesaria la identificacion del cliente',
        maxlength:[13,"Numero de documento extenso"]
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