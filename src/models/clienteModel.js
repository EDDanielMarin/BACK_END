const mongoose = require('mongoose');
const { Schema } = mongoose;

const Cliente = new Schema({
    razon_social: {
        type: String,
        required:'Es necesario una razon social o nombre'
    },
    num_documento: {
        type: String,
        required:'Es necesario el numero del documento',
        maxlength:[13,"Numero de documento extenso"]
    },
    direccion: String,
    correo: {
        type: String,
        match: /.+\@.+\..+/
    },
    telefono: String
});

module.exports = mongoose.model('Cliente', Cliente);