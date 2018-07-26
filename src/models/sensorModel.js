const mongoose = require('mongoose');
const { Schema } = mongoose;

const Sensor = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el codigo'
    },
    tipo: {
        type: String,
        required:'Es necesario el codigo de Usuario',
        maxlength:[5,"Tipo muy extenso"]
    },
    ip: {
        type: String
    },
    estado: {
        type: Number
    }
    
});

module.exports = mongoose.model('Sensor', Sensor,'Sensor');