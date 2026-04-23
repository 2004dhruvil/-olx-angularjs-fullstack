app.controller("AdminLoginCtrl", function ($scope, $location) {

  $scope.admin = {};

  $scope.loginAdmin = function () {

    // simple hardcoded admin (college project)
    if ($scope.admin.username === "admin" &&
        $scope.admin.password === "admin123") {

      localStorage.setItem("loggedIn", true);
      localStorage.setItem("role", "admin");
      localStorage.setItem("username", "Admin");

      $location.path("/admin");

    } else {
      alert("Invalid admin credentials");
    }
  };

});
