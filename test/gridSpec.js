
describe("A Grid", function() {
  var grid;
  var position;
  var marker;
  var gridSize;
  var gameStatus;

  beforeEach(function() {
    gridSize = 3;
    grid = new Grid(gridSize);
    marker = {symbol: 'test marker'};
    position = {row: 2, col: 1};
    gameStatus = undefined;
  });

  it('should be initialised and should be a 3x3 grid by default', function() {
    var thisGrid;
    expect(thisGrid).not.toBeDefined();
    thisGrid = new Grid();
    expect(thisGrid).toBeDefined();
    expect(thisGrid.square).toEqual(3);
  });

  it('should be able to be marked', function() {
    gameStatus = grid.mark(position, marker);
    expect(gameStatus).toBeTruthy();
    expect(gameStatus.isGameOver).toBe(false);
    expect(gameStatus.isGameWon).toBe(false);
    expect(grid.grid[position.row][position.col]).toEqual(marker);
  });

  it('should allow to be marked where there is already a marker', function() {
    var anotherMarker = {symbol: 'another marker'};
    gameStatus = grid.mark(position, marker);
    expect(gameStatus).toBeTruthy();
    expect(grid.grid[position.row][position.col]).toEqual(marker);
    gameStatus = grid.mark(position, anotherMarker);
    expect(gameStatus).toBeFalsy();
    expect(grid.grid[position.row][position.col]).not.toEqual(anotherMarker);
    expect(grid.grid[position.row][position.col]).toEqual(marker);
  });

  it('should NOT allow to be marked when the game has ended',
    it_should_not_allow_to_be_marked_when_the_game_has_ended);

  function it_should_not_allow_to_be_marked_when_the_game_has_ended() {
    for (var i = 0; i < gridSize - 1; i++) {
      gameStatus = grid.mark({row: 1, col: i}, marker);
      expect(gameStatus).toBeTruthy();
      expect(gameStatus.isGameOver).toBe(false);
      expect(gameStatus.isGameWon).toBe(false);
    }
    gameStatus = grid.mark({row: 1, col: 2}, marker);
    expect(gameStatus).toBeTruthy();
    expect(gameStatus.isGameOver).toBe(true);
    expect(gameStatus.isGameWon).toBe(true);
    gameStatus = grid.mark({row: 2, col: 2}, marker);
    expect(gameStatus).toBeFalsy();
  }

  it('should NOT allow to be marked outside the boundary of the grid', function() {
    gameStatus = grid.mark({row: 3, col: 3}, marker);
    expect(gameStatus).toBeFalsy();
  });

  it('should returned the game status after each time it is marked', function() {
    gameStatus = grid.mark(position, marker);
    expect(gameStatus).toBeTruthy();
    gameStatus = grid.mark(position, marker);
    expect(gameStatus).toBeFalsy();
  });

  it('should returned a game over status when there is no more free cell in the grid', function() {
    var i, j;
    for (i = 0; i < gridSize; i++) {
      for (j = 0; j < gridSize; j++) {
        if (2 === i && 2 === j) {
          continue;
        }
        gameStatus = grid.mark({row: i, col: j}, {symbol: ['test marker',i,j].join(' ')});
        expect(gameStatus).toBeTruthy();
        expect(gameStatus.isGameOver).toBe(false);
        expect(gameStatus.isGameWon).toBe(false);
      }
    }
    gameStatus = grid.mark({row: 2, col: 2}, {symbol: 'the last mark'});
    expect(gameStatus).toBeTruthy();
    expect(gameStatus.isGameOver).toBe(true);
    expect(gameStatus.isGameWon).toBe(false);
  });

  it('should returned a game won status when a move lead to a win',
    it_should_not_allow_to_be_marked_when_the_game_has_ended);

  describe('when checking for a win,', function () {

    function lineWinTest(isRow) {
      var i, j, aGrid;
      for (j = 0; j < gridSize; j++) {
        aGrid = new Grid(3);
        position = isRow? {row: j} : {col: j};
        for (i = 0; i < gridSize - 1; i++) {
          isRow? position.col = i : position.row = i;
          gameStatus = aGrid.mark(position, marker);
          expect(gameStatus).toBeTruthy();
          expect(gameStatus.isGameOver).toBe(false);
          expect(gameStatus.isGameWon).toBe(false);
        }
        isRow? position.col = 2 : position.row = 2;
        gameStatus = aGrid.mark(position, marker);
        expect(gameStatus).toBeTruthy();
        expect(gameStatus.isGameOver).toBe(true);
        expect(gameStatus.isGameWon).toBe(true);
        isRow ?
          expect(gameStatus.winType).toEqual(Grid.constant.HZ_WIN) :
          expect(gameStatus.winType).toEqual(Grid.constant.VT_WIN);

      }
    }

    it('should return a win for all horizontal win combinations', function () {
      lineWinTest(true);
    });

    it('should return a win for all vertical win combination', function () {
      lineWinTest(false);
    });

    it('should return a win for all diagonal win combination', function () {
      var i, j;
      var lhsGrid = new Grid(3);
      var rhsGrid = new Grid(3);
      for (i = 0, j = gridSize - 1; i < gridSize - 1; i++, j--) {
        position = {row: i, col: i};
        gameStatus = lhsGrid.mark(position, marker);
        expect(gameStatus).toBeTruthy();
        expect(gameStatus.isGameOver).toBe(false);
        expect(gameStatus.isGameWon).toBe(false);

        position = {row: i, col: j};
        gameStatus = rhsGrid.mark(position, marker);
        expect(gameStatus).toBeTruthy();
        expect(gameStatus.isGameOver).toBe(false);
        expect(gameStatus.isGameWon).toBe(false);
      }
      position = {row: 2, col: 2};
      gameStatus = lhsGrid.mark(position, marker);
      expect(gameStatus).toBeTruthy();
      expect(gameStatus.isGameOver).toBe(true);
      expect(gameStatus.isGameWon).toBe(true);
      expect(gameStatus.winType).toEqual(Grid.constant.LHD_WIN);

      position = {row: 2, col: 0};
      gameStatus = rhsGrid.mark(position, marker);
      expect(gameStatus).toBeTruthy();
      expect(gameStatus.isGameOver).toBe(true);
      expect(gameStatus.isGameWon).toBe(true);
      expect(gameStatus.winType).toEqual(Grid.constant.RHD_WIN);
    });
  })
});