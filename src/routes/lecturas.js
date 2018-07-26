const express = require('express');
const router = express.Router();

const Lectura = require('../models/lecturaModel');

router.get('/', async (req, res) =>{
    const lecturas = await Lectura.find();
    res.json(lecturas);
});

router.get('/:codigo', async (req, res) =>{
    let codigo = req.params.codigo
    await Lectura.findOne( {codigo:codigo}, (err, lectura) => {
        if(err) return res.status(500).send({ message: 'error al realizar la peticion'})
        if(!lectura) return res.status(404).send({ mesagge :' el lectura no exiten'})

        res.json(lectura)
    })
});

router.put('/', async (req, res) => {
    
    const lecturas = await Lectura.find(); 
    var num = 0;
    if(lecturas.length > 0)
    {
        if(lecturas[lecturas.length-1])
             num = lecturas[lecturas.length-1].codigo
    }
    const lectura = new Lectura(req.body);
    lectura.codigo=num+1
    lectura.hora = new Date();

    await lectura.save();
    res.json({
        status: 'Lectura Guardado'
    });
});

router.post('/', async (req, res) => {
    let lectura = await Lectura.findOne({codigo:req.body.codigo})
    Object.assign(lectura, req.body)
    await lectura.save()
    res.json({
        status: 'Lectura Actualizado'
    });
});

router.delete('/', async (req, res) => {
    console.log(req.query);
   await Lectura.findByIdAndRemove(req.query);
   res.json({
    status:'Lectura eliminado'
   });
});

module.exports = router;