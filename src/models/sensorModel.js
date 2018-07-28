const mongoose = require('mongoose');
const { Schema } = mongoose;

const Sensor = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el codigo'
    },
    usuario:{
        type:Number,
        required:'Es necesario el codigo de Usuario'
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

module.exports = mongoose.model('Sensor', Sensor,'Sensor');