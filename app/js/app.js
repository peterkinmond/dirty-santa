angular.module('project', [
  'firebase',
  'ngRoute',
  'myApp.controllers'
]).
value('fbUrl', 'https://dirty-santa.firebaseio.com/').
factory('Presents', function(angularFireCollection, fbUrl) {
  return angularFireCollection(new Firebase(fbUrl + 'presents'));
}).
config(function($routeProvider) {
  $routeProvider.
    when('/', { controller: 'InitialController', templateUrl: 'partials/initial.html' }).
    when('/game', { controller: 'GameController', templateUrl: 'partials/game.html' }).
    when('/stats', { controller: 'StatsController', templateUrl: 'partials/stats.html' }).
    otherwise({ redirectTo: '/' });
});
