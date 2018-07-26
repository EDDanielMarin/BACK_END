const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
var service = require('./services');
var middleware = require('./middleware');

const app = express();
mongoose.connect('mongodb://localhost/Back_end')
.then(db => console.log('BD esta conectada'))
.catch(err => console.error(err));
//settings
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

//Routes
app.use('/clientes', require('./routes/clientes'))
app.use('/usuarios', require('./routes/usuarios'))
app.use('/lecturaUsuarios', require('./routes/lecturaUsuarios'))
app.use('/notificacionUsuarios', require('./routes/notificacionUsuarios'))
app.use('/parametroConfigs', require('./routes/parametroConfigs'))
app.use('/lecturas', require('./routes/lecturas'))
app.use('/sensores', require('./routes/sensores'))
app.use('/tipoNotificaciones', require('./routes/tipoNotificaciones'))
app.use('/medios', require('./routes/medios'))
app.use('/notificaciones', require('./routes/notificaciones'))

// Static files
app.use(express.static(__dirname + '/public'))


//server is listening
app.listen(app.get('port'), () => {
 console.log('server on port 3000');
});