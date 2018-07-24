const express = require('express');
const router = express.Router();

const Cliente = require('../models/clienteModel');

router.get('/', async (req, res) =>{
    const clientes = await Cliente.find();
    res.json(clientes);
});

router.get('/:numdocumento', async (req, res) =>{
    let numdocumento = req.params.numdocumento
    await Cliente.findOne( {num_documento:numdocumento}, (err, cliente) => {
        if(err) return res.status(500).send({ message: 'error al realizar la peticion'})
        if(!cliente) return res.status(404).send({ mesagge :' el cliente no exiten'})

        res.json(cliente)
    })
});

router.put('/', async (req, res) => {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.json({
        status: 'Cliente Guardado'
    });
});

router.post('/', async (req, res) => {
    let cliente = await Cliente.findOne({num_documento:req.body.num_documento})
    Object.assign(cliente, req.body)
    await cliente.save()
    res.json({
        status: 'Cliente Actualizado'
    });
//    Cliente.findOne({cedula:req.body.id})
//     .then(cliente => {
//         Object.assign(cliente, req.body)
//         return cliente.save()
//     })
//     .then(() => {
//         res.json({
//             status:'Cliente actualizado'
//            });
//     })
//     .catch(err => {

//     })
});

router.delete('/', async (req, res) => {
    console.log(req.query);
   await Cliente.findByIdAndRemove(req.query);
   res.json({
    status:'Cliente eliminado'
   });
});

module.exports = router;