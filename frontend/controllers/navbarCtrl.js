app.controller("NavbarCtrl", function ($scope, $location, AuthService, $http, $interval) {
  $scope.isLoggedIn = AuthService.isLoggedIn;
  $scope.getUsername = AuthService.getUsername;
  $scope.getRole = AuthService.getRole;

  $scope.logout = function () {
    AuthService.logout();
    $location.path("/login");
  };

  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };

});
