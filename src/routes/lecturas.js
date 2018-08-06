const express = require('express');
const router = express.Router();
var middleware = require('../middleware');
var nodemailer = require('nodemailer');


//modelos
const Lectura = require('../models/lecturaModel');
const ParametroConfig = require('../models/parametroConfigModel');
const Notificacion = require('../models/notificacionModel');
const NotificacionUsuario = require('../models/notificacionUsuarioModel');
const Sensor = require('../models/sensorModel');
const Cliente = require('../models/clienteModel');

router.get('/', middleware.ensureAuthenticated, async (req, res) => {
    const lecturas = await Lectura.find();
    res.json(lecturas);
});

router.get('/:codigo', middleware.ensureAuthenticated, async (req, res) => {
    let codigo = req.params.codigo
    await Lectura.findOne({ codigo: codigo }, (err, lectura) => {
        if (err) return res.status(500).send({ message: 'error al realizar la peticion' })
        if (!lectura) return res.status(404).send({ mesagge: ' el lectura no exiten' })

        res.json(lectura)
    })
});

router.get('/:usuario/:fechaInicial/:fechaFinal', middleware.ensureAuthenticated, async (req, res) => {
    let usuario = req.params.usuario
    lecturasAEnviar = [];
    const sensoresPorUsuario = await Sensor.find({ usuario: usuario });
    await Lectura.find({ "hora": { "$gte": req.params.fechaInicial, "$lt": req.params.fechaFinal } }, (err, lectura) => {
        if (err) return res.status(500).send({ message: 'error al realizar la peticion' })
        if (!lectura) return res.status(404).send({ mesagge: ' el lectura no exiten' })
        console.log(lectura);
        lectura.forEach(function (itemLect) {
            sensoresPorUsuario.forEach(function (item) {
                if (itemLect.sensor == item.codigo) {
                    lecturasAEnviar.push(itemLect);
                }
            });
        });

        res.json(lecturasAEnviar)
    });
});

router.get('/:sensor/:adc/:ppm/:estado/:voltaje/:mgm3', async (req, res) => {

    const lectura = new Lectura();
    const sensorUsuario = await Sensor.findOne({ codigo: req.params.sensor });
    lectura.sensor = req.params.sensor;
    lectura.adc = req.params.adc;
    lectura.ppm = req.params.ppm;
    lectura.estado = req.params.estado;
    lectura.voltaje = req.params.voltaje;
    lectura.mgm3 = req.params.mgm3;

    const lecturas = await Lectura.find();
    var num = 0;
    if (lecturas.length > 0) {
        if (lecturas[lecturas.length - 1])
            num = lecturas[lecturas.length - 1].codigo
    }

    //comprobacion de valores altos
    await EnvioNotificaciones(req.params.sensor, sensorUsuario.usuario, "adc", req.params.adc);
    await EnvioNotificaciones(req.params.sensor, sensorUsuario.usuario, "ppm", req.params.ppm);
    await EnvioNotificaciones(req.params.sensor, sensorUsuario.usuario, "estado", req.params.estado);
    await EnvioNotificaciones(req.params.sensor, sensorUsuario.usuario, "voltaje", req.params.voltaje);
    await EnvioNotificaciones(req.params.sensor, sensorUsuario.usuario, "mgm3", req.params.mgm3);


    lectura.codigo = num + 1
    lectura.hora = new Date();

    //guardar lectura
    await lectura.save();

    res.json({
        status: 'Lectura Guardado'
    });
});

router.post('/', middleware.ensureAuthenticated, async (req, res) => {
    let lectura = await Lectura.findOne({ codigo: req.body.codigo })
    Object.assign(lectura, req.body)
    await lectura.save()
    res.json({
        status: 'Lectura Actualizado'
    });
});

router.delete('/', middleware.ensureAuthenticated, async (req, res) => {
    console.log(req.query);
    await Lectura.findByIdAndRemove(req.query);
    res.json({
        status: 'Lectura eliminado'
    });
});

async function EnvioNotificaciones(sensor, usuario, nombre, valor) {
    const parametro = await ParametroConfig.findOne({ usuario: usuario, nombre: nombre });
    const sensorAfectado = await Sensor.findOne({ codigo: sensor });
    const cliente = await Cliente.findOne({ codigo: usuario });
    if (parametro.valor < valor) {
        const notificaciones = await Notificacion.find();
        var num = 0;
        if (notificaciones.length > 0) {
            if (notificaciones[notificaciones.length - 1])
                num = notificaciones[notificaciones.length - 1].codigo
        }
        const notificacion = new Notificacion();
        notificacion.tipo = 1;
        notificacion.medio = 1;
        notificacion.asunto = "Valores altos de " + nombre;
        notificacion.descripcion = "Se presento el valor: " + valor + " en " + nombre + " en el sensor con ip: " + sensorAfectado.ip;
        notificacion.codigo = num + 1
        notificacion.hora = new Date();
        await notificacion.save();

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'raspberry.sromero@gmail.com',
                pass: 'proyectoNode'
            }
        });

        var mailOptions = {
            from: 'raspberry.sromero@gmail.com',
            to: cliente.correo,
            subject: notificacion.asunto,
            text: notificacion.descripcion
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email enviado: ' + info.response);
            }
        });

        //guardar en la tabla notificacionUsuario
        const notificacionUsuario = new NotificacionUsuario();
        notificacionUsuario.usuario = usuario;
        notificacionUsuario.notificacion = notificacion.codigo;
        await notificacionUsuario.save();
    }
}

module.exports = router;