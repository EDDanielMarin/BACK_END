var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./config');

exports.ensureAuthenticated = function(req, res, next) {//Permite definir el acceso a rutas con autenticación
  if(!req.headers.authorization) {//Se comprueba que la petición tenga la cabecera de autorización
    return res
      .status(403)
      .send({message: "Tu petición no tiene cabecera de autorización"});//Se envía el código de estado 403 y el mensaje correspondiente
  }
  
  var token = req.headers.authorization.split(" ")[1];//Se obtiene el token a partir de la cabecera de autorización de la petición
  var payload = jwt.decode(token, config.TOKEN_SECRET);//Se decodifica el token usando la clave secreta a fin de obtener el payload
  
  if(payload.exp <= moment().unix()) {//Se compruba que el payload no esté caducado
     return res
     	.status(401)
        .send({message: "El token ha expirado"});//Se envía el código de estado 401 y el mensaje correspondiente
  }
  
  req.user = payload.sub;//Se identifica al usuario con el atributo sub del payload
  next();
}