'use strict';

app.factory('SocketService', function () {
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

  return {
    emit: emit,
    on: on,
    onReceivePlayers: onReceivePlayers
  };
});