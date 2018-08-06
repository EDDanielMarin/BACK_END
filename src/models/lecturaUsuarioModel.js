const mongoose = require('mongoose');
const { Schema } = mongoose;

const lecturaUsuario = new Schema({
    usuario:{
        type:Number,
        required: 'Es necesario el código de usuario'
    },
    lectura: {
        type: Number,
        required:'Es necesario el número de lectura'
    }
});

module.exports = mongoose.model('LecturaUsuario', lecturaUsuario,'LecturaUsuario');