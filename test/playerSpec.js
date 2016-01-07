
describe("A Player", function() {
  var player;
  var playerName;

  beforeEach(function() {
    playerName = 'test player';
    player = new Player(playerName);
  });

  it("should be initialise and have a name and marker", function() {
    var name = 'test name';
    var marker = { marker: 'test marker'};
    player = new Player(name, marker);

    expect(player.name).toBe(name);
    expect(player.marker).toBe(marker);
  });

  it("should be able to add points", function() {
    var validPoints = [1, 0.5, 0.3, 20];
    var invalidPoints = ['lol', '10pts', '3.5points'];
    var accum = 0;
    var i;

    for (i = 0; i < validPoints.length; i++) {
      accum += validPoints[i];
      player.addPoints(validPoints[i]);
      expect(player.score).toEqual(accum);
    }
    for (i = 0; i < invalidPoints.length; i ++) {
      player.addPoints(invalidPoints[i]);
      expect(player.score).toEqual(accum);
    }
  });

  it("should give back a random cell number", function() {
    for (var i = 0, cell; i < 100; i++) {
      cell = Player.getRandomCell();
      expect(cell).toBeLessThan(3);
      expect(cell).toBeGreaterThan(-1);
      expect(cell).toEqual(parseInt(cell));
    }
  });

  it("should be allowed to play when it's their turn", function() {
    expect(player.canPlay).toBeFalsy();
    var returnedValue = 'stub promise';
    var value = player.setCanPlay({promise: returnedValue});
    expect(player.canPlay).toBeTruthy();
    expect(value).toEqual(returnedValue);

  });

  it("should be able to mark a cell in the grid", function() {
    var test = {
      promise: 'stub promise',
      resolve: function() {}
    };
    spyOn(test, 'resolve');
    expect(player.canPlay).toBeFalsy();
    player.setCanPlay(test);
    expect(player.canPlay).toBeTruthy();
    player.mark(2, 4);
    expect(test.resolve).toHaveBeenCalledWith({ row: 2, col: 4 });
  });

  it("should have its turn reset", function() {
    expect(player.canPlay).toBeFalsy();
    player.setCanPlay({promise: 'stub promise', resolve: function(){}, reject: function(){}});
    expect(player.canPlay).toBeTruthy();
    player.reset();
    expect(player.canPlay).toBeFalsy();
  });

});