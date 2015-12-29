'use strict';

class Grid {
  constructor(square = 3) {
    this.square = square;
    this.grid = [];
    this.gameOver = false;
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
    if (!this.withinGridBounds(position) || this.isAlreayMarked(position)) {
      return false;
    }
    this.grid[position.row][position.col] = marker;
    this.gameOver = this.gameWon(position).isGameWon;
    return true;
  }
  withinGridBounds(position) {
    return (position.row >= 0 && position.row < this.square) &&
      (position.col >= 0 && position.col < this.square);
  }
  isAlreayMarked(position) {
    return this.grid[position.row][position.col];
  }
  gameWon(position) {
    var currentMark = this.isAlreayMarked(position);
    var lWin = this.linearWin(position, currentMark);
    var dWin = this.diagonalWin(position, currentMark);
    console.log(lWin, dWin);
    if (lWin || dWin) {
      return {
        isGameWon: true,
        winType: dWin? dWin : lWin
      };
    }
    return {
      isGameWon: false,
      winType: ''
    };
  }
  linearWin(position, mark) {
    var colWin = true;
    var rowWin = true;
    var cell1, cell2;
    for (let i = 0; i < this.square; i++) {
      cell1 = this.grid[position.row][i];
      cell2 = this.grid[i][position.col];
      if (!cell1 || cell1.symbol !== mark.symbol) {
        rowWin = false;
      }
      if (!cell2 || cell2.symbol !== mark.symbol) {
        colWin = false;
      }
    }
    if (colWin) { return Grid.enum().VT_WIN; }
    if (rowWin) { return Grid.enum().HZ_WIN; }
    return false;
  }
  diagonalWin(position, mark) {
    if (position.row != position.col) {
      return false;
    }
    var lhdWin = true;
    var rhdWin = true;
    var cell1, cell2;
    for (let i = 0, j = this.square; i < this.square; i++, j--) {
      cell1 = this.grid[i][i];
      cell2 = this.grid[i][j];
      if (!cell1 || cell1.symbol !== mark.symbol) {
        lhdWin = false;
      }
      if (!cell2 || cell2.symbol !== mark.symbol) {
        rhdWin = false;
      }
    }
    if (lhdWin) { return Grid.enum().LHD_WIN; }
    if (rhdWin) { return Grid.enum().RHD_WIN; }
    return false;
  }
  static enum() {
    return {
      HZ_WIN: 'horizontal win',
      VT_WIN: 'vertical win',
      LHD_WIN: 'left hand-side diagonal win',
      RHD_WIN: 'right hand-side diagonal win'
    }
  }
}