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

  static colourArray() {
    return [
    'red',
    'yellow',
    'green',
    'blue',
    'pink'
    ];
  }

  static randomCell(){
    var a = Math.floor(Math.random() * 100);
    var boundary = Math.floor(100 / 3);
    console.log('a', a, 'boundary', boundary);
    if (0 <= a && a < boundary) {
      return 0;
    }
    if (boundary <= a && a < 2 * boundary) {
      return 1;
    }
    return 2;
  }

  play(deffered) {
    var _this = this;
    this.canPlay = deffered;
    if(this.isBot) {
      setTimeout(function botMove() {
        var position = {row: Player.randomCell(), col: Player.randomCell()};
        console.log(position);
        _this.canPlay.resolve(position);
        _this.canPlay = false;
      }, 500)
    }
    return this.canPlay.promise;
  }

  mark(row, col) {
    if (this.canPlay) {
      console.log(this);
      this.canPlay.resolve({row: row, col: col});
      this.canPlay = false;
    }
  }

  reset() {
    this.canPlay = false;
  }


}