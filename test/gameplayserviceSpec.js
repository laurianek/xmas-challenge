
describe("The GamePlayService", function() {
  beforeEach(module('tictactoe'));
  var GamePlayService,
    GameConst,
    $q,
    $rootScope;


  beforeEach(inject(function(_GamePlayService_, _GameConst_, _$q_, _$rootScope_){
    GamePlayService = _GamePlayService_;
    GameConst = _GameConst_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  it('should return the gameplay grid', function() {
    var grid = GamePlayService.getGrid();
    expect(grid).toBeTruthy();
    expect(grid instanceof Grid).toBe(true);
  });

  it('should return the players and there should be only 2', function() {
    var players = GamePlayService.getPlayers();
    expect(players.length).toEqual(2);
    expect(players[0]).toBeTruthy();
    expect(players[1]).toBeTruthy();
    expect(players[0] instanceof Player).toBe(true);
    expect(players[1] instanceof Player).toBe(true);
  });

  it('should be able to initiate a new game', function() {
    GamePlayService.newGame();
    var players = GamePlayService.getPlayers();
    expect(players.length).toEqual(2);
    expect(players[0]).toBeTruthy();
    expect(players[1]).toBeTruthy();
    var grid = GamePlayService.getGrid();
    expect(grid).toBeTruthy();
  });

  describe('at very 1st game,', function () {
    it('should be player 1 opening the game', function() {
      GamePlayService.newGame();
      var players = GamePlayService.getPlayers();
      expect(players[0]).toBeTruthy();
      expect(GamePlayService.isCurrentPlayer(players[0])).toBe(true);
    });
  });

  it('should be able to switch play mode between multi and solo play', function() {
    GamePlayService.newGame();
    var playMode = GamePlayService.getCurrentPlayMode();
    var soloModePlayers = GamePlayService.getPlayers();
    soloModePlayers[0].name = 'solo player 1';
    soloModePlayers[0].name = 'computer player 2';
    expect(playMode).toBe(GameConst.SINGLE_PLAYER);
    expect(soloModePlayers[0]).toBeTruthy();
    expect(soloModePlayers[1]).toBeTruthy();

    GamePlayService.switchPlayMode();
    playMode = GamePlayService.getCurrentPlayMode();
    var multiModePlayers = GamePlayService.getPlayers();
    expect(playMode).toBe(GameConst.MULTI_PLAYER);
    expect(multiModePlayers[0]).toBeTruthy();
    expect(multiModePlayers[1]).toBeTruthy();
    expect(multiModePlayers[0]).not.toEqual(soloModePlayers[0]);
    expect(multiModePlayers[1]).not.toEqual(soloModePlayers[1]);


    GamePlayService.switchPlayMode();
    playMode = GamePlayService.getCurrentPlayMode();
    var backToSoloModePlayers = GamePlayService.getPlayers();
    expect(playMode).toBe(GameConst.SINGLE_PLAYER);
    expect(backToSoloModePlayers[0]).toBeTruthy();
    expect(backToSoloModePlayers[1]).toBeTruthy();
    expect(backToSoloModePlayers[0]).toEqual(soloModePlayers[0]);
    expect(backToSoloModePlayers[1]).toEqual(soloModePlayers[1]);
  });

  describe('should have a grid marking handler for user interaction', function() {
    it('for soloplay mode', function() {
      GamePlayService.newGame();
      var player = GamePlayService.getPlayers()[0];
      expect(GamePlayService.isCurrentPlayer(player)).toBe(true);
      spyOn(player, 'mark');
      GamePlayService.markHandler(2,1);
      expect(player.mark).toHaveBeenCalledWith(2,1);
    });

    it('for muiltiplay mode', function() {
      GamePlayService.newGame();
      GamePlayService.switchPlayMode();
      var player = GamePlayService.getPlayers()[1];
      expect(GamePlayService.isCurrentPlayer(player)).toBe(true);
      spyOn(player, 'mark');
      GamePlayService.markHandler(2,1);
      expect(player.mark).toHaveBeenCalledWith(2,1);
    });
  });

  it('should notify player who next to play after each turn', function() {
    var player = GamePlayService.getPlayers()[0];
    spyOn(player, 'setCanPlay').and.callThrough();
    GamePlayService.newGame();
    expect(player.setCanPlay).toHaveBeenCalled();
    expect(player.setCanPlay.calls.count()).toEqual(1);
  });

  describe('after each player', function() {
    var player1, player2, position, grid;

    beforeEach(function() {
      player1 = GamePlayService.getPlayers()[0];
      player2 = GamePlayService.getPlayers()[1];
      position = {row: 0, col: 0};
      spyOn(player1, 'setCanPlay').and.callFake(function(deferred) {
        deferred.resolve(position);
        return deferred.promise;
      });
      GamePlayService.newGame();
      grid = GamePlayService.getGrid();
    });

    it('should alternate between user', function(done) {
      expect(player1.setCanPlay).toHaveBeenCalled();
      expect(player1.setCanPlay.calls.count()).toEqual(1);
      expect(GamePlayService.isCurrentPlayer(player1)).toBe(true);

      spyOn(grid, 'mark').and.returnValues(true,false);
      $rootScope.$apply();
      expect(grid.mark).toHaveBeenCalledWith(position, player1.marker);
      expect(grid.mark.calls.count()).toEqual(1);
      expect(GamePlayService.isCurrentPlayer(player1)).toBe(false);
      expect(GamePlayService.isCurrentPlayer(player2)).toBe(true);

      setTimeout(function() {
        $rootScope.$apply();
        expect(grid.mark.calls.count()).toEqual(2);
        expect(GamePlayService.isCurrentPlayer(player1)).toBe(false);
        expect(player1.setCanPlay.calls.count()).toEqual(1);
        done();
      }, 400);
    });

    it('should give the points to the players when game ends in a draw', function() {
      var game = {isGameOver: true, isGameWon: false};
      expect(GamePlayService.isCurrentPlayer(player1)).toBe(true);

      spyOn(grid, 'mark').and.returnValue(game);
      $rootScope.$apply();
      expect(grid.mark).toHaveBeenCalledWith(position, player1.marker);
      expect(player1.score).toEqual(player2.score);
      expect(GamePlayService.getGameOutcomeMsg()).toEqual('Draw!');
    });

    it('should give the points to winning player', function() {
      var game = {isGameOver: true, isGameWon: true};
      expect(GamePlayService.isCurrentPlayer(player1)).toBe(true);

      spyOn(grid, 'mark').and.returnValue(game);
      $rootScope.$apply();
      expect(grid.mark).toHaveBeenCalledWith(position, player1.marker);
      expect(player1.score).toBeGreaterThan(player2.score);
      expect(GamePlayService.getGameOutcomeMsg()).toEqual('Player 1 won this round!');
    });
  });

  it('should return the gameOver status', function() {
    GamePlayService.newGame();
    expect(GamePlayService.isGameOver()).toBe(false);
  });
});