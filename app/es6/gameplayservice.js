'use strict';

app.factory('GamePlayService', function (GameConst, $q, SocketService, $rootScope, MakerConst) {

  // *** Service variables ***
  var grid;
  var isPlayer1Turn;
  var player1Start;
  var gameOutcomeMsg = '';
  var previousSolo;
  var challenge;
  var startedNewGame;

  var player1 = getNewPlayer('Player 1', false);
  var player2 = getNewPlayer('Player 2 (bot)', true, true);
  SocketService.emit('register player', player1);
  SocketService.onReceivePlayers(receivedPlayers);
  SocketService.on('challenged', challenged);
  SocketService.on('challenge rejected', rejectedChallenge);
  SocketService.onChallengeAccepted(startNewMultiBrowserGame);

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
      return new Player(name, MakerConst.CROSS_MARKER, isBot);
    }
    return new Player(name, MakerConst.NOUGHT_MARKER, isBot);
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
  function challengePlayer(player) {
    SocketService.emit('challenge', {from: gameMode.sessionPlayer, to: player});
  }
  function challenged(data) {
    console.log(data);
    if (challenge) {
      rejectChallenge()
    }
    challenge = data;
    $rootScope.$apply();
  }
  function hasBeenChallenged() {
    return challenge;
  }
  function getChallenger() {
    return challenge;
  }
  function rejectedChallenge(data) {
    console.log(data);
    $rootScope.hasChallenged = false;
    $rootScope.$apply();
  }
  function rejectChallenge() {
    console.log('rejected challenge');
    SocketService.emit('reject challenge', challenge);
    challenge = null;
  }
  function acceptChallenge() {
    SocketService.emit('accept challenge', challenge);
  }
  function startNewMultiBrowserGame(data, isPlayer1Start) {
    console.log('started new socket game', gameMode);
    if (gameMode.mode === GameConst.SINGLE_PLAYER) {
      console.log('configs...');
      previousSolo = gameMode;
      resetPlayer1(data);
      preparePlayer2(data);
      player1Start = !isPlayer1Start;
      newSocketGame();
      gameMode = {
        mode: GameConst.SOCKET_PLAYER
      };
      return GameConst.SOCKET_PLAYER;
    }
  }
  function resetPlayer1(data) {
    var _player1 = data.to.isCurrentPlayer ? data.to : data.from;
    player1.score = 0;
    player1.marker = _player1.marker;
    player1.reset();
  }
  function preparePlayer2(data) {
    var _player2 = data.to.isCurrentPlayer == false? data.to : data.from;
    player2 = new Player(_player2.name, _player2.marker, false, 0, _player2.colour);
    player2.canEditName = false;
  }
  function newSocketGame() {
    newGame();
    $rootScope.newSocketGameStarted = true;
    $rootScope.hasChallenged = false;
    challenge = null;
    $rootScope.$apply();
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
    getOnlinePlayers: getOnlinePlayers,
    challengePlayer: challengePlayer,
    hasBeenChallenged: hasBeenChallenged,
    getChallenger: getChallenger,
    rejectChallenge: rejectChallenge,
    acceptChallenge: acceptChallenge
  };
});
