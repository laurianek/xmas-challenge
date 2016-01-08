'use strict';

app.directive('playerEditName', function(GamePlayService) {
  return {
    restrict: 'EA',
    scope: {
      player: '='
    },
    template: '<span class="player-edit-name" ng-hide="player.editName" ng-click="editName()"> \
                  <span>{{ player.name }}</span><i class="glyphicon glyphicon-pencil" ng-show="player.canEditName"></i> \
                </span> \
                <form ng-submit="changeName(player)" ng-show="player.editName"> \
                  <label class="sr-only" for="playerMe">enter your name</label> \
                  <input type="text" class="player-name" id="playerMe" ng-model="player.name"> \
                </form>',
    link: function (scope, el) {
      scope.changeName = GamePlayService.playerNameChanged;
      scope.editName = function() {
        if (scope.player.canEditName) {
          scope.player.editName = true;
          var inputEl = el[0].getElementsByTagName('input')[0];
          (function(input) {setTimeout(function() {input.focus();}, 10)})(inputEl);
        }
      }
    }
  };
});