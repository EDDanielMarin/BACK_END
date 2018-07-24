const mongoose = require('mongoose');
const { Schema } = mongoose;

const FormaPago = new Schema ({
    formaDePago: String,
    valor: Number
});

module.exports = mongoose.model('FormaPago', FormaPago);
