app.service("UserService", function ($http) {

  this.getUsers = function () {
    return $http.get("http://localhost:5000/api/auth");
  };

  this.deleteUser = function (id) {
    return $http.delete("http://localhost:5000/api/auth/" + id);
  };

});
