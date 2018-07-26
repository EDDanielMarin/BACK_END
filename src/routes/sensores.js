const express = require('express');
const router = express.Router();

const Sensor = require('../models/sensorModel');

router.get('/', async (req, res) =>{
    const sensors = await Sensor.find();
    res.json(sensors);
});

router.get('/:codigo', async (req, res) =>{
    let codigo = req.params.codigo
    await Sensor.findOne( {codigo:codigo}, (err, sensor) => {
        if(err) return res.status(500).send({ message: 'error al realizar la peticion'})
        if(!sensor) return res.status(404).send({ mesagge :' el sensor no exiten'})

        res.json(sensor)
    })
});

router.put('/', async (req, res) => {
    
    const sensors = await Sensor.find(); 
    var num = 0;
    if(sensors.length > 0)
    {
        if(sensors[sensors.length-1])
             num = sensors[sensors.length-1].codigo
    }
    const sensor = new Sensor(req.body);
    sensor.codigo=num+1

    await sensor.save();
    res.json({
        status: 'Sensor Guardado'
    });
});

router.post('/', async (req, res) => {
    let sensor = await Sensor.findOne({codigo:req.body.codigo})
    Object.assign(sensor, req.body)
    await sensor.save()
    res.json({
        status: 'Sensor Actualizado'
    });
});

router.delete('/', async (req, res) => {
    console.log(req.query);
   await Sensor.findByIdAndRemove(req.query);
   res.json({
    status:'Sensor eliminado'
   });
});

module.exports = router;