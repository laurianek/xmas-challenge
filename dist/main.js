'use strict';

var app = angular.module('tictactoe', []);

app.controller('mainCtrl', function ($scope) {
  $scope.grid = new Grid();
  $scope.player1 = new Player('Player 1');

  console.log($scope.grid, $scope.player1);
});
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grid = (function () {
  function Grid() {
    var row = arguments.length <= 0 || arguments[0] === undefined ? 3 : arguments[0];
    var col = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

    _classCallCheck(this, Grid);

    this.row = row;
    this.col = col;
    this.grid = [];
    for (var y = 0; y < this.col; y++) {
      this.grid[y] = [];
      for (var x = 0; x < this.row; x++) {
        this.grid[y][x] = null;
      }
    }
  }

  _createClass(Grid, [{
    key: 'mark',
    value: function mark(position, marker) {
      if (!this.withinGridBounds(position)) {
        return false;
      }
      this.grid[position.y][position.x] = marker;
      return true;
    }
  }, {
    key: 'withinGridBounds',
    value: function withinGridBounds(position) {
      return position.x >= 0 && position.x < this.row && position.y >= 0 && position.y < this.col;
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
