app.controller("ProductListCtrl", function ($scope, $location, ProductService) {

  // load products
  // function loadProducts() {
  //   ProductService.getProducts().then(function (res) {
  //     console.log("PRODUCTS:", res.data);
  //     $scope.products = res.data;
  //   });
  // }
  function loadProducts(){

 const cat = $location.search().cat;

 ProductService.getProducts().then(function(res){

   $scope.all = res.data;

   if(cat){
     $scope.products = $scope.all.filter(p =>
       p.category && p.category.toLowerCase() === cat.toLowerCase()
     );
     $scope.selectedCategory = cat;
   }else{
     $scope.products = $scope.all;
   }

 });
}

  // Apply all filters
  $scope.applyFilters = function () {
    let filtered = $scope.all;

    // 1. Filter by Category
    if ($scope.selectedCategory) {
      filtered = filtered.filter(p => p.category === $scope.selectedCategory);
    }

    // 2. Filter by Price Range
    if ($scope.minPrice) {
      filtered = filtered.filter(p => p.price >= $scope.minPrice);
    }
    if ($scope.maxPrice) {
      filtered = filtered.filter(p => p.price <= $scope.maxPrice);
    }

    $scope.products = filtered;
  };

  // Keep filterCategory as an alias or trigger for applyFilters
  $scope.filterCategory = function () {
    $scope.applyFilters();
  };



  loadProducts();

  // delete product (seller)
  $scope.delete = function (id) {
    if (confirm("Delete this product?")) {
      ProductService.deleteProduct(id).then(function () {
        loadProducts(); // ✅ correct reload
      });
    }
  };

  // buy product → go to order page
 $scope.goOrder = function (product) {

  const user = localStorage.getItem("username");

  if (!user) {
    alert("Please login first");
    return;
  }

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  const order = {
    id: Date.now(),
    buyer: user,
    title: product.title,
    price: product.price,
    seller: product.seller,
    status: "Placed"
  };

  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // alert("Order placed successfully");

  // redirect to order page
  $location.path("/order/" + product._id);
};



});
