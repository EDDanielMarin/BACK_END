const mongoose = require('mongoose');
const { Schema } = mongoose;

const DetalleFac = new Schema({
    nrc:String,
    asignatura: String,
    precio: Number,
});

module.exports = mongoose.model('DetalleFac', DetalleFac);
