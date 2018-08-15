const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const ParametroConfig = require('../models/parametroConfigModel');

router.get('/',middleware.ensureAuthenticated, async (req, res) =>{
    const parametroConfigs = await ParametroConfig.find();
    res.json(parametroConfigs);
});

router.get('/:usuario',middleware.ensureAuthenticated, async (req, res) =>{
    let codigo = req.params.usuario
    await ParametroConfig.find( {usuario:codigo}, (err, parametroConfig) => {
        if(err) return res.status(500).send({ message: 'error al realizar la petición'})
        if(!parametroConfig) return res.status(404).send({ mesagge :' el parametroConfig no existe'})

        res.json(parametroConfig)
    })
});

router.put('/',middleware.ensureAuthenticated, async (req, res) => {
    
    const parametroConfigs = await ParametroConfig.find(); 
    var num = 0;
    if(parametroConfigs.length > 0)
    {
        if(parametroConfigs[parametroConfigs.length-1])
             num = parametroConfigs[parametroConfigs.length-1].codigo
    }
    const parametroConfig = new ParametroConfig(req.body);
    parametroConfig.codigo=num+1

    await parametroConfig.save();
    res.json({
        status: 'ParametroConfig Guardado'
    });
});

router.post('/',middleware.ensureAuthenticated, async (req, res) => {
    let parametroConfig = await ParametroConfig.findOne({codigo:req.body.codigo})
    Object.assign(parametroConfig, req.body)
    await parametroConfig.save()
    res.json({
        status: 'ParametroConfig Actualizado'
    });
});

router.delete('/:usuario',middleware.ensureAuthenticated, async (req, res) => {

    let cli = req.params.usuario
    await ParametroConfig.find( {usuario:cli}, (err, usuarios) => {
        if(err) 
        return res.status(500).send({ message: 'error al realizar la petición'})
        if(!usuarios)
        return res.status(404).send({ mesagge :'no hay parametros del usuario'})
        usuarios.forEach(element => {
            ParametroConfig.findByIdAndRemove(element._id,(err, res) =>{
                if(err)res.json({
                    status: 'Error al eliminar',
                    error: err

                });
            });
        });
        res.send({
            status:'Parametros eliminados'
           });
    })

  /* await ParametroConfig.findByIdAndRemove(req.query);
   res.json({
    status:'ParametroConfig eliminado'
   });*/
});

module.exports = router;