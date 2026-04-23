app.controller("ProductDetailCtrl", function (
  $scope,
  $routeParams,
  $location,
  ProductService,
  $http,
  AuthService
) {

  const productId = $routeParams.id;

  ProductService.getProducts().then(function (res) {
    $scope.product = res.data.find(p => p._id == productId);
  });

  $scope.buyProduct = function () {
    $location.path("/order-form/" + productId);
  };

  $scope.goToOrder = function (id) {
    console.log("Product ID:", id);
    $location.path('/order-form/' + id);
  }

  // CHAT MODAL LOGIC
  $scope.openChat = function () {
    if (!AuthService.isLoggedIn()) {
      alert("Please login to chat with seller");
      $location.path("/login");
      return;
    }
    // Redirect to real-time chat with this seller
    $location.path("/chat").search({ user: $scope.product.seller });
  };


});
