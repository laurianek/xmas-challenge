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

  function mark(row, col) {
    var success = grid.mark({row: row, col: col}, currentPlayer().marker);
    if(!success) {
      //maybe notify the user that marking failed
      return;
    }
    console.log(success);
    if (success.isGameWon) {
      currentPlayer().addPoints(GameConst.WIN_POINT);
      //display message current player win and ask for replay
      //save game points
      return;
    }
    if (success.isGameOver) {
      $scope.players.forEach(function(player) {
        player.addPoints(GameConst.DRAW_POINT);
      });
      //display message draw and ask for replay
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
});