const express = require('express');
const router = express.Router();

const Notificacion = require('../models/notificacionModel');

router.get('/', async (req, res) =>{
    const notificacions = await Notificacion.find();
    res.json(notificacions);
});

router.get('/:codigo', async (req, res) =>{
    let codigo = req.params.codigo
    await Notificacion.findOne( {codigo:codigo}, (err, notificacion) => {
        if(err) return res.status(500).send({ message: 'error al realizar la peticion'})
        if(!notificacion) return res.status(404).send({ mesagge :' el notificacion no exiten'})

        res.json(notificacion)
    })
});

router.put('/', async (req, res) => {
    
    const notificacions = await Notificacion.find(); 
    var num = 0;
    if(notificacions.length > 0)
    {
        if(notificacions[notificacions.length-1])
             num = notificacions[notificacions.length-1].codigo
    }
    const notificacion = new Notificacion(req.body);
    notificacion.codigo=num+1
    notificacion.hora = new Date();

    await notificacion.save();
    res.json({
        status: 'Notificacion Guardado'
    });
});

router.post('/', async (req, res) => {
    let notificacion = await Notificacion.findOne({codigo:req.body.codigo})
    Object.assign(notificacion, req.body)
    await notificacion.save()
    res.json({
        status: 'Notificacion Actualizado'
    });
});

router.delete('/', async (req, res) => {
    console.log(req.query);
   await Notificacion.findByIdAndRemove(req.query);
   res.json({
    status:'Notificacion eliminado'
   });
});

module.exports = router;