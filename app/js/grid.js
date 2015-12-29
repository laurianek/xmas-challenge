'use strict';

class Grid {
  constructor(_row = 3, _col = 3) {
    this.row = _row;
    this.col = _col;
    this.grid = [];
    for (let row = 0; row < this.col; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.row; col++) {
        this.grid[row][col] = null;
      }
    }
  }
  mark(position, marker) {
    if (!this.withinGridBounds(position)) {
      return false;
    }
    this.grid[position.row][position.col] = marker;
    return true;
  }
  withinGridBounds(position) {
    return (position.row >= 0 && position.row < this.row) &&
      (position.col >= 0 && position.col < this.col);
  }
}