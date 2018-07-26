const mongoose = require('mongoose');
const { Schema } = mongoose;

const Lectura = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el codigo'
    },
    sensor: {
        type: Number,
        required:'Es necesario el numero del sensor'
    },
    adc: {
        type: Number
    },
    ppm: {
        type: Number
    },
    estado: {
        type: Number
    },
    voltaje: {
        type: Number
    },
    mgm3: {
        type: Number
    },
    hora: {
        type: Date
    }
    
});

module.exports = mongoose.model('Lectura', Lectura,'Lectura');