'use strict';

class Player {
  constructor (name, marker, isBot = false, score = 0, colour = 'red') {
    this.name = name;
    this.marker = marker;
    this.score = score;
    this.colour = colour;
    this.isBot = isBot;
    this.canPlay = false;
  }

  addPoints(_point) {
    var point = Number(_point);
    if(point) {
      this.score += point;
    }
  }

  static randomCell(){
    var a = Math.floor(Math.random() * 100);
    var boundary = Math.floor(100 / 3);
    if (0 <= a && a < boundary) {
      return 0;
    }
    if (boundary <= a && a < 2 * boundary) {
      return 1;
    }
    return 2;
  }

  setCanPlay(deffered) {
    var _this = this;
    this.canPlay = deffered;
    if(this.isBot) {
      setTimeout(function botMove() {
        _this.mark(Player.randomCell(), Player.randomCell())
      }, 200)
    }
    return this.canPlay.promise;
  }

  mark(row, col) {
    if (this.canPlay) {
      this.canPlay.resolve({row: row, col: col});
      this.canPlay = false;
    }
  }

  reset() {
    this.canPlay = false;
  }
}

Player.colourArray = [
  'red',
  'yellow',
  'green',
  'blue',
  'pink'
];