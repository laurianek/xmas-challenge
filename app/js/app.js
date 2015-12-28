'use strict';

var app = angular.module('tictactoe', []);

app.controller('mainCtrl', function($scope) {
  $scope.grid = new Grid();
  $scope.player1 = new Player('Player 1');

  console.log($scope.grid, $scope.player1);
});