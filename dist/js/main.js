'use strict';

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function (callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}
'use strict';

// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (callback /*, initialValue*/) {
    'use strict';

    if (this == null) {
      throw new TypeError('Array.prototype.reduce called on null or undefined');
    }
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    var t = Object(this),
        len = t.length >>> 0,
        k = 0,
        value;
    if (arguments.length == 2) {
      value = arguments[1];
    } else {
      while (k < len && !(k in t)) {
        k++;
      }
      if (k >= len) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      value = t[k++];
    }
    for (; k < len; k++) {
      if (k in t) {
        value = callback(value, t[k], k, t);
      }
    }
    return value;
  };
}
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grid = (function () {
  function Grid() {
    var square = arguments.length <= 0 || arguments[0] === undefined ? 3 : arguments[0];

    _classCallCheck(this, Grid);

    this.square = square;
    this.grid = [];
    this.gameOver = false;
    this.freeCell = Math.pow(this.square, 2);
    for (var row = 0; row < this.square; row++) {
      this.grid[row] = [];
      for (var col = 0; col < this.square; col++) {
        this.grid[row][col] = null;
      }
    }
  }

  _createClass(Grid, [{
    key: 'mark',
    value: function mark(position, marker) {
      if (this.gameOver) {
        return false;
      }
      if (!this.withinGridBounds(position) || this.isAlreayMarked(position)) {
        return false;
      }
      this.grid[position.row][position.col] = marker;
      this.freeCell--;
      var game = this.gameWon(position);
      if (game.isGameOver) {
        this.gameOver = game.isGameOver;
        return game;
      }
      game.isGameOver = 0 === this.freeCell;
      this.gameOver = game.isGameOver;
      return game;
    }
  }, {
    key: 'withinGridBounds',
    value: function withinGridBounds(position) {
      return position.row >= 0 && position.row < this.square && position.col >= 0 && position.col < this.square;
    }
  }, {
    key: 'isAlreayMarked',
    value: function isAlreayMarked(position) {
      return this.grid[position.row][position.col];
    }
  }, {
    key: 'winReduce',
    value: function winReduce(position, mark, fns) {
      if (fns.extraCheck && fns.extraCheck(position)) {
        return false;
      }
      for (var i = 0, j = this.square - 1, cell; i < this.square; i++, j--) {
        cell = fns.cell(position, i, j);
        if (!cell || cell.symbol !== mark.symbol) {
          return false;
        }
      }
      return fns.returnValue;
    }
  }, {
    key: 'gameWon',
    value: function gameWon(position) {
      var _this = this;
      var currentMark = this.isAlreayMarked(position);
      var checks = [{
        cell: function hzw(position, i, j) {
          return _this.grid[position.row][i];
        },
        returnValue: Grid.constant.HZ_WIN
      }, {
        cell: function vtw(position, i, j) {
          return _this.grid[i][position.col];
        },
        returnValue: Grid.constant.VT_WIN
      }, {
        cell: function lhdw(position, i, j) {
          return _this.grid[i][i];
        },
        extraCheck: function extraCheck(position) {
          return position.row !== position.col;
        },

        returnValue: Grid.constant.LHD_WIN
      }, {
        cell: function rhdw(position, i, j) {
          return _this.grid[i][j];
        },
        extraCheck: function extraCheck(position) {
          return position.row !== _this.square - 1 - position.col;
        },

        returnValue: Grid.constant.RHD_WIN
      }];
      var win = checks.reduce(function winReduceFn(previousValue, currentObj) {
        if (previousValue) {
          return previousValue;
        }
        return _this.winReduce(position, currentMark, currentObj);
      }, false);
      if (win) {
        return { isGameWon: true, winType: win, isGameOver: true };
      }
      return { isGameWon: false, winType: '', isGameOver: false };
    }
  }]);

  return Grid;
})();

Grid.constant = {
  HZ_WIN: 'horizontal win',
  VT_WIN: 'vertical win',
  LHD_WIN: 'left hand-side diagonal win',
  RHD_WIN: 'right hand-side diagonal win'
};
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = (function () {
  function Player(name, marker) {
    var isBot = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    var score = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
    var colour = arguments.length <= 4 || arguments[4] === undefined ? 'red' : arguments[4];

    _classCallCheck(this, Player);

    this.name = name;
    this.marker = marker;
    this.score = score;
    this.colour = colour;
    this.isBot = isBot;
    this.canPlay = false;
  }

  _createClass(Player, [{
    key: 'addPoints',
    value: function addPoints(_point) {
      var point = Number(_point);
      if (point) {
        this.score += point;
      }
    }
  }, {
    key: 'setCanPlay',
    value: function setCanPlay(deffered) {
      var _this = this;
      this.canPlay = deffered;
      if (this.isBot) {
        setTimeout(function botMove() {
          _this.mark(Player.randomCell(), Player.randomCell());
        }, 200);
      }
      return this.canPlay.promise;
    }
  }, {
    key: 'mark',
    value: function mark(row, col) {
      if (this.canPlay) {
        this.canPlay.resolve({ row: row, col: col });
        this.canPlay = false;
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.canPlay = false;
    }
  }], [{
    key: 'randomCell',
    value: function randomCell() {
      var a = Math.floor(Math.random() * 100);
      var boundary = Math.floor(100 / 3);
      if (0 <= a && a < boundary) {
        return 0;
      }
      if (boundary <= a && a < 2 * boundary) {
        return 1;
      }
      return 2;
    }
  }]);

  return Player;
})();

Player.colourArray = ['red', 'yellow', 'green', 'blue', 'pink'];
'use strict';

var app = angular.module('tictactoe', []);
'use strict';

app.constant('GameConst', {
  NOUGHT: 'nought',
  CROSS: 'cross',
  NOUGHT_CLASS: 'symbol-nought',
  CROSS_CLASS: 'symbol-cross',
  WIN_POINT: 1,
  DRAW_POINT: 0.5,
  SINGLE_PLAYER: 'single-player',
  MULTI_PLAYER: 'multy-player'
});
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var ColourService = (function () {
    function ColourService() {
      _classCallCheck(this, ColourService);
    }

    _createClass(ColourService, [{
      key: 'getSymbolColour',
      value: function getSymbolColour(obj, players) {
        if (obj.player) {
          return 'symbol-' + obj.player.colour;
        }
        if (obj.marker) {
          var player = players[0].marker.symbol == obj.marker.symbol ? players[0] : players[1];
          return 'symbol-' + player.colour;
        }
        return '';
      }
    }]);

    return ColourService;
  })();

  app.service('ColourService', ColourService);
})();
'use strict';

app.factory('GamePlayService', function (GameConst, $q) {

  // Service variables

  var grid;
  var isPlayer1Turn;
  var player1Start;
  var gameOutcomeMsg = '';
  var previousSolo;

  var player1 = getNewPlayer('Player 1', false);
  var player2 = getNewPlayer('Player 2 (bot)', true, true);

  var gameMode = {
    mode: GameConst.SINGLE_PLAYER,
    sessionPlayer: player1,
    players: [player1, player2]
  };

  // Service functions
  function getGrid() {
    if (!grid) {
      newGame();
    }
    return grid;
  }
  function getPlayers() {
    return [player1, player2];
  }
  function newGame() {
    grid = new Grid();
    player1Start = typeof player1Start === 'undefined' ? true : !player1Start;
    isPlayer1Turn = player1Start;
    gameOutcomeMsg = '';
    getCurrentPlayerMove();
  }
  function changePlayer() {
    return isPlayer1Turn = !isPlayer1Turn;
  }
  function currentPlayer() {
    return isPlayer1Turn ? player1 : player2;
  }
  function isCurrentPlayer(player) {
    return player.marker === currentPlayer().marker;
  }
  function isGameOver() {
    return getGrid().gameOver;
  }
  function markHandler(row, col) {
    if (gameMode.mode === GameConst.SINGLE_PLAYER && currentPlayer() === gameMode.sessionPlayer) {
      currentPlayer().mark(row, col);
    } else if (gameMode.mode === GameConst.MULTI_PLAYER) {
      currentPlayer().mark(row, col);
    }
  }
  function getCurrentPlayerMove() {
    var playerDeferred = $q.defer();
    currentPlayer().setCanPlay(playerDeferred).then(function success(position) {
      mark(position);
    });
  }
  function mark(position) {
    var game = getGrid().mark(position, currentPlayer().marker);
    if (!game) {
      getCurrentPlayerMove();
      return;
    }
    //save game points
    if (game.isGameOver) {
      if (game.isGameWon) {
        currentPlayer().addPoints(GameConst.WIN_POINT);
        gameOutcomeMsg = currentPlayer().name + ' won this round!';
        return;
      }
      getPlayers().forEach(function (player) {
        player.addPoints(GameConst.DRAW_POINT);
      });
      gameOutcomeMsg = 'Draw!';
      return;
    }
    changePlayer();
    getCurrentPlayerMove();
  }
  function getGameOutcomeMsg() {
    return gameOutcomeMsg;
  }
  function switchPlayMode() {
    if (gameMode.mode === GameConst.SINGLE_PLAYER) {
      previousSolo = gameMode;
      player1 = getNewPlayer('Player 1', false);
      player2 = getNewPlayer('Player 2', true);
      newGame();
      gameMode = {
        mode: GameConst.MULTI_PLAYER
      };
      return GameConst.MULTI_PLAYER;
    }
    if (gameMode.mode === GameConst.MULTI_PLAYER) {
      gameMode = previousSolo;
      player1 = gameMode.players[0];
      player2 = gameMode.players[1];
      newGame();
      return GameConst.SINGLE_PLAYER;
    }
  }
  function getNewPlayer(name, isCross, isBot) {
    if (isCross) {
      return new Player(name, {
        symbol: GameConst.CROSS,
        _class: GameConst.CROSS_CLASS
      }, isBot);
    }
    return new Player(name, {
      symbol: GameConst.NOUGHT,
      _class: GameConst.NOUGHT_CLASS
    }, isBot);
  }

  // returned API
  return {
    getGrid: getGrid,
    getPlayers: getPlayers,
    getGameOutcomeMsg: getGameOutcomeMsg,
    isCurrentPlayer: isCurrentPlayer,
    newGame: newGame,
    isGameOver: isGameOver,
    markHandler: markHandler,
    switchPlayMode: switchPlayMode
  };
});
'use strict';

app.controller('mainCtrl', function ($scope, $q, GameConst, GamePlayService, ColourService) {
  $scope.players = GamePlayService.getPlayers();
  $scope.config = { colour: 'colour', symbol: 'marker', score: 'score' };
  $scope.isCurrentPlayer = GamePlayService.isCurrentPlayer;
  $scope.colours = Player.colourArray;
  $scope.getSymbolColour = function (obj) {
    return ColourService.getSymbolColour(obj, GamePlayService.getPlayers());
  };
  $scope.mark = GamePlayService.markHandler;
  $scope.switchText = 'switch to multiplayer';
  $scope.replay = init;
  $scope.switchPlayMode = switchPlayMode;
  init();

  function init() {
    GamePlayService.newGame();
    $scope.grid = GamePlayService.getGrid();
    $scope.isGameOver = GamePlayService.isGameOver();
  }
  function switchPlayMode() {
    var playMode = GamePlayService.switchPlayMode();
    $scope.switchText = playMode === GameConst.MULTI_PLAYER ? 'switch to soloplay' : 'switch to multiplayer';
    $scope.players = GamePlayService.getPlayers();
    $scope.grid = GamePlayService.getGrid();
    $scope.isGameOver = GamePlayService.isGameOver();
  }

  $scope.$watch(function () {
    return GamePlayService.isGameOver();
  }, function (newVal) {
    $scope.isGameOver = newVal;
    $scope.msg = GamePlayService.getGameOutcomeMsg();
  });
});
//# sourceMappingURL=main.js.map
