'use strict';

app.directive('playerEditName', function(GamePlayService) {
  return {
    restrict: 'EA',
    scope: {
      player: '='
    },
    template: '<span class="player-edit-name" ng-hide="player.editName" ng-click="player.editName = true"> \
                  <span>{{ player.name }}</span><i class="glyphicon glyphicon-pencil" ng-show="player.canEditName"></i> \
                </span> \
                <form ng-submit="changeName(player)" ng-show="player.editName"> \
                  <label class="sr-only" for="playerMe">enter your name</label> \
                  <input type="text" class="player-name" id="playerMe" ng-model="player.name"> \
                </form>',
    link: function (scope, el) {
      scope.changeName = GamePlayService.playerNameChanged;
    }
  };
});