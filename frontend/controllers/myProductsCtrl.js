app.controller("MyProductsCtrl", function ($scope, $location, ProductService) {

  // 🔐 PROTECT SELLER PAGE
  if (!localStorage.getItem("loggedIn")) {
    $location.path("/login");
    return;
  }

  const user = localStorage.getItem("username");

  ProductService.getProducts().then(function (res) {
    $scope.myProducts = res.data.filter(p => p.seller === user);
  });

  // Delete
  $scope.delete = function (id) {
    if (confirm("Delete this product?")) {
      ProductService.deleteProduct(id).then(function () {
        $scope.myProducts =
          $scope.myProducts.filter(p => p._id !== id);
      });
    }
  };

});
