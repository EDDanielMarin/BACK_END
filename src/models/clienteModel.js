const mongoose = require('mongoose');
const { Schema } = mongoose;

const Cliente = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el codigo'
    },
    identificacion: {
        type: String,
        required:'Es necesario el numero del documento',
        maxlength:[13,"Numero de documento extenso"]
    },
    nombres: {
        type: String,
        required:'Es necesario el nombre'
    },
    apellidos: {
        type: String,
        required:'Es necesario los apellidos'
    },
    direccion: String,
    telefono: String,
    movil: String,
    correo: {
        type: String,
        match: /.+\@.+\..+/
    }
    
});

module.exports = mongoose.model('Cliente', Cliente,'Cliente');