const mongoose = require('mongoose');
const { Schema } = mongoose;

const Medio = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el codigo'
    },
    descripcion: {
        type: String,
        required:'Es necesaria la descripcion'
    }
});

module.exports = mongoose.model('Medio', Medio,'Medio');