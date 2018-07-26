const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const Lectura = require('../models/lecturaModel');

router.get('/',middleware.ensureAuthenticated, async (req, res) =>{
    const lecturas = await Lectura.find();
    res.json(lecturas);
});

router.get('/:codigo',middleware.ensureAuthenticated, async (req, res) =>{
    let codigo = req.params.codigo
    await Lectura.findOne( {codigo:codigo}, (err, lectura) => {
        if(err) return res.status(500).send({ message: 'error al realizar la peticion'})
        if(!lectura) return res.status(404).send({ mesagge :' el lectura no exiten'})

        res.json(lectura)
    })
});

router.get('/:sensor/:adc/:ppm/:estado/:voltaje/:mgm3', async (req, res) => {
    const lectura = new Lectura();
    lectura.sensor = req.params.sensor;
    lectura.adc = req.params.adc;
    lectura.ppm = req.params.ppm;
    lectura.estado = req.params.estado;
    lectura.voltaje = req.params.voltaje;
    lectura.mgm3 = req.params.mgm3;

    const lecturas = await Lectura.find(); 
    var num = 0;
    if(lecturas.length > 0)
    {
        if(lecturas[lecturas.length-1])
             num = lecturas[lecturas.length-1].codigo
    }
    
    lectura.codigo=num+1
    lectura.hora = new Date();

    await lectura.save();
    res.json({
        status: 'Lectura Guardado'
    });
});

router.post('/',middleware.ensureAuthenticated, async (req, res) => {
    let lectura = await Lectura.findOne({codigo:req.body.codigo})
    Object.assign(lectura, req.body)
    await lectura.save()
    res.json({
        status: 'Lectura Actualizado'
    });
});

router.delete('/',middleware.ensureAuthenticated, async (req, res) => {
    console.log(req.query);
   await Lectura.findByIdAndRemove(req.query);
   res.json({
    status:'Lectura eliminado'
   });
});

module.exports = router;