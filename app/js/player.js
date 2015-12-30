'use strict';

class Player {
  constructor (name, marker, score = 0) {
    this.name = name;
    this.marker = marker;
    this.score = score;
    this.colour = null;
  }

  addPoints(_point) {
    var point = Number(_point);
    if(point) {
      this.score += point;
    }
  }

  static colourArray() {
    return [
    'red',
    'yellow',
    'green',
    'blue',
    'pink'
    ];
  }
}