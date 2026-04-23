app.controller("AddProductCtrl", function ($scope, $location, $routeParams, ProductService) {

  $scope.isEdit = false;
  $scope.buttonText = "Post Ad";
  $scope.titleText = "Post Your Ad";

  // product model
  $scope.product = {
    category: ""
  };

  // Check if editing
  if ($routeParams.id) {
    $scope.isEdit = true;
    $scope.buttonText = "Update Ad";
    $scope.titleText = "Edit Ad";

    ProductService.getProduct($routeParams.id).then(function (res) {
      $scope.product = res.data;
      // Convert price to number for input[type=number]
      $scope.product.price = Number($scope.product.price);
      // Keep existing images
      $scope.existingImages = $scope.product.images || [];
    });
  }

  $scope.addProduct = function () {

    // Only set seller if NOT editing (new product)
    if (!$scope.isEdit) {
      const seller = localStorage.getItem("username");
      $scope.product.seller = seller;
    }

    // validation
    if (!$scope.product.title || !$scope.product.price) {
      alert("Title and Price are required");
      return;
    }
    //category
    if (!$scope.product.category) {
      alert("Please select category");
      return;
    }

    if (!$scope.isEdit && !$scope.product.image1) {
      alert("Please select at least the main image");
      return;
    }

    console.log("PRODUCT BEFORE SEND:", $scope.product);

    if ($scope.isEdit) {
      ProductService.updateProduct($routeParams.id, $scope.product)
        .then(function () {
          alert("Product updated successfully");
          // Check if admin
          const role = localStorage.getItem("role");
          if (role === "admin") {
            $location.path("/admin");
          } else {
            $location.path("/my-products");
          }
        })
        .catch(function (err) {
          console.error("Update failed:", err);
          alert("Failed to update product: " + (err.data ? err.data.message : "Unknown error"));
        });
    } else {
      ProductService.addProduct($scope.product)
        .then(function () {
          alert("Product added successfully");
          $location.path("/products"); // redirect to main product list
        })
        .catch(function () {
          alert("Failed to add product");
        });
    }
  };

});
