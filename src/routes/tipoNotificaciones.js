const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const TipoNotificacion = require('../models/tipoNotificacionModel');

router.get('/',middleware.ensureAuthenticated, async (req, res) =>{
    const tipoNotificacions = await TipoNotificacion.find();
    res.json(tipoNotificacions);
});

router.get('/:codigo',middleware.ensureAuthenticated, async (req, res) =>{
    let codigo = req.params.codigo
    await TipoNotificacion.findOne( {codigo:codigo}, (err, tipoNotificacion) => {
        if(err) return res.status(500).send({ message: 'error al realizar la peticion'})
        if(!tipoNotificacion) return res.status(404).send({ mesagge :' el tipoNotificacion no exiten'})

        res.json(tipoNotificacion)
    })
});

router.put('/',middleware.ensureAuthenticated, async (req, res) => {
    
    const tipoNotificacions = await TipoNotificacion.find(); 
    var num = 0;
    if(tipoNotificacions.length > 0)
    {
        if(tipoNotificacions[tipoNotificacions.length-1])
             num = tipoNotificacions[tipoNotificacions.length-1].codigo
    }
    const tipoNotificacion = new TipoNotificacion(req.body);
    tipoNotificacion.codigo=num+1

    await tipoNotificacion.save();
    res.json({
        status: 'TipoNotificacion Guardado'
    });
});

router.post('/',middleware.ensureAuthenticated, async (req, res) => {
    let tipoNotificacion = await TipoNotificacion.findOne({codigo:req.body.codigo})
    Object.assign(tipoNotificacion, req.body)
    await tipoNotificacion.save()
    res.json({
        status: 'TipoNotificacion Actualizado'
    });
});

router.delete('/',middleware.ensureAuthenticated, async (req, res) => {
    console.log(req.query);
   await TipoNotificacion.findByIdAndRemove(req.query);
   res.json({
    status:'TipoNotificacion eliminado'
   });
});

module.exports = router;