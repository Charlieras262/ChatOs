const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const database = require('./database');

const app = express();

//Setting
app.set("port", process.env.PORT || 3000);

//Database Connection
database();

//MiddleWares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

// Starting Server
var server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
});

require('./websockets/socket.io')(io);

module.exports = app;