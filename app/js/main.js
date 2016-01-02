'use strict';

var app = angular.module('tictactoe', []);
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

app.factory('GamePlayService', function (GameConst, $q) {

  // *** Service variables ***
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

  // *** Service functions ***
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
  function getCurrentPlayMode() {
    return gameMode.mode;
  }

  // *** returned API ***
  return {
    getGrid: getGrid,
    getPlayers: getPlayers,
    getGameOutcomeMsg: getGameOutcomeMsg,
    isCurrentPlayer: isCurrentPlayer,
    newGame: newGame,
    isGameOver: isGameOver,
    markHandler: markHandler,
    switchPlayMode: switchPlayMode,
    getCurrentPlayMode: getCurrentPlayMode
  };
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
      if (!this._withinGridBounds(position) || this._isAlreayMarked(position)) {
        return false;
      }
      this.grid[position.row][position.col] = marker;
      this.freeCell--;
      var game = this._gameWon(position);
      if (game.isGameOver) {
        this.gameOver = game.isGameOver;
        return game;
      }
      game.isGameOver = 0 === this.freeCell;
      this.gameOver = game.isGameOver;
      return game;
    }
  }, {
    key: '_withinGridBounds',
    value: function _withinGridBounds(position) {
      return position.row >= 0 && position.row < this.square && position.col >= 0 && position.col < this.square;
    }
  }, {
    key: '_isAlreayMarked',
    value: function _isAlreayMarked(position) {
      return this.grid[position.row][position.col];
    }
  }, {
    key: '_winReduce',
    value: function _winReduce(position, mark, fns) {
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
    key: '_gameWon',
    value: function _gameWon(position) {
      var _this = this;
      var currentMark = this._isAlreayMarked(position);
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
        return _this._winReduce(position, currentMark, currentObj);
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
    GamePlayService.switchPlayMode();
    $scope.switchText = GamePlayService.getCurrentPlayMode() == GameConst.MULTI_PLAYER ? 'switch to soloplay' : 'switch to multiplayer';
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
          _this.mark(Player.getRandomCell(), Player.getRandomCell());
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
    key: 'getRandomCell',
    value: function getRandomCell() {
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
//# sourceMappingURL=main.js.map
