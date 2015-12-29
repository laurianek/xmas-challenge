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
      this.gameOver = this.gameWon(position).isGameWon;
      return true;
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
    key: 'gameWon',
    value: function gameWon(position) {
      var currentMark = this.isAlreayMarked(position);
      var lWin = this.linearWin(position, currentMark);
      var dWin = this.diagonalWin(position, currentMark);
      console.log(lWin, dWin);
      if (lWin || dWin) {
        return {
          isGameWon: true,
          winType: dWin ? dWin : lWin
        };
      }
      return {
        isGameWon: false,
        winType: ''
      };
    }
  }, {
    key: 'linearWin',
    value: function linearWin(position, mark) {
      var colWin = true;
      var rowWin = true;
      var cell1, cell2;
      for (var i = 0; i < this.square; i++) {
        cell1 = this.grid[position.row][i];
        cell2 = this.grid[i][position.col];
        if (!cell1 || cell1.symbol !== mark.symbol) {
          rowWin = false;
        }
        if (!cell2 || cell2.symbol !== mark.symbol) {
          colWin = false;
        }
      }
      if (colWin) {
        return Grid.enum().VT_WIN;
      }
      if (rowWin) {
        return Grid.enum().HZ_WIN;
      }
      return false;
    }
  }, {
    key: 'diagonalWin',
    value: function diagonalWin(position, mark) {
      if (position.row != position.col) {
        return false;
      }
      var lhdWin = true;
      var rhdWin = true;
      var cell1, cell2;
      for (var i = 0, j = this.square; i < this.square; i++, j--) {
        cell1 = this.grid[i][i];
        cell2 = this.grid[i][j];
        if (!cell1 || cell1.symbol !== mark.symbol) {
          lhdWin = false;
        }
        if (!cell2 || cell2.symbol !== mark.symbol) {
          rhdWin = false;
        }
      }
      if (lhdWin) {
        return Grid.enum().LHD_WIN;
      }
      if (rhdWin) {
        return Grid.enum().RHD_WIN;
      }
      return false;
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
