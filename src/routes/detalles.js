const express = require('express');
const router = express.Router();

const Detalle = require('../models/detalleFacturaModel');

router.get('/', async (req, res) =>{
    const detalles = await Detalle.find();
    res.json(detalles);
});


router.post('/', async (req, res) => {
    const detalle = new Detalle(req.body);
    await detalle.save();
    res.json({
        status: 'Detalle Guardado'
    });
});


router.delete('/:id', async (req, res) => {
   await Detalle.findByIdAndRemove(req.params.id);
   res.json({
    status:'Detalle eliminado'
   });
});

module.exports = router;