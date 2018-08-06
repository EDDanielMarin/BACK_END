var jwt = require('jwt-simple');//Permite incluir el módulo jwt-simple (codificar y decodificar jwt) en el código para que pueda ser usado
var moment = require('moment');//Permite incluir el módulo moment (manejo de fechas) en el código para que pueda ser usado
var config = require('./config');//Permite incluie el archivo config donde se definió la clave para codificar el jwt

exports.createToken = function(user) {//Permite crear el token y codificarlo
  var payload = {//Define el payload 
    sub: user._id,//Se define el ID del usuario como sujeto del token 
    iat: moment().unix(),//Se define la fecha de creación del token en formato de tiempo UNIX (fecha actual)
    exp: moment().add(14, "days").unix(),//Se define la fecha de expiración del token en formato de tiempo UNIX (14 días)
  };
  return jwt.encode(payload, config.TOKEN_SECRET);//Se devuelve el JSON Web Token, codificando el payload con la clave secreta.
};