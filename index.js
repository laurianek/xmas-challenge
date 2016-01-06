// very small express server


var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
var server = require('http').Server(app);
var io = require('socket.io')(server);


var initApp = function initApp() {

  server.listen(app.get('port'),function() {

    //a message to indicate a successful startup of the http server
    console.log('Your Node.js application is listening on port #: ' + app.get('port'));
  });
};

app.use('/', express.static('dist'));
app.use('/coverage', express.static(__dirname + '/coverage/PhantomJS'));
app.get('/', function(req, res) {
  res.redirect(301, '/');
});

// Start app server
initApp();

io.on('connection', function (socket) {
  socket.on('mark', function (data) {
    io.sockets.emit('make the mark', {data: data, socketId: socket.id});
  });
});