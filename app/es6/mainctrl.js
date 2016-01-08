'use strict';

app.controller('mainCtrl', function ($scope, $q, GameConst, GamePlayService, ColourService, $rootScope) {
  var isMultiPlay = false;
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
    return !isMultiPlay && !$rootScope.hasChallenged && !$scope.challenger && !$rootScope.newSocketGameStarted;
  };
  $scope.showIsChallenged = function() {
    return !isMultiPlay && GamePlayService.hasBeenChallenged();
  };
  $scope.showHasChallenged = function() {
    return !isMultiPlay && $rootScope.hasChallenged;
  };
  $scope.showNewGame = function() {
    return !isMultiPlay && $rootScope.newSocketGameStarted;
  };
  $scope.rejectChallenge = function() {
    GamePlayService.rejectChallenge();
    $scope.challenger = GamePlayService.getChallenger();
  };
  $scope.acceptChallenge = function() {
    GamePlayService.acceptChallenge();
  };
  $scope.updatePlayerColour = GamePlayService.updatePlayerColour;

  init();

  function init() {
    if(GamePlayService.getCurrentPlayMode() == GameConst.SOCKET_PLAYER) {
      GamePlayService.replay();
      $scope.requestedReplay = true;
      return;
    }
    GamePlayService.newGame();
    $scope.grid = GamePlayService.getGrid();
    $scope.isGameOver = GamePlayService.isGameOver();
  }

  function switchPlayMode() {
    GamePlayService.switchPlayMode();
    isMultiPlay = GamePlayService.getCurrentPlayMode() == GameConst.MULTI_PLAYER;
    $scope.switchText = isMultiPlay ? 'switch to soloplay' : 'switch to multiplayer';
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

  $scope.$watch('newSocketGameStarted', function(newVal) {
    if(newVal) {
      isMultiPlay = GamePlayService.getCurrentPlayMode() == GameConst.MULTI_PLAYER;
      $scope.players = GamePlayService.getPlayers();
      $scope.grid = GamePlayService.getGrid();
      $scope.isGameOver = GamePlayService.isGameOver();
      $scope.requestedReplay = false;
    }
  });

  $scope.$watch('playerUpdated', function(newVal) {
    if (newVal) {
      $scope.players = GamePlayService.getPlayers();
    }
  });
});