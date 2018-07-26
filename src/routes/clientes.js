const express = require('express');
const router = express.Router();
var service = require('../services');
var middleware = require('../middleware');

const Cliente = require('../models/clienteModel');

//envia token
router.get('/', async (req, res) =>{
    const clientes = await Cliente.find();
    res.json(clientes).send({token: service.createToken(clientes)});;
});

//verifica token
router.get('/:identificacion',middleware.ensureAuthenticated, async (req, res) =>{
    let identificacion = req.params.identificacion
    await Cliente.findOne( {identificacion:identificacion}, (err, cliente) => {
        if(err) return res.status(500).send({ message: 'error al realizar la peticion'})
        if(!cliente) return res.status(404).send({ mesagge :' el cliente no exiten'})

        res.json(cliente)
    })
});

router.put('/', async (req, res) => {
    
    const clientes = await Cliente.find(); 
    var num = 0;
    if(clientes.length > 0)
    {
        if(clientes[clientes.length-1])
             num = clientes[clientes.length-1].codigo
    }
    const cliente = new Cliente(req.body);
    cliente.codigo=num+1

    await cliente.save();
    res.json({
        status: 'Cliente Guardado'
    });
});

router.post('/', async (req, res) => {
    let cliente = await Cliente.findOne({identificacion:req.body.identificacion})
    Object.assign(cliente, req.body)
    await cliente.save()
    res.json({
        status: 'Cliente Actualizado'
    });
});

router.delete('/', async (req, res) => {
    console.log(req.query);
   await Cliente.findByIdAndRemove(req.query);
   res.json({
    status:'Cliente eliminado'
   });
});

module.exports = router;