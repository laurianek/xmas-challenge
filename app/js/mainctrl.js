'use strict';

app.controller('mainCtrl', function($scope, $q, GameConst) {
  var player1 = new Player('Player 1', {
    symbol: GameConst.NOUGHT,
    _class: GameConst.NOUGHT_CLASS
  });
  var player2 = new Player('Player 2 (bot)', {
    symbol: GameConst.CROSS,
    _class: GameConst.CROSS_CLASS
  }, true);
  var isPlayer1Turn = true;

  $scope.players = [player1, player2];
  $scope.config = {colour: 'colour', symbol: 'marker', score: 'score'};
  $scope.isCurrentPlayer = isCurrentPlayer;
  $scope.mark = function(row, col){ currentPlayer().mark(row, col); };
  $scope.replay = init;
  init();

  function mark(position) {
    var success = $scope.grid.mark(position, currentPlayer().marker);
    if(!success) {
      getUserMove();
      return;
    }
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
    getUserMove();
  }
  function currentPlayer() {
    return isPlayer1Turn? player1 : player2;
  }
  function changePlayer() {
    return isPlayer1Turn = !isPlayer1Turn;
  }
  function getUserMove() {
    console.log('get user move', currentPlayer());
    var deffered = $q.defer();
    var promise = currentPlayer().play(deffered);
    promise.then(function success(value) {
      console.log('got user move');
      mark(value);
    }, function failure(reason) {}, function notify() {})
  }
  function isCurrentPlayer(player) {
    return player.marker === currentPlayer().marker;
  }
  function init() {
    $scope.grid = new Grid();
    $scope.isGameOver = false;
    $scope.gameMode = GameConst.SINGLE_PLAYER;
    getUserMove();
  }

  // *** colours
  $scope.getSymbolColour = getSymbolColour;
  $scope.colours = Player.colourArray;
  function getSymbolColour(obj) {
    if(obj.player) {
      return `symbol-${obj.player.colour}`;
    }
    if(obj.marker) {
      let player = player1.marker.symbol == obj.marker.symbol ? player1 : player2;
      console.log(`symbol-${player.colour}`);
      return `symbol-${player.colour}`;
    }
    return '';
  }
});