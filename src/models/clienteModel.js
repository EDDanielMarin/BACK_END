const mongoose = require('mongoose'); //Permite incluir el módulo moongose en el código para que pueda ser usado
const { Schema } = mongoose;//Se especifica que se va a usar Schemas

const Cliente = new Schema({ //Se define el Schema para la entidad Cliente
    codigo:{   //Se especifica el atributo código que será un número y obligatorio
        type:Number,
        required: 'Es necesario el código'
    },
    identificacion: { //Se especifica el atributo identificación que será una cadena, obligatorio y menor igual a 13 caracteres
        type: String,
        required:'Es necesario el número del documento',
        maxlength:[13,"Número de documento extenso"]
    },
    nombres: {//Se especifica el atributo nombres que será una cadena y es obligatorio
        type: String,
        required:'Son necesarios los nombres'
    },
    apellidos: {//Se especifica el atributo apellidos que será una cadena y es obligatorio
        type: String,
        required:'Son necesarios los apellidos'
    },
    direccion: {//Se especifica el atributo dirección que será una cadena y es obligatorio
        type: String,
        required:'Es necesario la dirección'
    },
    telefono: String,//Se especifica el atributo teléfono que será una cadena
    movil: {//Se especifica el atributo móvil que será una cadena y es obligatorio
        type: String,
        required:'Es necesario el número del móvil'
    },
    correo: {//Se especifica el atributo correo que será una cadena y deberá corresponder con el formato para una dirección de correo electrónico valida
        type: String,
        match: /.+\@.+\..+/
    }
 });

module.exports = mongoose.model('Cliente', Cliente,'Cliente'); //Permite que el Schema para la entidad Cliente pueda ser usada en otro parte del código o archivo