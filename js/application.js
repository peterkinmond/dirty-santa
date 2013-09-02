angular.module('project', ['firebase']).
  value('fbURL', 'https://slug-dub.firebaseio.com/').
  factory('Projects', function(angularFireCollection, fbURL) {
    return angularFireCollection(fbURL);
  }).
  config(function($routeProvider) {
    $routeProvider.
      when('/', { controller: InitialController, templateUrl: 'initial.html' }).
      when('/game', { controller: GameController, templateUrl: 'game.html' }).
      when('/stats', { controller: StatsController, templateUrl: 'stats.html' }).
      otherwise({ redirectTo: '/' });
  });

function InitialController($scope, Projects) {

}

function GameController($scope, Projects) {

}

function StatsController($scope, Projects) {

}
