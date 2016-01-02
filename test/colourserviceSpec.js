
describe("The ColourService", function() {
  beforeEach(module('tictactoe'));
  var ColourService, GamePlayService;

  beforeEach(inject(function(_ColourService_, _GamePlayService_){
    ColourService = _ColourService_;
    GamePlayService = _GamePlayService_;
  }));

  it('should exist', function() {
    expect(ColourService).toBeTruthy();
  });

  it('should return symbol colour', function() {
    var players = GamePlayService.getPlayers();
    players[1].colour = Player.colourArray[3];
    expect(ColourService.getSymbolColour({player: players[0]}, players)).toBe('symbol-red');
    expect(ColourService.getSymbolColour({marker: players[0].marker}, players)).toBe('symbol-red');
    expect(ColourService.getSymbolColour({player: players[1]}, players)).toBe('symbol-' + Player.colourArray[3]);
    expect(ColourService.getSymbolColour({marker: players[1].marker}, players)).toBe('symbol-' + Player.colourArray[3]);
    expect(ColourService.getSymbolColour({}, players)).toBeFalsy();
  });
});