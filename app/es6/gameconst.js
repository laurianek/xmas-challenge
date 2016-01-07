'use strict';

app.constant('GameConst', {
  WIN_POINT: 1,
  DRAW_POINT: 0.5,
  SINGLE_PLAYER: 'single-player',
  MULTI_PLAYER: 'multy-player',
  SOCKET_PLAYER: 'socket-player'
});

app.constant('MakerConst', {
  NOUGHT: 'nought',
  CROSS: 'cross',
  NOUGHT_CLASS: 'symbol-nought',
  CROSS_CLASS: 'symbol-cross',
  NOUGHT_MARKER: { symbol: 'nought', _class: 'symbol-nought'},
  CROSS_MARKER:  { symbol: 'cross',  _class: 'symbol-cross'}
});