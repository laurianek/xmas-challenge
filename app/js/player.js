'use strict';

class Player {
  constructor (name, marker, score = 0, colour = 'red') {
    this.name = name;
    this.marker = marker;
    this.score = score;
    this.colour = colour;
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