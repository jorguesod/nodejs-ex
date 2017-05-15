var fs = require('fs'); // filesystem
var path = require('path'); // common path helper functions

var express = require('express'); // simple web server customizer
var app = express(); // create overriable web app instance
var server = require('http').Server(app); // create web server and override it with app
var io = require('socket.io')(server); // live message between server and client like chats for example


var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// normal rest api
// root = "/" url - return index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
// url return files relative the from public
app.use('/', express.static(path.join(__dirname, 'public')));

// client/server communication
// when client connects to server
io.on('connection', function (socket) {
    // when client disconnects
    console.log('client connected');
    socket.emit('to_client', { type: 'message', val: 'Hi I´m server' });
    // subscribe to client events
    socket.on('to_server', function(data) {
        if(data && data.type == 'new_client_score'){

        }
        console.log(data);
    });
    // client 
    socket.on('disconnected', function () {
        console.log('client disconnected');
    });
});
// io.emit send all - socket.emit send to only that client

// start server
server.listen(port, ip, function(){
    console.log('Server running on http://%s:%s', ip, port);
});


// File watcher
var chokidar = require('chokidar');
var watcher = chokidar.watch('.', {
    ignored: /(^|[\/\\])\../,
    persistent: true
});
watcher.on('change', function(path){
    // notify all clients files has changed
    if(/^public.+$/.test(path)){
        io.emit('refresh', { path: path });
    }
});