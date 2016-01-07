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

var players = [];

io.on('connection', function(socket) {
  console.log('someone connected');
  socket.join('online free');
  socket.on('mark', function (data) {
    io.sockets.emit('make the mark', {data: data, socketId: socket.id});
  });
  socket.on('register player', function(data) {
    data.id = socket.id;
    players.push(data);
    console.log('active players', activePlayers());
    io.sockets.emit('online player list', activePlayers());
  });
});

function activePlayers() {
  var newPlayerList = [];
  for (var i = 0; i < players.length; i++) {
    if (io.sockets.connected[players[i].id]) {
      newPlayerList.push(players[i]);
    }
  }
  players = newPlayerList;
  return players;
}