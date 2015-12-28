'use strict';

class Grid {
  constructor(row = 3, col = 3) {
    this.row = row;
    this.col = col;
    this.grid = [];
    for (let y = 0; y < this.col; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.row; x++) {
        this.grid[y][x] = null;
      }
    }
  }
  mark(position, marker) {
    if (!this.withinGridBounds(position)) {
      return false;
    }
    this.grid[position.y][position.x] = marker;
    return true;
  }
  withinGridBounds(position) {
    return (position.x >= 0 && position.x < this.row) &&
      (position.y >= 0 && position.y < this.col);
  }
  draw() {

  }
}