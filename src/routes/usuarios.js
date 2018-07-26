const express = require('express');
const router = express.Router();

const Usuario = require('../models/usuarioModel');

router.get('/', async (req, res) =>{
    const usuarios = await Usuario.find();
    res.json(usuarios);
});

router.get('/:cliente', async (req, res) =>{
    let cliente = req.params.cliente
    await Usuario.findOne( {cliente:cliente}, (err, usuario) => {
        if(err) return res.status(500).send({ message: 'error al realizar la peticion'})
        if(!usuario) return res.status(404).send({ mesagge :' el usuario no exiten'})

        res.json(usuario)
    })
});

router.put('/', async (req, res) => {
    
    const usuarios = await Usuario.find(); 
    var num = 0;
    if(usuarios.length > 0)
    {
        if(usuarios[usuarios.length-1])
             num = usuarios[usuarios.length-1].codigo
    }
    const usuario = new Usuario(req.body);
    usuario.codigo=num+1

    await usuario.save();
    res.json({
        status: 'Usuario Guardado'
    });
});

router.post('/', async (req, res) => {
    let usuario = await Usuario.findOne({cliente:req.body.cliente})
    Object.assign(usuario, req.body)
    await usuario.save()
    res.json({
        status: 'Usuario Actualizado'
    });
});

router.delete('/', async (req, res) => {
    console.log(req.query);
   await Usuario.findByIdAndRemove(req.query);
   res.json({
    status:'Usuario eliminado'
   });
});

module.exports = router;