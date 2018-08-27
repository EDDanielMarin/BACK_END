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
    let fechaini = new Date(req.params.fechaInicial).toISOString();
    let fechafin = new Date(req.params.fechaFinal).toISOString();
    lecturasAEnviar = [];
    const equiposPorUsuario = await Equipo.find({ usuario: usuario });//Realiza la búsqueda de usuario en Equipo
    await Lectura.find({ "hora": { "$gte": fechaini, "$lt": fechafin } }, (err, lectura) => {//Realiza la búsqueda en el campo hora de Lectura de acuerdo a fecha inicial
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

    if (equipoUsuario.estado == 1) { // Si el estado del equipo es activo
        lectura.equipo = req.params.equipo; //Se almacenan en los campos correspondientes de lectura los parámetros correspondientes enviados en la petición
        lectura.sensor = req.params.equipo;
        lectura.adc = req.params.adc;
        lectura.ppm = req.params.ppm;
        lectura.estado = req.params.estado;
        lectura.voltaje = req.params.voltaje;
        lectura.mgm3 = req.params.mgm3;
        if (lectura.estado < 1) // Cuando no se detecta CO, se omite la lectura
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
        await EnvioNotificaciones(req.params.equipo, equipoUsuario.usuario, "ppm", req.params.ppm);
        await EnvioNotificaciones(req.params.equipo, equipoUsuario.usuario, "mgm3", req.params.mgm3);

        lectura.codigo = num + 1//En el campo código de la nueva lectura se asigna el valor de num + 1
        const Fecha = new Date();
        A = Fecha.getFullYear().toString();
        M = Fecha.getMonth();
        mes = (M+1).toString();
        D = Fecha.getDate().toString();
        h = Fecha.getHours();
        m = Fecha.getMinutes().toString();
        s = Fecha.getSeconds().toString();
        ms = Fecha.getMilliseconds().toString();
        hn = (h - 5).toString();
        FQuito = A+"-"+mes+"-"+D+"T"+h+"-"+m+"-"+s;
        console.log(FQuito);
        console.log(Fecha); 
        lectura.hora = FQuito;//En el campo hora de la nueva lectura se asigna la fecha actual
        
        //Se guarda la nueva lectura únicamente cuando se detecta CO
        if (lectura.estado >= 1)
            await lectura.save();

        res.json({
            status: 'Lectura Guardada'
        });
    } else {
        res.json({
            status: 'Estado invalido'
        });
    }
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

    const parametrosEncontrados = await ParametroConfig.find({ usuario: usuario });//Se busca los parámetros de configuración de la notificación de acuerdo al usuario

    nuevoArray = []; // Se define un arreglo

    parametrosEncontrados.forEach(function (item) { // Se recorre el arreglo de los parámetros encontrados
        var arrayTipo = item.nombre.split("_"); // En arrayTipo se obtiene el tipo de parámetro (mgm3 o ppm)
        console.log(nombre + " == " + arrayTipo[0]) // Se imprime por consola el tipo de parámetro
        if (arrayTipo[0] === nombre) { //Si el tipo de parámetro de configuración coincide con el nombre del parámetro
            nuevoArray.push(item); // En nuevo array se añade el parámetro de configuración
        }
    });

    console.log(JSON.stringify(nuevoArray)); // Se imprime por consola el nuevo array
    console.log(nombre); // Se imprime por consola el nombre del parámetro
    console.log(valorDeEntrada); // Se imprime por consola el valor de la lectura
    var arrayTipoAUX = nuevoArray[0].nombre.split("_"); // Se obtiene el tipo de parámetro (mgm3 o ppm)
    if (arrayTipoAUX[1] === "e") { // Si se trata del parámetro mgm3
        if (nuevoArray[0].valor < valorDeEntrada) { // Si el valor de entrada es mayor al parámetro de emergencia
            await EnviarNotificacionPorTipo(equipo, usuario, nombre, valorDeEntrada, 2);
        } else if (nuevoArray[1].valor < valorDeEntrada) { // Si el valor de entrada es mayor al parámetro de alerta
            await EnviarNotificacionPorTipo(equipo, usuario, nombre, valorDeEntrada, 1);
        }
    } else { // Si se trata del parámetro ppm
        if (nuevoArray[1].valor < valorDeEntrada) { // Si el valor de entrada es mayor al parámetro de emergencia
            await EnviarNotificacionPorTipo(equipo, usuario, nombre, valorDeEntrada, 2);
        } else if (nuevoArray[0].valor < valorDeEntrada) { // Si el valor de entrada es mayor al parámetro de alerta
            console.log("1")
            await EnviarNotificacionPorTipo(equipo, usuario, nombre, valorDeEntrada, 1);
        }
    }
}

async function EnviarNotificacionPorTipo(equipo, usuario, nombre, valor, tipo) { //Se define la función EnviarNotificacionPorTipo

    const usr = await Usuario.findOne({ codigo: usuario }) //Realiza la búsqueda del usuario
    if (!usr)
        return res.json({ mesaje: "Error no se encontro usuario" })

    const cliente = await Cliente.findOne({ identificacion: usr.cliente });//Se busca el cliente de acuerdo a la identificación 																																						
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
    if (tipo === 1) { // Se define el asunto de la notificación de acuerdo al tipo
        notificacion.asunto = "Alarma de valor alto en " + nombre;
    } else {
        notificacion.asunto = "Emergencia! Valor alto en " + nombre;
    }

    // Se definen el resto de campos de la nueva notificación
    notificacion.usuario = usuario;
    notificacion.descripcion = "Se presentó el valor: " + valor + " en " + nombre;
    notificacion.codigo = num + 1
    notificacion.hora = new Date();
    await notificacion.save();//se guarda la notificación

    var transporter = nodemailer.createTransport({//Se crea el servicio de transporte necesario para poder enviar correos electrónicos
        service: 'gmail',//Se especifica el uso de gmail
        auth: {//Se define el objeto de autenticación especificando la cuenta y contraseña de gmail
            user: 'raspberry.ard@gmail.com',
            pass: 'proyectoNode'
        }
    });

    var mailOptions = {//Se especifican los detalles del correo a enviar como emisor, receptor, asunto y texto
        from: 'raspberry.ard@gmail.com',
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