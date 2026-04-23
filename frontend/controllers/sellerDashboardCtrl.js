app.controller("SellerDashboardCtrl", function (
  $scope,
  $location,
  ProductService
) {

  // 🔐 Protect seller page
  if (!localStorage.getItem("loggedIn") ||
  localStorage.getItem("role") !== "seller") {
    $location.path("/seller/login");
    return;
  }

  const seller = localStorage.getItem("username");

  ProductService.getProducts().then(function (res) {
    $scope.myProducts = res.data.filter(p => p.seller === seller);
  });

  // UI-only edit
  $scope.editProduct = function (product) {
    alert("Edit feature can be extended");
  };

  // Delete
  $scope.deleteProduct = function (id) {
    if (confirm("Delete this product?")) {
      ProductService.deleteProduct(id).then(function () {
        $scope.myProducts =
          $scope.myProducts.filter(p => p.id !== id);
      });
    }
  };

});
