'use strict';

app.factory('SocketService', function (MakerConst) {
  var socket;
  init();

  function init() {
    if (typeof(io) === 'undefined') {
      console.log('Error no socket');
      return;
    }
    socket = io(location.origin);
  }
  function emit(eventName, data) {
    if (!socket) {
      console.log('receive emit request', eventName, data);
      return false;
    }
    socket.emit(eventName, data);
    return true;
  }
  function on(eventName, func) {
    if (!socket) {
      console.log('receive on request', eventName, func);
      return false;
    }
    socket.on(eventName, func);
    return true;
  }
  function onReceivePlayers(callback) {
    if (!socket) {
      console.log('receive onReceivePlayers request', callback);
      return false;
    }
    socket.on('online player list', function (data) {
      var currentPlayer = '/#' + socket.id;
      var playerList = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == currentPlayer) {
          continue;
        }
        playerList.push(data[i]);
      }
      callback(playerList);
    });
  }
  function onChallengeAccepted(callback){
    if (!socket) {
      console.log('receive onChallengeAccepted request', callback);
      return false;
    }
    socket.on('challenge accepted', function (data) {
      var currentPlayer = '/#' + socket.id;
      if (data.from.id == currentPlayer) {
        data.from.isCurrentPlayer = true;
        data.from.marker = MakerConst.NOUGHT_MARKER;
        data.to.isCurrentPlayer = false;
        data.to.marker = MakerConst.CROSS_MARKER;
        var player1Start = true;
        callback(data, player1Start);
        return;
      }
      data.from.isCurrentPlayer = false;
      data.from.marker = MakerConst.NOUGHT_MARKER;
      data.to.isCurrentPlayer = true;
      data.to.marker = MakerConst.CROSS_MARKER;
      var player1Start = false;
      callback(data, player1Start);
    });
  }

  return {
    emit: emit,
    on: on,
    onReceivePlayers: onReceivePlayers,
    onChallengeAccepted: onChallengeAccepted
  };
});