angular.module('project', ['firebase']).
  value('fbURL', 'https://slug-dub.firebaseio.com/presents').
  factory('Presents', function(angularFireCollection, fbURL) {
    return angularFireCollection(fbURL);
  }).
  config(function($routeProvider) {
    $routeProvider.
      when('/', { controller: InitialController, templateUrl: 'initial.html' }).
      when('/game', { controller: GameController, templateUrl: 'game.html' }).
      when('/stats', { controller: StatsController, templateUrl: 'stats.html' }).
      otherwise({ redirectTo: '/' });
  });

function InitialController($scope, $location, $timeout, angularFire, Presents) {
  var ref = 'https://slug-dub.firebaseio.com/game';
  angularFire(ref, $scope, 'game', {}).
  then(function() {
  });

  $scope.startGame = function() {
    $location.path('/game');
  };
}

function GameController($scope, angularFire, Presents) {
  var ref = 'https://slug-dub.firebaseio.com/game';
  angularFire(ref, $scope, 'game', {});
  $scope.presents = Presents;
}

function StatsController() {

}

