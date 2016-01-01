'use strict';

class Grid {
  constructor(square = 3) {
    this.square = square;
    this.grid = [];
    this.gameOver = false;
    this.freeCell = Math.pow(this.square, 2);
    for (let row = 0; row < this.square; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.square; col++) {
        this.grid[row][col] = null;
      }
    }
  }
  mark(position, marker) {
    if (this.gameOver) {
      return false;
    }
    if (!this._withinGridBounds(position) || this._isAlreayMarked(position)) {
      return false;
    }
    this.grid[position.row][position.col] = marker;
    this.freeCell--;
    var game = this._gameWon(position);
    if (game.isGameOver) {
      this.gameOver = game.isGameOver;
      return game;
    }
    game.isGameOver = 0 === this.freeCell;
    this.gameOver = game.isGameOver;
    return game;
  }
  _withinGridBounds(position) {
    return (position.row >= 0 && position.row < this.square) &&
      (position.col >= 0 && position.col < this.square);
  }
  _isAlreayMarked(position) {
    return this.grid[position.row][position.col];
  }
  _winReduce(position, mark, fns) {
    if(fns.extraCheck && fns.extraCheck(position)) {
      return false;
    }
    for (let i = 0, j = this.square-1, cell; i < this.square; i++, j--) {
      cell = fns.cell(position, i, j);
      if (!cell || cell.symbol !== mark.symbol) {
        return false;
      }
    }
    return fns.returnValue;
  }
  _gameWon(position) {
    var _this = this;
    var currentMark = this._isAlreayMarked(position);
    var checks = [
      {
        cell: function hzw (position, i, j) { return _this.grid[position.row][i]; },
        returnValue: Grid.constant.HZ_WIN
      },
      {
        cell: function vtw (position, i, j) { return _this.grid[i][position.col]; },
        returnValue: Grid.constant.VT_WIN
      },
      {
        cell: function lhdw(position, i, j) { return _this.grid[i][i]; },
        extraCheck(position) { return position.row !== position.col },
        returnValue: Grid.constant.LHD_WIN
      },
      {
        cell: function rhdw(position, i, j) { return _this.grid[i][j]; },
        extraCheck(position) { return position.row !== _this.square - 1 - position.col },
        returnValue: Grid.constant.RHD_WIN
      }
    ];
    var win = checks.reduce(function winReduceFn(previousValue, currentObj) {
      if (previousValue) {
        return previousValue;
      }
      return _this._winReduce(position, currentMark, currentObj);
    }, false);
    if (win) {
      return { isGameWon: true, winType: win, isGameOver: true };
    }
    return { isGameWon: false, winType: '', isGameOver: false };
  }
}

Grid.constant = {
  HZ_WIN: 'horizontal win',
  VT_WIN: 'vertical win',
  LHD_WIN: 'left hand-side diagonal win',
  RHD_WIN: 'right hand-side diagonal win'
};