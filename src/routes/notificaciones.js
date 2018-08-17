const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const Notificacion = require('../models/notificacionModel');
const NotificacionUsuario = require('../models/notificacionUsuarioModel');

router.get('/',middleware.ensureAuthenticated, async (req, res) =>{
    const notificaciones = await Notificacion.find();
    res.json(notificaciones);
});

router.get('/:usuario',middleware.ensureAuthenticated, async (req, res) =>{
    
    let usuario = req.params.usuario
    let notificacionesp=[]
     await NotificacionUsuario.findOne({ usuario: usuario}, (err, notificaciones) => {
        if (err) return res.status(500).send({ message: 'error al realizar la petición' })
        if (!notificaciones) return res.status(404).send({ mesagge: ' la notificacionUsuario no existe' })
         notificaciones.forEach(x => {
            Notificacion.findOne( {codigo:x.notificacion}, (err1, notificaciontmp) => {
                if(err1) 
                    return res.status(500).send({ message: 'error al realizar la petición' })
                if(notificaciontmp)
                    notificacionesp.push(notificaciontmp)
            })
        });
        res.json(notificacionesp)

    }) 
    
    
   
});

router.put('/',middleware.ensureAuthenticated, async (req, res) => {
    
    const notificaciones = await Notificacion.find(); 
    var num = 0;
    if(notificaciones.length > 0)
    {
        if(notificaciones[notificaciones.length-1])
             num = notificaciones[notificaciones.length-1].codigo
    }
    const notificacion = new Notificacion(req.body);
    notificacion.codigo=num+1
    notificacion.hora = new Date();

    await notificacion.save();
    res.json({
        status: 'Notificación Guardada'
    });
});

router.post('/',middleware.ensureAuthenticated, async (req, res) => {
    let notificacion = await Notificacion.findOne({codigo:req.body.codigo})
    Object.assign(notificacion, req.body)
    await notificacion.save()
    res.json({
        status: 'Notificación Actualizada'
    });
});

router.delete('/',middleware.ensureAuthenticated, async (req, res) => {
    console.log(req.query);
   await Notificacion.findByIdAndRemove(req.query);
   res.json({
    status:'Notificación eliminada'
   });
});

module.exports = router;