angular.module('project', ['firebase']).
  value('fbUrl', 'https://slug-dub.firebaseio.com/').
  factory('Presents', function(angularFireCollection, fbUrl) {
    return angularFireCollection(new Firebase(fbUrl + 'presents'));
  }).
  config(function($routeProvider) {
    $routeProvider.
      when('/', { controller: InitialController, templateUrl: 'initial.html' }).
      when('/game', { controller: GameController, templateUrl: 'game.html' }).
      when('/stats', { controller: StatsController, templateUrl: 'stats.html' }).
      otherwise({ redirectTo: '/' });
  });

function InitialController($scope, $location, $timeout, angularFire, fbUrl) {
  angularFire(new Firebase(fbUrl + 'game'), $scope, 'game', {});

  $scope.startGame = function() {
    var presents = new Firebase(fbUrl + 'presents');
    presents.remove();
    $scope.game.currentRound = 1;
    $location.path('/game');
  };
}

function GameController($scope, $timeout, $location, angularFire, Presents, fbUrl) {
  angularFire(new Firebase(fbUrl + 'game'), $scope, 'game', {});
  $scope.presents = Presents;

  $scope.newPresent = function() {
    Presents.add({"description": $scope.presentDescription,
                  "totalSteals": 0,
                  "stolenThisRound": false}, function() {
      $timeout(function() {});
    });

    startNewRound();
  };

  function startNewRound() {
    $scope.presentDescription = "";

    // New round so all presents should return to "Up for grabs"
    angular.forEach($scope.presents, function(present) {
      present.stolenThisRound = false;
    });

    if ($scope.game.currentRound === $scope.game.numPlayers) {
      $location.path('/stats');
    }
    else {
      $scope.game.currentRound += 1;
      $location.path('/game');
    }
  }

  $scope.stealPresent = function(presentId) {
    // TODO: Find better way to do this
    angular.forEach($scope.presents, function(present) {
      if (present.$id == presentId) {
        present.stolenThisRound = true;
        present.totalSteals += 1;
      }
    });
  };

  $scope.unstealPresent = function(presentId) {
    // TODO: Find better way to do this
    angular.forEach($scope.presents, function(present) {
      if (present.$id == presentId) {
        present.stolenThisRound = false;
        present.totalSteals -= 1;
      }
    });
  };
}

function StatsController($scope, fbUrl, angularFire, Presents) {
  angularFire(new Firebase(fbUrl + 'game'), $scope, 'game', {});
  $scope.presents = Presents;
}

