const express = require('express');
const router = express.Router();

const Medio = require('../models/medioModel');

router.get('/', async (req, res) =>{
    const medios = await Medio.find();
    res.json(medios);
});

router.get('/:codigo', async (req, res) =>{
    let codigo = req.params.codigo
    await Medio.findOne( {codigo:codigo}, (err, medio) => {
        if(err) return res.status(500).send({ message: 'error al realizar la peticion'})
        if(!medio) return res.status(404).send({ mesagge :' el medio no exiten'})

        res.json(medio)
    })
});

router.put('/', async (req, res) => {
    
    const medios = await Medio.find(); 
    var num = 0;
    if(medios.length > 0)
    {
        if(medios[medios.length-1])
             num = medios[medios.length-1].codigo
    }
    const medio = new Medio(req.body);
    medio.codigo=num+1

    await medio.save();
    res.json({
        status: 'Medio Guardado'
    });
});

router.post('/', async (req, res) => {
    let medio = await Medio.findOne({codigo:req.body.codigo})
    Object.assign(medio, req.body)
    await medio.save()
    res.json({
        status: 'Medio Actualizado'
    });
});

router.delete('/', async (req, res) => {
    console.log(req.query);
   await Medio.findByIdAndRemove(req.query);
   res.json({
    status:'Medio eliminado'
   });
});

module.exports = router;