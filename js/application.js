angular.module('project', ['firebase']).
  value('fbUrl', 'https://dirty-santa.firebaseio.com/').
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
  angularFire(new Firebase(fbUrl + 'game'), $scope, 'game', {}).
  then(function() {
    $scope.game.numPlayers = 4;
  });

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
                  "createdInRound": $scope.game.currentRound,
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
    var present = Presents.getByName(presentId);
    present.stolenThisRound = true;
    present.totalSteals += 1;
    Presents.update(present);
  };
}

function StatsController($scope, fbUrl, angularFire, Presents) {
  angularFire(new Firebase(fbUrl + 'game'), $scope, 'game', {}).then(function() {
    $scope.presents = Presents;

    $scope.stealPercentage = function(presentId) {
      var present = Presents.getByName(presentId);
      return present.totalSteals / ($scope.game.numPlayers - present.createdInRound) * 100;
    };
  });
}
