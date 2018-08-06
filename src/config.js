module.exports = {
    TOKEN_SECRET: process.env.TOKEN_SECRET || "tokenultrasecreto" 
  };
//Permite definir una clave secreta para codificar el JSON Web Token.  Se usa el valor de process.env.TOKEN_SECRET  o en su defecto la clave "tokenultrasecreto"