app.controller("LoginCtrl", function ($scope, $location, AuthService) {

  $scope.user = {};

  $scope.login = function () {

    AuthService.login($scope.user)
      .then(function (res) {

        localStorage.setItem("loggedIn", "true");

        // use backend values
        localStorage.setItem("username", res.data.user.name);
        localStorage.setItem("role", res.data.user.role);

        localStorage.setItem("user", JSON.stringify(res.data.user));

        // redirect
        $location.path("/home");

      })
      .catch(function (err) {

        if (err.data && err.data.message) {
          alert(err.data.message);
        } else {
          alert("Login failed");
        }

      });
  };

});
