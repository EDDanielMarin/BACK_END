const express = require('express');
const router = express.Router();
var service = require('../services');//Se declara la variable service que permite incluir el módulo services a fin de que pueda ser usado en el código 

const Usuario = require('../models/usuarioModel');

router.post('/', async (req, res) => {//Se define una nueva ruta para el método POST en la raíz de la aplicación
    let usuario = await Usuario.findOne({nombreUsuario:req.body.nombreUsuario, password:req.body.password})//Se realiza la búsqueda del usuario de acuerdo al atributo nombreUsuario y
    																																																		 //password enviados en la petición
    if(!usuario){//Si no existe el usuario se devuelve en la respuesta el código de estado 404 y el mensaje correspondiente
        res.status(404).send({ mesagge :' el usuario no exite'})
    }else{
        res.status(200).send({user:usuario,token: service.createToken(usuario)});//Si existe el usuario se devuelve en la respuesta el código de estado 200, el usuario y el token generado
    }            
});

module.exports = router;