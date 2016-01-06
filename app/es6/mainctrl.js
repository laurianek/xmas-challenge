'use strict';

app.controller('mainCtrl', function ($scope, $q, GameConst, GamePlayService, ColourService) {
  $scope.players = GamePlayService.getPlayers();
  $scope.config = {colour: 'colour', symbol: 'marker', score: 'score'};
  $scope.isCurrentPlayer = GamePlayService.isCurrentPlayer;
  $scope.colours = Player.colourArray;
  $scope.getSymbolColour = function (obj) {
    return ColourService.getSymbolColour(obj, GamePlayService.getPlayers());
  };
  $scope.mark = GamePlayService.markHandler;
  $scope.switchText = 'switch to multiplayer';
  $scope.replay = init;
  $scope.switchPlayMode = switchPlayMode;
  $scope.isModalShown = false;
  $scope.getOnlinePlayers = function(){}; //GamePlayService.geOnlinePlayers();
  $scope.toggleModal = function(){
    $scope.isModalShown = !$scope.isModalShown;
  };

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