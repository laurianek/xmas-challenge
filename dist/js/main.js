'use strict';

var app = angular.module('tictactoe', []);

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

app.controller('mainCtrl', function ($scope, $q, GameConst) {
  var player1 = new Player('Player 1', {
    symbol: GameConst.NOUGHT,
    _class: GameConst.NOUGHT_CLASS
  });
  var player2 = new Player('Player 2 (bot)', {
    symbol: GameConst.CROSS,
    _class: GameConst.CROSS_CLASS
  }, true);
  var isPlayer1Turn = true;
  $scope.players = [player1, player2];
  $scope.config = { colour: 'colour', symbol: 'marker', score: 'score' };
  $scope.colours = Player.colourArray();
  $scope.isCurrentPlayer = isCurrentPlayer;
  $scope.mark = function (row, col) {
    currentPlayer().mark(row, col);
  };
  $scope.replay = init;
  $scope.getSymbolColour = getSymbolColour;
  init();

  function mark(position) {
    var success = $scope.grid.mark(position, currentPlayer().marker);
    if (!success) {
      getUserMove();
      return;
    }
    if (success.isGameOver) {
      $scope.isGameOver = true;
      if (success.isGameWon) {
        currentPlayer().addPoints(GameConst.WIN_POINT);
        $scope.msg = currentPlayer().name + ' won this round!';
      } else {
        $scope.players.forEach(function (player) {
          player.addPoints(GameConst.DRAW_POINT);
        });
        $scope.msg = 'Draw!';
      }
      //save game points
      return;
    }
    changePlayer();
    getUserMove();
  }
  function currentPlayer() {
    return isPlayer1Turn ? player1 : player2;
  }
  function changePlayer() {
    return isPlayer1Turn = !isPlayer1Turn;
  }
  function getUserMove() {
    console.log('get user move', currentPlayer());
    var deffered = $q.defer();
    var promise = currentPlayer().play(deffered);
    promise.then(function success(value) {
      console.log('got user move');
      mark(value);
    }, function failure(reason) {}, function notify() {});
  }
  function isCurrentPlayer(player) {
    return player.marker === currentPlayer().marker;
  }
  function init() {
    $scope.grid = new Grid();
    $scope.isGameOver = false;
    $scope.gameMode = GameConst.SINGLE_PLAYER;
    getUserMove();
  }
  function getSymbolColour(obj) {
    if (obj.player) {
      return 'symbol-' + obj.player.colour;
    }
    if (obj.marker) {
      var player = player1.marker.symbol == obj.marker.symbol ? player1 : player2;
      console.log('symbol-' + player.colour);
      return 'symbol-' + player.colour;
    }
    return '';
  }
});
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
        returnValue: Grid.enum().HZ_WIN
      }, {
        cell: function vtw(position, i, j) {
          return _this.grid[i][position.col];
        },
        returnValue: Grid.enum().VT_WIN
      }, {
        cell: function lhdw(position, i, j) {
          return _this.grid[i][i];
        },
        extraCheck: function extraCheck(position) {
          return position.row !== position.col;
        },

        returnValue: Grid.enum().LHD_WIN
      }, {
        cell: function rhdw(position, i, j) {
          return _this.grid[i][j];
        },
        extraCheck: function extraCheck(position) {
          return position.row !== _this.square - 1 - position.col;
        },

        returnValue: Grid.enum().RHD_WIN
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
  }], [{
    key: 'enum',
    value: function _enum() {
      return {
        HZ_WIN: 'horizontal win',
        VT_WIN: 'vertical win',
        LHD_WIN: 'left hand-side diagonal win',
        RHD_WIN: 'right hand-side diagonal win'
      };
    }
  }]);

  return Grid;
})();
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
    key: 'play',
    value: function play(deffered) {
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
    key: 'colourArray',
    value: function colourArray() {
      return ['red', 'yellow', 'green', 'blue', 'pink'];
    }
  }, {
    key: 'randomCell',
    value: function randomCell() {
      var a = Math.floor(Math.random() * 100);
      var boundary = Math.floor(100 / 3);
      console.log('a', a, 'boundary', boundary);
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
//# sourceMappingURL=main.js.map
