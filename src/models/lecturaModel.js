const mongoose = require('mongoose');
const { Schema } = mongoose;

const Lectura = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el código'
    },
    equipo: {
        type: Number,
        required:'Es necesario el número del equipo'
    },
    sensor: {
        type: Number,
    },
    adc: {
        type: Number,
		required:'Es necesaria la conversión analógica-digital'
    },
    ppm: {
        type: Number,
		required:'Es necesaria la concentración en ppm'
    },
    estado: {
        type: Number,
		required:'Es necesario el estado de detección'
    },
    voltaje: {
        type: Number,
		required:'Es necesario el valor de voltaje'
    },
    mgm3: {
        type: Number,
		required:'Es necesaria la concentración en mgm3'
    },
    hora: {
        type: Date,
		required:'Es necesaria la hora'
    }
});
module.exports = mongoose.model('Lectura', Lectura,'Lectura');