'use strict';

app.factory('GamePlayService', function (GameConst, $q, SocketService) {

  // *** Service variables ***
  var grid;
  var isPlayer1Turn;
  var player1Start;
  var gameOutcomeMsg = '';
  var previousSolo;

  var player1 = getNewPlayer('Player 1', false);
  var player2 = getNewPlayer('Player 2 (bot)', true, true);
  SocketService.emit('register player', player1);
  SocketService.on('online player list', receivedPlayers);

  var gameMode = {
    mode: GameConst.SINGLE_PLAYER,
    sessionPlayer: player1,
    players: [player1, player2],
    onlinePlayers: []
  };

  // *** Service functions ***
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
    var playerDeferred = $q.defer();
    currentPlayer().setCanPlay(playerDeferred).then(function success(position) {
      mark(position);
    });
  }
  function mark(position) {
    var game = getGrid().mark(position, currentPlayer().marker);
    if(!game) {
      getCurrentPlayerMove();
      return;
    }
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
  function switchPlayMode() {
    if (gameMode.mode === GameConst.SINGLE_PLAYER) {
      previousSolo = gameMode;
      player1 = getNewPlayer('Player 1', false);
      player2 = getNewPlayer('Player 2', true);
      newGame();
      gameMode = {
        mode: GameConst.MULTI_PLAYER
      };
      return GameConst.MULTI_PLAYER;
    }
    if (gameMode.mode === GameConst.MULTI_PLAYER) {
      gameMode = previousSolo;
      player1 = gameMode.players[0];
      player2 = gameMode.players[1];
      newGame();
      return GameConst.SINGLE_PLAYER;
    }
  }
  function getNewPlayer(name, isCross, isBot) {
    if (isCross) {
      return new Player(name, {
        symbol: GameConst.CROSS,
        _class: GameConst.CROSS_CLASS
      }, isBot);
    }
    return new Player(name, {
      symbol: GameConst.NOUGHT,
      _class: GameConst.NOUGHT_CLASS
    }, isBot);
  }
  function getCurrentPlayMode() {
    return gameMode.mode;
  }
  function playerNameChanged(player) {
    if(!player) {
      return;
    }
    if (gameMode.mode === GameConst.SINGLE_PLAYER && player === gameMode.sessionPlayer) {
      SocketService.emit('register player', player1);
    }
    player.editName = false;
  }
  function receivedPlayers(data) {
    console.log(data);
    gameMode.onlinePlayers = data;
  }
  function getOnlinePlayers() {
    if (gameMode.mode !== GameConst.SINGLE_PLAYER) {
      return false;
    }
    return gameMode.onlinePlayers;
  }

  // *** returned API ***
  return {
    getGrid: getGrid,
    getPlayers: getPlayers,
    getGameOutcomeMsg: getGameOutcomeMsg,
    isCurrentPlayer: isCurrentPlayer,
    newGame: newGame,
    isGameOver: isGameOver,
    markHandler: markHandler,
    switchPlayMode: switchPlayMode,
    getCurrentPlayMode: getCurrentPlayMode,
    playerNameChanged: playerNameChanged,
    getOnlinePlayers: getOnlinePlayers
  };
});
