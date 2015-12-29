'use strict';

var app = angular.module('tictactoe', []);

app.constant('GameConst', {
  NOUGHT: 'nought',
  CROSS: 'cross',
  NOUGHT_CLASS: 'symbol-nought',
  CROSS_CLASS: 'symbol-cross'
});

app.controller('mainCtrl', function($scope, GameConst) {
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