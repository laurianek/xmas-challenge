'use strict';

var app = angular.module('tictactoe', []);

app.constant('GameConst', {
  NOUGHT: 'nought',
  CROSS: 'cross',
  NOUGHT_CLASS: 'symbol-nought',
  CROSS_CLASS: 'symbol-cross',
  WIN_POINT: 1,
  DRAW_POINT: 0.5
});

app.controller('mainCtrl', function($scope, GameConst) {
  var player1 = new Player('Player 1', {
    symbol: GameConst.NOUGHT,
    _class: GameConst.NOUGHT_CLASS
  });
  var player2 = new Player('Player 2', {
    symbol: GameConst.CROSS,
    _class: GameConst.CROSS_CLASS
  });
  var isPlayer1Turn = true;
  $scope.players = [player1, player2];
  $scope.config = {
    colour: 'colour',
    symbol: 'marker',
    score: 'score'
  };
  $scope.colours = Player.colourArray();
  $scope.isCurrentPlayer = isCurrentPlayer;
  $scope.mark = mark;
  $scope.replay = init;
  init();

  function mark(row, col) {
    var success = $scope.grid.mark({row: row, col: col}, currentPlayer().marker);
    if(!success) {
      //maybe notify the user that marking failed
      return;
    }
    console.log(success);
    if (success.isGameOver) {
      $scope.isGameOver = true;
      if (success.isGameWon) {
        currentPlayer().addPoints(GameConst.WIN_POINT);
        $scope.msg = `${currentPlayer().name} won this round!`;
      } else {
        $scope.players.forEach(function(player) {
          player.addPoints(GameConst.DRAW_POINT);
        });
        $scope.msg = 'Draw!';
      }
      //save game points
      return;
    }
    changePlayer();
  }
  function currentPlayer() {
    return isPlayer1Turn? player1 : player2;
  }
  function changePlayer() {
    return isPlayer1Turn = !isPlayer1Turn;
  }
  function isCurrentPlayer(player) {
    return player.marker === currentPlayer().marker;
  }
  function init() {
    $scope.grid = new Grid();
    $scope.isGameOver = false;
  }
});