// very small express server


var express = require('express');
var app = express();
//var io = require('socket.io')(server);

app.get('/', function(req, res) {
  res.sendfile('dist/index.html');
});

//io.on('connection', function (socket) {
//  socket.emit('news', { hello: 'world' });
//  socket.on('my other event', function (data) {
//    console.log(data);
//  });
//});