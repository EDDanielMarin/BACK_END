const mongoose = require('mongoose');
const { Schema } = mongoose;
const Cliente = require('./clienteModel')

const detalleModel = new Schema({
    nrc:String,
    asignatura: String,
    precio: Number

});

const CabeceraFac = new Schema({
    numeroFactura: Number,
    fechaDeEmision: Date,
    cliente: String,
    detalles: [detalleModel],
    total: Number,
    estado: { type: String, default: 'pendiente' },
    fechapago: Date
});

module.exports = mongoose.model('CabeceraFac', CabeceraFac);

