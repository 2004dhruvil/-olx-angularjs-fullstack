app.controller("RegisterCtrl", function ($scope, $location, AuthService) {

  $scope.user = {
    name: "",
    email: "",
    password: "",
    role: "user"
  };

  $scope.register = function () {



    AuthService.register($scope.user).then(function (res) {
      alert("User Registered");
      $location.path("/login");
    });

  };

});
