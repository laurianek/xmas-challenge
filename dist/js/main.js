'use strict';

var app = angular.module('tictactoe', []);

app.constant('GameConst', {
  NOUGHT: 'nought',
  CROSS: 'cross',
  NOUGHT_CLASS: 'symbol-nought',
  CROSS_CLASS: 'symbol-cross'
});

app.controller('mainCtrl', function ($scope, GameConst) {
  var grid = new Grid();
  var player1 = new Player('Player 1', {
    symbol: GameConst.NOUGHT,
    _class: GameConst.NOUGHT_CLASS
  });
  var player2 = new Player('Player 2', {
    symbol: GameConst.CROSS,
    _class: GameConst.CROSS_CLASS
  });
  var isPlayer1Turn = true;
  $scope.grid = grid;
  $scope.players = [player1, player2];
  $scope.config = {
    colour: 'colour',
    symbol: 'marker',
    score: 'score'
  };
  $scope.isCurrentPlayer = isCurrentPlayer;
  $scope.mark = mark;

  /*
  var playerTurn = player1;
  grid onclick(function() {
    mark grid;
    check if won (only check for the last game move, be lazy)
    if won then give score and end game;
    else next player turn;
  })
  // */

  function mark(row, col) {
    var success = grid.mark({ row: row, col: col }, currentPlayer().marker);
    if (!success) {
      //notify the user that marking failed
      return;
    }
    console.log(success);
    //check if won (only check for the last game move, be lazy)
    changePlayer();
  }
  function currentPlayer() {
    return isPlayer1Turn ? player1 : player2;
  }
  function changePlayer() {
    return isPlayer1Turn = !isPlayer1Turn;
  }
  function isCurrentPlayer(player) {
    return player.marker === currentPlayer().marker;
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
      var game = this.gameWon(position);
      this.gameOver = game.isGameWon;
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
    key: 'winReduceFn',
    value: function winReduceFn(position, mark, fns) {
      if (fns.extraCheck && fns.extraCheck(position)) {
        return false;
      }
      for (var i = 0, j = this.square - 1, cell; i < this.square; i++, j--) {
        cell = fns.cell(position, i, j);
        console.log('cell', cell);
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
        returnValue: Grid.enum().LHD_WIN
      }, {
        cell: function rhdw(position, i, j) {
          return _this.grid[i][j];
        },
        returnValue: Grid.enum().RHD_WIN
      }];
      var win = checks.reduce(function (previousValue, currentObj) {
        if (previousValue) {
          return previousValue;
        }
        return _this.winReduceFn(position, currentMark, currentObj);
      }, false);
      console.log(win);
      if (win) {
        return { isGameWon: true, winType: win };
      }
      return { isGameWon: false, winType: '' };
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
    var score = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

    _classCallCheck(this, Player);

    this.name = name;
    this.marker = marker;
    this.score = score;
  }

  _createClass(Player, [{
    key: 'addPoints',
    value: function addPoints(_point) {
      var point = Number(_point);
      if (point) {
        this.score += point;
      }
    }
  }]);

  return Player;
})();
//# sourceMappingURL=main.js.map
