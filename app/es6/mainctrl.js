'use strict';

app.controller('mainCtrl', function ($scope, $q, GameConst, GamePlayService, ColourService, $rootScope) {
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
  $scope.toggleModal = function(){
    $scope.isModalShown = !$scope.isModalShown;
    if ($scope.isModalShown) {
      $scope.onlinePlayers = GamePlayService.getOnlinePlayers();
    }
  };
  $scope.challengePlayer = function(player) {
    console.log(`just challenged ${player.name}!`);
    GamePlayService.challengePlayer(player);
    $rootScope.hasChallenged = player;
    $scope.toggleModal();
  };
  $scope.showInfo = function() {
    return !$rootScope.hasChallenged && !$scope.challenger;
  };
  $scope.showIsChallenged = function() {
    return GamePlayService.hasBeenChallenged();
  };
  $scope.showHasChallenged = function() {
    return $rootScope.hasChallenged;
  };
  $scope.rejectChallenge = function() {
    GamePlayService.rejectChallenge();
    $scope.challenger = GamePlayService.getChallenger();
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

  $scope.$watch(function () {
    return GamePlayService.hasBeenChallenged();
  }, function(newVal) {
    if(!newVal) {
      return;
    }
    $scope.challenger = GamePlayService.getChallenger();
  });
});