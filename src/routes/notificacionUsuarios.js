const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const NotificacionUsuario = require('../models/notificacionUsuarioModel');

router.get('/',middleware.ensureAuthenticated, async (req, res) => {
    const notificacionUsuarios = await NotificacionUsuario.find();
    res.json(notificacionUsuarios);
});

router.get('/:usuario/:notificacion',middleware.ensureAuthenticated, async (req, res) => {
    let usuario = req.params.usuario
    let notificacion = req.params.notificacion
    await NotificacionUsuario.findOne({ usuario: usuario, notificacion: notificacion }, (err, notificacionUsuario) => {
        if (err) return res.status(500).send({ message: 'error al realizar la peticion' })
        if (!notificacionUsuario) return res.status(404).send({ mesagge: ' el notificacionUsuario no exiten' })

        res.json(notificacionUsuario)
    })
});

router.put('/',middleware.ensureAuthenticated, async (req, res) => {

    const notificacionUsuario = new NotificacionUsuario(req.body);

    await notificacionUsuario.save();
    res.json({
        status: 'NotificacionUsuario Guardado'
    });
});

router.delete('/',middleware.ensureAuthenticated, async (req, res) => {
    console.log(req.query);
    await NotificacionUsuario.findByIdAndRemove(req.query);
    res.json({
        status: 'NotificacionUsuario eliminado'
    });
});

module.exports = router;