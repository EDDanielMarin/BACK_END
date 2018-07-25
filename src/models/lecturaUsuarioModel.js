const mongoose = require('mongoose');
const { Schema } = mongoose;

const LecturaUsuario = new Schema({
    usuario:{
        type:Number,
        required: 'Es necesario el codigo de usuario'
    },
    lectura: {
        type: Number,
        required:'Es necesario el numero de lectura'
    }
});

module.exports = mongoose.model('LecturaUsuario', LecturaUsuario,'LecturaUsuario');