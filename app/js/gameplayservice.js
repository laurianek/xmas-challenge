'use strict';

app.factory('GamePlayService', function (GameConst, $q) {

  // Service variables

  var grid;
  var isPlayer1Turn;
  var player1Start;
  var gameOutcomeMsg = '';

  var player1 = new Player('Player 1', {
    symbol: GameConst.NOUGHT,
    _class: GameConst.NOUGHT_CLASS
  });

  var player2 = new Player('Player 2 (bot)', {
    symbol: GameConst.CROSS,
    _class: GameConst.CROSS_CLASS
  }, true);

  var gameMode = {
    mode: GameConst.SINGLE_PLAYER,
    sessionPlayer: player1
  };

  // Service functions
  function getGrid() {
    if (!grid) { newGame(); }
    return grid;
  }
  function getPlayers() {
    return [player1, player2];
  }
  function newGame() {
    grid = new Grid();
    player1Start = typeof(player1Start) === 'undefined' ? true : !player1Start;
    isPlayer1Turn = player1Start;
    gameOutcomeMsg = '';
    getCurrentPlayerMove()
  }
  function changePlayer() {
    return isPlayer1Turn = !isPlayer1Turn;
  }
  function currentPlayer() {
    return isPlayer1Turn? player1 : player2;
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
    }
    else if (gameMode.mode === GameConst.MULTI_PLAYER) {
      currentPlayer().mark(row, col);
    }
  }
  function getCurrentPlayerMove() {
    console.log('get user move', currentPlayer());
    var playerDeferred = $q.defer();
    currentPlayer().play(playerDeferred).then(function success(position) {
      console.log('got user move');
      mark(position);
    });
  }
  function mark(position) {
    var game = getGrid().mark(position, currentPlayer().marker);
    if(!game) {
      getCurrentPlayerMove();
      return;
    }
    //save game points
    if (game.isGameOver) {
      if (game.isGameWon) {
        currentPlayer().addPoints(GameConst.WIN_POINT);
        gameOutcomeMsg = `${currentPlayer().name} won this round!`;
        return;
      }
      getPlayers().forEach(function(player) {
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

  // returned API
  return {
    getGrid: getGrid,
    getPlayers: getPlayers,
    getGameOutcomeMsg: getGameOutcomeMsg,
    isCurrentPlayer: isCurrentPlayer,
    newGame: newGame,
    isGameOver: isGameOver,
    markHandler: markHandler
  };
});
