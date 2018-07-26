const express = require('express');
const router = express.Router();
var service = require('../services');

const Usuario = require('../models/usuarioModel');

router.post('/', async (req, res) => {
    let usuario = await Usuario.findOne({nombreUsuario:req.body.nombreUsuario, password:req.body.password})
    
    if(!usuario){
        res.status(404).send({ mesagge :' el usuario no exite'})
    }else{
        res.status(200).send({token: service.createToken(usuario)});
    }
        
    
});



module.exports = router;