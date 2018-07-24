const express = require('express');
const router = express.Router();
const Cliente = require('../models/clienteModel');
const Factura = require('../models/cabeceraFacturaModel');

router.get('/', async (req, res) =>{
    const facturas = await Factura.find(); 
    res.json(facturas);
});

/*router.get('/buscar/:cedula', async (req, res) =>{
    let cedula = req.params.cedula
    let cliente = await Factura.findOne({"cliente":cedula})
    //console.log('cliente', cliente)
    res.json(cliente);
});*/

router.get('/buscar/:cedula', async (req, res) =>{
        let cedula = req.params.cedula
        //let factura = await Factura.findOne({"cliente":cedula}, { _id: 1 })
        //console.log('clinete', factura)
        const facturas = await Factura.find({"cliente":cedula}); 
        console.log('facturas', facturas)
         res.json(facturas);
         
     });
     


router.get('/numero',async (req, res) =>{
    const facturas = await Factura.find(); 
    var fac = facturas.sort((a,b)=>a.numeroFactura-b.numeroFactura);
    console.log(fac);
    var num = facturas[facturas.length-1].numeroFactura
    console.log(num);
    res.json({
    numeroFactura: ++num
});
}); 


router.put('/', async (req, res) => {
    
    const facturas = await Factura.find(); 
    var num = 100;
    if(facturas.length > 0)
    {
        var fac = facturas.sort((a,b)=>a.numeroFactura-b.numeroFactura);
        if(facturas[facturas.length-1])
             num = facturas[facturas.length-1].numeroFactura
        
    }
    
    const factura = new Factura(req.body);
    factura.numeroFactura=num+1

    await factura.save();
    res.json({
        status: 'Factura Guardada' + (num+1)
    });
});

router.post('/', async (req, res) => {
    let factura = await Factura.findOne({numeroFactura:req.body.numeroFactura})
    factura.fechapago = new Date()
    Object.assign(factura, req.body)
    await factura.save()
    res.json({
        status: 'Estado Actualizado'
    });
});

module.exports = router;