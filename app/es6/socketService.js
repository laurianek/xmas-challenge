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

  return {
    emit: emit,
    on: on
  };
});