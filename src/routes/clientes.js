const express = require('express');//Permite incluir el módulo express en el código para que pueda ser usado
const router = express.Router();//Se crea una instancia de Express Router. La instancia se establece en una variable llamada router que se usará siempre que se quiera crear una ruta
var middleware = require('../middleware');//Permite incluir el archivo donde se definió el middleware
const Cliente = require('../models/clienteModel');//Permite incluir el modelo del Cliente

router.get('/',middleware.ensureAuthenticated, async (req, res) =>{ //Se define una nueva ruta para el método GET en la raíz de la aplicación
																														//Se usa la función de autenticación segura definida en el middleware
    const clientes = await Cliente.find();//Realiza la búsqueda de clientes 
    res.json(clientes);//Envía en la respuesta los cliente encontrados en formato JSON
});

router.get('/:identificacion',middleware.ensureAuthenticated , async (req, res) =>{//Se define una nueva ruta para el método GET usando el parámetro identificación  
    let identificacion = req.params.identificacion //Se declara la variable local identificación que corresponde al valor del parámetro identificación de la petición
    await Cliente.findOne( {identificacion:identificacion}, (err, cliente) => {//Se realiza la búsqueda del cliente considerando el parámetro identificación de la petición
																																//En la respuesta se deberá incluir el error y el cliente
        if(err) return res.status(500).send({ message: 'error al realizar la petición'})//Si existe un error, se devuelve en la respuesta el código de estado 500 y el mensaje correspondiente
        if(!cliente) return res.status(404).send({ mesagge :' el cliente no exite'})//Si no existe ningún cliente, se devuelve en la respuesta el código de estado 401y el mensaje correspondiente
        res.json(cliente) //Si la búsqueda es exitosa, se devuelve en la respuesta el cliente solicitado en formato JSON
    })
});

router.put('/',middleware.ensureAuthenticated, async (req, res) => {//Se define una nueva ruta para el método PUT en la raíz de la aplicación  
    
    const clientes = await Cliente.find(); //Realiza la búsqueda de clientes
    var num = 0;//Se inicializa la variable num
    if(clientes.length > 0)//Si la longitud del array clientes es mayor a 0
    {
        if(clientes[clientes.length-1])//Si existe el último elemento del array clientes
             num = clientes[clientes.length-1].codigo//Asigna en num el código del último elemento del array clientes
    }
    const cliente = new Cliente(req.body);//Se crea un nuevo cliente con los datos enviados en la petición
    cliente.codigo=num+1//En el parámetro código del cliente se asigna el valor de num + 1

    await cliente.save();//Se guarda la información del nuevo cliente
    res.json({
        status: 'Cliente Guardado' //Se devuelve en la respuesta el estado correspondiente en formato JSON
    });
});

router.post('/',middleware.ensureAuthenticated, async (req, res) => {//Se define una nueva ruta para el método POST en la raíz de la aplicación  
    let cliente = await Cliente.findOne({identificacion:req.body.identificacion})//Se declara la variable local cliente que corresponde a aquel cliente
																																		//cuya identificación coincide con el dato enviado en la petición
    Object.assign(cliente, req.body)//Permite copiar los datos enviados en la petición en el cliente
    await cliente.save()//Se guarda la información recientemente actualizada del cliente
    res.json({
        status: 'Cliente Actualizado'//Se devuelve en la respuesta el estado correspondiente en formato JSON
    });
});

router.delete('/',middleware.ensureAuthenticated, async (req, res) => {//Se define una nueva ruta para el método DELETE en la raíz de la aplicación  
    console.log(req.query);//Imprime por consola la consulta realizada en la petición
   await Cliente.findByIdAndRemove(req.query);//Busca el cliente de acuerdo a los parámetros consultados en la petición y lo elimina
   res.json({
    status:'Cliente eliminado'//Se devuelve en la respuesta el estado correspondiente en formato JSON
   });
});

module.exports = router;//Permite que las rutas definidas puedan ser usadas en cualquier parte del código