app.controller("MyOrdersCtrl", function ($scope, $http) {

  const user = localStorage.getItem("username");

  $http.get("http://localhost:5000/api/orders/my-orders?user=" + user)
    .then(function (res) {
      $scope.myOrders = res.data;
    })
    .catch(function (err) {
      console.error("Error fetching orders:", err);
    });

});
