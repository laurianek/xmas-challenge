
describe("The mainCtrl", function() {
  beforeEach(module('tictactoe'));
  var ColourService, GamePlayService, GameConst, $q;
  var controller, $scope;

  beforeEach(inject(function(_$controller_, _$q_, _GameConst_, _GamePlayService_, _ColourService_, _$rootScope_){
    ColourService = _ColourService_;
    GamePlayService = _GamePlayService_;
    GameConst = _GameConst_;
    $q = _$q_;
    $scope = _$rootScope_.$new();
    controller = _$controller_('mainCtrl', {
        $scope: $scope,
        $q: $q,
        GameConst: GameConst,
        GamePlayService: GamePlayService,
        ColourService: ColourService}
    );
  }));

  it('should be initialised successfully', function() {
    expect($scope).toBeTruthy();
    expect(controller).toBeTruthy();
  });

  it('should be able to `getSymbolColour`', function() {
    var players = GamePlayService.getPlayers();
    var player1 = players[0];
    var param1 = {player: player1};
    player1.colour = 'blue';
    spyOn(ColourService, 'getSymbolColour').and.callThrough();
    spyOn(GamePlayService, 'getPlayers').and.callThrough();

    var result = $scope.getSymbolColour({player: player1});
    expect(result).toEqual('symbol-blue');
    expect(ColourService.getSymbolColour).toHaveBeenCalledTimes(1);
    expect(ColourService.getSymbolColour).toHaveBeenCalledWith(param1, players);
    expect(GamePlayService.getPlayers).toHaveBeenCalledTimes(1);
  });

  it('should be able to `switchPlayMode`', function() {
    //request players, grid and status again
    spyOn(GamePlayService, 'switchPlayMode').and.callThrough();
    spyOn(GamePlayService, 'getCurrentPlayMode').and.callThrough();
    spyOn(GamePlayService, 'getPlayers').and.callThrough();
    spyOn(GamePlayService, 'getGrid').and.callThrough();
    spyOn(GamePlayService, 'isGameOver').and.callThrough();

    var result = GamePlayService.getCurrentPlayMode();
    var switchText = $scope.switchText;
    expect(result).toEqual(GameConst.SINGLE_PLAYER);
    expect(GamePlayService.getCurrentPlayMode).toHaveBeenCalledTimes(1);
    expect(GamePlayService.switchPlayMode).not.toHaveBeenCalled();

    $scope.switchPlayMode();
    $scope.$apply();
    result = GamePlayService.getCurrentPlayMode();
    expect(result).toEqual(GameConst.MULTI_PLAYER);
    expect(GamePlayService.getCurrentPlayMode).toHaveBeenCalledTimes(3);
    expect(GamePlayService.getPlayers).toHaveBeenCalled();
    expect(GamePlayService.getGrid).toHaveBeenCalled();
    expect(GamePlayService.isGameOver).toHaveBeenCalled();
    expect($scope.switchText).not.toEqual(switchText);

    $scope.switchPlayMode();
    result = GamePlayService.getCurrentPlayMode();
    expect(result).toEqual(GameConst.SINGLE_PLAYER);
    expect(GamePlayService.getCurrentPlayMode).toHaveBeenCalledTimes(5);
    expect(GamePlayService.getPlayers).toHaveBeenCalled();
    expect(GamePlayService.getGrid).toHaveBeenCalled();
    expect(GamePlayService.isGameOver).toHaveBeenCalled();
    expect($scope.switchText).toEqual(switchText);
  });

});