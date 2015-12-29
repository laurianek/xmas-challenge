'use strict';

var app = angular.module('tictactoe', []);

app.constant('GameConst', {
  NOUGHT: 'nought',
  CROSS: 'cross',
  NOUGHT_CLASS: 'symbol-nought',
  CROSS_CLASS: 'symbol-cross'
});

app.controller('mainCtrl', function ($scope, GameConst) {
  $scope.grid = new Grid();
  $scope.player1 = new Player('Player 1', {
    symbol: GameConst.NOUGHT,
    _class: GameConst.NOUGHT_CLASS
  });
  $scope.player2 = new Player('Player 2', {
    symbol: GameConst.CROSS,
    _class: GameConst.CROSS_CLASS
  });

  $scope.config = {
    colour: 'colour',
    symbol: 'marker'
  };

  /*
  var playerTurn = player1;
  grid onclick(function() {
    mark grid;
    check if won (only check for the last game move, be lazy)
    if won then give score and end game;
    else next player turn;
  })
  // */

  console.log($scope.grid, $scope.player1);
});
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grid = (function () {
  function Grid() {
    var _row = arguments.length <= 0 || arguments[0] === undefined ? 3 : arguments[0];

    var _col = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

    _classCallCheck(this, Grid);

    this.row = _row;
    this.col = _col;
    this.grid = [];
    for (var row = 0; row < this.col; row++) {
      this.grid[row] = [];
      for (var col = 0; col < this.row; col++) {
        this.grid[row][col] = null;
      }
    }
  }

  _createClass(Grid, [{
    key: 'mark',
    value: function mark(position, marker) {
      if (!this.withinGridBounds(position)) {
        return false;
      }
      this.grid[position.row][position.col] = marker;
      return true;
    }
  }, {
    key: 'withinGridBounds',
    value: function withinGridBounds(position) {
      return position.row >= 0 && position.row < this.row && position.col >= 0 && position.col < this.col;
    }
  }, {
    key: 'draw',
    value: function draw() {}
  }]);

  return Grid;
})();
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function Player(name, marker) {
  _classCallCheck(this, Player);

  this.name = name;
  this.marker = marker;
};
//# sourceMappingURL=main.js.map
