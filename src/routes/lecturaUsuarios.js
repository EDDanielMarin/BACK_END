const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const LecturaUsuario = require('../models/lecturaUsuarioModel');

router.get('/',middleware.ensureAuthenticated, async (req, res) => {
    const lecturaUsuarios = await LecturaUsuario.find();
    res.json(lecturaUsuarios);
});

router.get('/:usuario/:lectura',middleware.ensureAuthenticated, async (req, res) => {
    let usuario = req.params.usuario
    let lectura = req.params.lectura
    await LecturaUsuario.findOne({ usuario: usuario, lectura: lectura }, (err, lecturaUsuario) => {
        if (err) return res.status(500).send({ message: 'error al realizar la peticion' })
        if (!lecturaUsuario) return res.status(404).send({ mesagge: ' el lecturaUsuario no exiten' })

        res.json(lecturaUsuario)
    })
});

router.put('/',middleware.ensureAuthenticated, async (req, res) => {

    const lecturaUsuario = new LecturaUsuario(req.body);

    await lecturaUsuario.save();
    res.json({
        status: 'LecturaUsuario Guardado'
    });
});

router.delete('/',middleware.ensureAuthenticated, async (req, res) => {
    console.log(req.query);
    await LecturaUsuario.findByIdAndRemove(req.query);
    res.json({
        status: 'LecturaUsuario eliminado'
    });
});

module.exports = router;