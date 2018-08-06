const express = require('express');
const router = express.Router();
var middleware = require('../middleware');
var nodemailer = require('nodemailer');


//modelos
const Lectura = require('../models/lecturaModel');
const ParametroConfig = require('../models/parametroConfigModel');
const Notificacion = require('../models/notificacionModel');
const NotificacionUsuario = require('../models/notificacionUsuarioModel');
const Cliente = require('../models/clienteModel');
const Equipo = require('../models/equipoModel');

router.get('/', middleware.ensureAuthenticated, async (req, res) => {
    const lecturas = await Lectura.find();
    res.json(lecturas);
});

router.get('/:codigo', middleware.ensureAuthenticated, async (req, res) => {//Se define una nueva ruta para el método GET usando el parámetro código 
    let codigo = req.params.codigo
    await Lectura.findOne({ codigo: codigo }, (err, lectura) => {
        if (err) return res.status(500).send({ message: 'error al realizar la petición' })
        if (!lectura) return res.status(404).send({ mesagge: ' las lecturas no exiten' })

        res.json(lectura)
    })
});

router.get('/:usuario/:fechaInicial/:fechaFinal', middleware.ensureAuthenticated, async (req, res) => {//Se define una nueva ruta para el método GET usando el parámetro usuario,
																																													 //fecha inicial y final
    let usuario = req.params.usuario
    lecturasAEnviar = [];
    const equiposPorUsuario = await Equipo.find({ usuario: usuario });//Realiza la búsqueda de usuario en Equipo
    await Lectura.find({ "hora": { "$gte": req.params.fechaInicial, "$lt": req.params.fechaFinal } }, (err, lectura) => {//Realiza la búsqueda en el campo hora de Lectura de acuerdo a fecha inicial
																																																		//y final
        if (err) return res.status(500).send({ message: 'error al realizar la petición' })
        if (!lectura) return res.status(404).send({ mesagge: ' las lecturas no exiten' })
        console.log(lectura);
        lectura.forEach(function (itemLect) {
            equiposPorUsuario.forEach(function (item) {
                if (itemLect.equipo == item.codigo) {//Si el campo equipo de Lectura es igual al campo código de Equipo 
                    lecturasAEnviar.push(itemLect);//Se almacenas las lecturas en el array lecturasAEnviar
                }
            });
        });

        res.json(lecturasAEnviar)//Se envía en la respuesta el array lecturasAEnviar en formato JSON
    });
});

router.get('/:equipo/:adc/:ppm/:estado/:voltaje/:mgm3', async (req, res) => {//Se define una nueva ruta para el método GET usando el parámetro equipo, adc, ppm, estado, volatje y mgm3
																																		  //Sirve para poder guardar la lectura correspondiente al envío de datos desde el equipo transmisor
    const lectura = new Lectura();//Se crea una nueva Lectura
    const equipoUsuario = await Equipo.findOne({codigo:req.params.equipo});//Se realiza la búsqueda del equipo
    lectura.equipo = req.params.equipo; //Se almacenan en los campos correspondientes de lectura los parámetros correspondientes enviados en la petición
    lectura.adc = req.params.adc;
    lectura.ppm = req.params.ppm;
    lectura.estado = req.params.estado;
    lectura.voltaje = req.params.voltaje;
    lectura.mgm3 = req.params.mgm3;

    const lecturas = await Lectura.find();//Se realiza la búsqueda de todas las lecturas
    var num = 0;
    if (lecturas.length > 0) {
        if (lecturas[lecturas.length - 1])
            num = lecturas[lecturas.length - 1].codigo//Se obtiene el código del último elemento del array lecturas
    }

    //Comprobación de valores altos
    await EnvioNotificaciones(req.params.equipo, equipoUsuario.usuario, "adc", req.params.adc);
    await EnvioNotificaciones(req.params.equipo, equipoUsuario.usuario, "ppm", req.params.ppm);
    await EnvioNotificaciones(req.params.equipo, equipoUsuario.usuario, "estado", req.params.estado);
    await EnvioNotificaciones(req.params.equipo, equipoUsuario.usuario, "voltaje", req.params.voltaje);
    await EnvioNotificaciones(req.params.equipo, equipoUsuario.usuario, "mgm3", req.params.mgm3);


    lectura.codigo = num + 1//En el campo código de la nueva lectura se asigna el valor de num + 1
    lectura.hora = new Date();//En el campo hora de la nueva lectura se asigna la fecha actual

    //Se guarda la nueva lectura
    await lectura.save();

    res.json({
        status: 'Lectura Guardada'
    });
});

router.post('/', middleware.ensureAuthenticated, async (req, res) => {
    let lectura = await Lectura.findOne({ codigo: req.body.codigo })
    Object.assign(lectura, req.body)
    await lectura.save()
    res.json({
        status: 'Lectura Actualizada'
    });
});

router.delete('/', middleware.ensureAuthenticated, async (req, res) => {
    console.log(req.query);
    await Lectura.findByIdAndRemove(req.query);
    res.json({
        status: 'Lectura Eliminada'
    });
});

    
async function EnvioNotificaciones(equipo, usuario, nombre, valor) {//Se define la función EnvioNotificaciones
    const parametro = await ParametroConfig.findOne({ usuario: usuario, nombre: nombre });//Se busca el parámetro de configuración de la notificación de acuerdo al usuario
    const cliente = await Cliente.findOne({ codigo: usuario });																																									//y nombre del parámetro (adc, ppm, estado, voltaje o mgm3)
	const equipoAfectado = await Equipo.findOne({ codigo: equipo });//Se busca el equipo afectado  
    if (parametro.valor < valor) {//Si el valor del parámetro configurado es menor que el valor de la lectura
        const notificaciones = await Notificacion.find();//Se busca todas las notificaciones
        var num = 0;
        if (notificaciones.length > 0) {
            if (notificaciones[notificaciones.length - 1])
                num = notificaciones[notificaciones.length - 1].codigo//Se asigna en num el código de la última notificación
        }
        const notificacion = new Notificacion();//Se crea una nueva notificación y se asignan los valores correspondientes
        notificacion.tipo = 1;
        notificacion.medio = 1;
        notificacion.asunto = "Valores altos de " + nombre;
        notificacion.descripcion = "Se presentó el valor: " + valor + " en " + nombre + " en el equipo con ip: " + equipoAfectado.ip;
        notificacion.codigo = num + 1
        notificacion.hora = new Date();
        await notificacion.save();//se guarda la notificación

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

        //Se guarda en la tabla notificacionUsuario
        const notificacionUsuario = new NotificacionUsuario();
        notificacionUsuario.usuario = usuario;
        notificacionUsuario.notificacion = notificacion.codigo;
        await notificacionUsuario.save();
    }
}

module.exports = router;