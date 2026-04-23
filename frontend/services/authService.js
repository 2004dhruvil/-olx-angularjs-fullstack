app.service("AuthService", function ($http) {

  this.register = function (user) {
    return $http.post("http://localhost:5000/api/auth/register", user);
  };

  this.login = function (user) {
    return $http.post("http://localhost:5000/api/auth/login", user);
  };

  this.isLoggedIn = function () {
    return !!localStorage.getItem("loggedIn");
  };

  this.getUsername = function () {
    return localStorage.getItem("username");
  };

  this.getRole = function () {
    return localStorage.getItem("role");
  };

  this.logout = function () {
    localStorage.clear();
  };

});
