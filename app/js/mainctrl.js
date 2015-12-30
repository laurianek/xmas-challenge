'use strict';

app.controller('mainCtrl', function($scope, $q, GameConst, GamePlayService, ColourService) {
  $scope.players = GamePlayService.getPlayers();
  $scope.config = {colour: 'colour', symbol: 'marker', score: 'score'};
  $scope.isCurrentPlayer = GamePlayService.isCurrentPlayer;
  $scope.colours = Player.colourArray;
  $scope.getSymbolColour = function(obj) { return ColourService.getSymbolColour(obj, GamePlayService.getPlayers());};
  $scope.mark = GamePlayService.markHandler;
  $scope.replay = init;
  init();

  function init() {
    GamePlayService.newGame();
    $scope.grid = GamePlayService.getGrid();
    $scope.isGameOver = GamePlayService.isGameOver();
  }

  $scope.$watch(function() {
    return GamePlayService.isGameOver();
  }, function(newVal) {
    $scope.isGameOver = newVal;
    $scope.msg = GamePlayService.getGameOutcomeMsg();
  });
});