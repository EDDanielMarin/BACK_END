const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const Notificacion = require('../models/notificacionModel');

router.get('/',middleware.ensureAuthenticated, async (req, res) =>{
    const notificacions = await Notificacion.find();
    res.json(notificacions);
});

router.get('/:codigo',middleware.ensureAuthenticated, async (req, res) =>{
    let codigo = req.params.codigo
    await Notificacion.findOne( {codigo:codigo}, (err, notificacion) => {
        if(err) return res.status(500).send({ message: 'error al realizar la peticion'})
        if(!notificacion) return res.status(404).send({ mesagge :' el notificacion no exiten'})

        res.json(notificacion)
    })
});

router.put('/',middleware.ensureAuthenticated, async (req, res) => {
    
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

router.post('/',middleware.ensureAuthenticated, async (req, res) => {
    let notificacion = await Notificacion.findOne({codigo:req.body.codigo})
    Object.assign(notificacion, req.body)
    await notificacion.save()
    res.json({
        status: 'Notificacion Actualizado'
    });
});

router.delete('/',middleware.ensureAuthenticated, async (req, res) => {
    console.log(req.query);
   await Notificacion.findByIdAndRemove(req.query);
   res.json({
    status:'Notificacion eliminado'
   });
});

module.exports = router;