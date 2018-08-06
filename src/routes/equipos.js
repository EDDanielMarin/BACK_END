const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const Equipo = require('../models/equipoModel');

router.get('/',middleware.ensureAuthenticated, async (req, res) =>{
    const equipos = await Equipo.find();
    res.json(sensors);
});

router.get('/:codigo',middleware.ensureAuthenticated, async (req, res) =>{
    let codigo = req.params.codigo
    await Equipo.findOne( {codigo:codigo}, (err, equipo) => {
        if(err) return res.status(500).send({ message: 'error al realizar la petición'})
        if(!equipo) return res.status(404).send({ mesagge :' el equipo no existe'})

        res.json(equipo)
    })
});

router.put('/',middleware.ensureAuthenticated, async (req, res) => {
    
    const equipos = await Equipo.find(); 
    var num = 0;
    if(equipos.length > 0)
    {
        if(equipos[equipos.length-1])
             num = equipos[equipos.length-1].codigo
    }
    const equipo = new Equipo(req.body);
    equipo.codigo=num+1

    await equipo.save();
    res.json({
        status: 'Equipo Guardado'
    });
});

router.post('/',middleware.ensureAuthenticated, async (req, res) => {
    let equipo = await Equipo.findOne({codigo:req.body.codigo})
    Object.assign(equipo, req.body)
    await equipo.save()
    res.json({
        status: 'Equipo Actualizado'
    });
});

router.delete('/',middleware.ensureAuthenticated, async (req, res) => {
   console.log(req.query);
   await Equipo.findByIdAndRemove(req.query);
   res.json({
    status:'Equipo eliminado'
   });
});

module.exports = router;