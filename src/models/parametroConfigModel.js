const mongoose = require('mongoose');
const { Schema } = mongoose;

const ParametroConfig = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el codigo'
    },
    usuario: {
        type: Number,
        required:'Es necesario el codigo de Usuario'
    },
    nombre: {
        type: String,
        required:'Es necesario el nombre'
    },
    valor: {
        type: String,
        required:'Es necesario el valor'
    }
    
});

module.exports = mongoose.model('ParametroConfig', ParametroConfig,'ParametroConfig');