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
var playersInGame = {};

io.on('connection', function(socket) {
  console.log('someone connected');
  socket.join('online free');

  socket.on('mark', function (data) {
    if(!data) {
      //some socket error handling here
      return;
    }
    var sockets = data.sockets;
    var position = data.position;
    console.log(sockets, position);
    io.sockets.connected[sockets[0]].emit('make the mark', position);
    io.sockets.connected[sockets[1]].emit('make the mark', position);
  });

  socket.on('register player', function(data) {
    if(!data) {
      //some socket error handling here
      return;
    }
    data.id = socket.id;
    var index = getPlayerIndex(socket.id);
    index === -1? players.push(data) : players[index] = data;
    console.log(players);
    io.sockets.emit('online player list', activePlayers());
  });

  socket.on('challenge', function (data) {
    if(!data) {
      //some socket error handling here
      return;
    }
    var toSocket = io.sockets.connected[data.to.id];
    if (!toSocket) {
      socket.emit('gone offline', data.to);
      io.sockets.emit('online player list', activePlayers());
      return;
    }
    data.from.id = socket.id;
    toSocket.emit('challenged', data);
  });

  socket.on('accept challenge', function (data) {
    if(!data) {
      //some socket error handling here
      return;
    }
    var fromSocket = io.sockets.connected[data.from.id];
    if (!fromSocket) {
      socket.emit('gone offline', data.from);
      io.sockets.emit('online player list', activePlayers());
      return;
    }
    playersInGame[data.from.id] = data.from;
    playersInGame[data.to.id] = data.to;
    fromSocket.emit('challenge accepted', data);
    socket.emit('challenge accepted', data);
  });

  socket.on('reject challenge', function (data) {
    if(!data) {
      //some socket error handling here
      return;
    }
    var fromSocket = io.sockets.connected[data.from.id];
    if (!fromSocket) {
      io.sockets.emit('online player list', activePlayers());
      return;
    }
    fromSocket.emit('challenge rejected', data);
  });

  socket.on('replay accepted', function(data) {
    if(!data) {
      //some socket error handling here
      return;
    }
    var sockets = data.sockets;
    io.sockets.connected[sockets[0]].emit('replay');
    io.sockets.connected[sockets[1]].emit('replay');
  });

  socket.on('request replay', function(data) {
    if(!data) {
      //some socket error handling here
      return;
    }
    var sockets = data.sockets;
    io.sockets.connected[sockets[0]].emit('replay wanted', {from: socket.id});
    io.sockets.connected[sockets[1]].emit('replay wanted', {from: socket.id});
  });

  socket.on('update player', function(data) {
    if(!data) {
      //some socket error handling here
      return;
    }
    var sockets = data.sockets;
    var player = data.player;
    io.sockets.connected[sockets[0]].emit('update player', {from: socket.id, player: player});
    io.sockets.connected[sockets[1]].emit('update player', {from: socket.id, player: player});
  });

});

function activePlayers() {
  var newPlayerList = [];
  for (var i = 0; i < players.length; i++) {
    if (io.sockets.connected[players[i].id] && !playersInGame[players[i].id]) {
      newPlayerList.push(players[i]);
    }
  }
  players = newPlayerList;
  return players;
}
function getPlayerIndex(id) {
  for (var i = 0; i < players.length; i++) {
    if (players[i].id == id) {
      return i;
    }
  }
  return -1;
}