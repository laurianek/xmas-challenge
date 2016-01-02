'use strict';

(function(){
  class ColourService {
    getSymbolColour(obj, players) {
      if(obj.player) {
        return `symbol-${obj.player.colour}`;
      }
      if(obj.marker) {
        let player = players[0].marker.symbol == obj.marker.symbol ? players[0] : players[1];
        return `symbol-${player.colour}`;
      }
      return '';
    }
  }

  app.service('ColourService', ColourService);
})();

