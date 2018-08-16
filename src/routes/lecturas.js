const express = require('express');
const router = express.Router();
var middleware = require('../middleware');
var nodemailer = require('nodemailer');//Permite incluir el módulo nodemailer en el código para que sea posible el envío de correos electrónicos


//modelos
const Lectura = require('../models/lecturaModel');
const ParametroConfig = require('../models/parametroConfigModel');
const Notificacion = require('../models/notificacionModel');
const NotificacionUsuario = require('../models/notificacionUsuarioModel');
const Cliente = require('../models/clienteModel');
const Equipo = require('../models/equipoModel');
const Usuario = require('../models/usuarioModel');

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
        //console.log(lectura);
        lectura.forEach(function (itemLect) {
            equiposPorUsuario.forEach(function (item) {
                if (itemLect.sensor == item.codigo) {//Si el campo equipo de Lectura es igual al campo código de Equipo 
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
    const equipoUsuario = await Equipo.findOne({ codigo: req.params.equipo });//Se realiza la búsqueda del equipo
    lectura.equipo = req.params.equipo; //Se almacenan en los campos correspondientes de lectura los parámetros correspondientes enviados en la petición
    lectura.adc = req.params.adc;
    lectura.ppm = req.params.ppm;
    lectura.estado = req.params.estado;
    lectura.voltaje = req.params.voltaje;
    lectura.mgm3 = req.params.mgm3;
    if (lectura.estado < 1)
        return res.json({
            status: 'Lectura Omitida'
        })
    const lecturas = await Lectura.find();//Se realiza la búsqueda de todas las lecturas
    var num = 0;
    if (lecturas.length > 0) {
        if (lecturas[lecturas.length - 1])
            num = lecturas[lecturas.length - 1].codigo//Se obtiene el código del último elemento del array lecturas
    }

    //Comprobación de valores altos
    //await EnvioNotificaciones(req.params.equipo, equipoUsuario.usuario, "adc", req.params.adc);
    await EnvioNotificaciones(req.params.equipo, equipoUsuario.usuario, "ppm", req.params.ppm);
    //await EnvioNotificaciones(req.params.equipo, equipoUsuario.usuario, "estado", req.params.estado);
    //await EnvioNotificaciones(req.params.equipo, equipoUsuario.usuario, "voltaje", req.params.voltaje);
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


async function EnvioNotificaciones(equipo, usuario, nombre, valorDeEntrada) {//Se define la función EnvioNotificaciones


    const parametrosEncontrados = await ParametroConfig.find({ usuario: usuario });//Se busca el parámetro de configuración de la notificación de acuerdo al usuario

    nuevoArray = [];

    parametrosEncontrados.forEach(function (item) {
        var arrayTipo = item.nombre.split("_");
        console.log(nombre + " == " + arrayTipo[0])
        if (arrayTipo[0] === nombre) {
            nuevoArray.push(item);
        }
    });

    console.log(JSON.stringify(nuevoArray));
    console.log(nombre);
    console.log(valorDeEntrada);
    var arrayTipoAUX = nuevoArray[0].nombre.split("_");
    if (arrayTipoAUX[1] === "e") {
        if (nuevoArray[0].valor < valorDeEntrada) {
            await EnviarNotificacionPorTipo(equipo, usuario, nombre, valorDeEntrada, 2);
        } else if (nuevoArray[1].valor < valorDeEntrada) {
            await EnviarNotificacionPorTipo(equipo, usuario, nombre, valorDeEntrada, 1);
        }
    } else {
        if (nuevoArray[1].valor < valorDeEntrada) {
            await EnviarNotificacionPorTipo(equipo, usuario, nombre, valorDeEntrada, 2);
        } else if (nuevoArray[0].valor < valorDeEntrada) {
            console.log("1")
            await EnviarNotificacionPorTipo(equipo, usuario, nombre, valorDeEntrada, 1);
        }
    }

}

async function EnviarNotificacionPorTipo(equipo, usuario, nombre, valor, tipo) {

    const usr = await Usuario.findOne({ codigo: usuario })
    if (!usr)
        return res.json({ mesaje: "Error no se encontro usuario" })


    const cliente = await Cliente.findOne({ identificacion: usr.cliente });//Se busca el cliente de acuerdo al usuario afectado 																																								//y nombre del parámetro (adc, ppm, estado, voltaje o mgm3)
    console.log(usr)

    console.log(cliente)
    const equipoAfectado = await Equipo.findOne({ codigo: equipo });//Se busca el equipo afectado

    const notificaciones = await Notificacion.find();//Se busca todas las notificaciones

    var num = 0;
    if (notificaciones.length > 0) {
        if (notificaciones[notificaciones.length - 1])
            num = notificaciones[notificaciones.length - 1].codigo//Se asigna en num el código de la última notificación
    }
    const notificacion = new Notificacion();//Se crea una nueva notificación y se asignan los valores correspondientes
    notificacion.tipo = tipo;
    notificacion.medio = 1;
    if (tipo === 1) {
        notificacion.asunto = "Alarma de valor alto en " + nombre;
    } else {
        notificacion.asunto = "Emergencia! Valor alto en " + nombre;
    }

    notificacion.descripcion = "Se presentó el valor: " + valor + " en " + nombre + " en el equipo con ip: " + equipoAfectado.ip;
    notificacion.codigo = num + 1
    notificacion.hora = new Date();
    await notificacion.save();//se guarda la notificación

    var transporter = nodemailer.createTransport({//Se crea el servicio de transporte necesario para poder enviar correos electrónicos
        service: 'gmail',//Se especifica el uso de gmail
        auth: {//Se define el objeto de autenticación especificando la cuenta y contraseña de gmail
            user: 'raspberry.sromero@gmail.com',
            pass: 'proyectoNode'
        }
    });

    var mailOptions = {//Se especifican los detalles del correo a enviar como emisor, receptor, asunto y texto
        from: 'raspberry.sromero@gmail.com',
        to: cliente.correo,
        subject: notificacion.asunto,
        text: notificacion.descripcion
    };

    transporter.sendMail(mailOptions, function (error, info) {//Se usa el servicio de transporte creado anteriormente para enviar el correo de acuerdo a los detalles especificados previamente
        if (error) {
            console.log(error);//Si existe algún error se muestra por consola el error
        } else {
            console.log('Email enviado: ' + info.response);//Caso contrario se muestra por consola el mensaje correspondiente al envío del correo
        }
    });

    //Se guarda en la tabla notificacionUsuario
    const notificacionUsuario = new NotificacionUsuario();
    notificacionUsuario.usuario = usuario;
    notificacionUsuario.notificacion = notificacion.codigo;
    await notificacionUsuario.save();

}

module.exports = router;