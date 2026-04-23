

app.config(function ($routeProvider) {


  $routeProvider

    // 🏠 DEFAULT → LOGIN
    .when("/", {
      templateUrl: "views/login.html",
      controller: "LoginCtrl"
    })


    // 🔐 AUTH
    .when("/register", {
      templateUrl: "views/register.html",
      controller: "RegisterCtrl"
    })

    .when("/login", {
      templateUrl: "views/login.html",
      controller: "LoginCtrl"
    })



    // 🏠 HOME (AFTER LOGIN YOU CAN REDIRECT HERE)
    .when("/home", {
      templateUrl: "views/home.html",
      controller: "HomeCtrl"
    })

    // 📦 PRODUCTS
    .when("/products", {
      templateUrl: "views/product-list.html",
      controller: "ProductListCtrl"
    })
    //     .when("/products",{
    //  templateUrl:"views/products-list.html",
    //  controller:"ProductListCtrl",
    //  resolve:{
    //    auth:function($location){
    //       if(!localStorage.getItem("user")){
    //          $location.path("/register");
    //       }
    //    }
    //  }
    // })


    // 🔍 PRODUCT DETAIL
    .when("/product/:id", {
      templateUrl: "views/product-detail.html",
      controller: "ProductDetailCtrl"
    })
    //     .when("/product/:id",{
    //  templateUrl:"views/product-detail.html",
    //  controller:"productDetailCtrl",
    //  resolve:{
    //    auth:function($location){
    //       if(!localStorage.getItem("user")){
    //          $location.path("/register");
    //       }
    //    }
    //  }
    // })


    // ➕ ADD PRODUCT (SELLER)
    .when("/add-product", {
      templateUrl: "views/add-product.html",
      controller: "AddProductCtrl"
    })

    // ✏️ EDIT PRODUCT (ADMIN & SELLER)
    .when("/edit-product/:id", {
      templateUrl: "views/add-product.html",
      controller: "AddProductCtrl"
    })

    // 🧑‍💼 SELLER PRODUCTS
    .when("/my-products", {
      templateUrl: "views/my-products.html",
      controller: "MyProductsCtrl"
    })

    // my order
    .when("/my-orders", {
      templateUrl: "views/my-orders.html",
      controller: "MyOrdersCtrl"
    })
    .when("/chat", {
      templateUrl: "views/chat.html",
      controller: "ChatCtrl"
    })
    // ❌ FALLBACK
    .otherwise({
      redirectTo: "/home"
    })
    //order side
    .when("/order/:id", {
      templateUrl: "views/order.html",
      controller: "OrderCtrl"
    })

    .when("/order-form/:id", {
      templateUrl: "views/order-form.html",
      controller: "OrderCtrl"
    })

    .when("/order-success", {
      templateUrl: "views/order-success.html"
    })




    // seller
    .when("/seller", {
      templateUrl: "views/seller-dashboard.html",
      controller: "SellerDashboardCtrl"
    })



    .when("/sell", {
      templateUrl: "views/seller-info.html",
      controller: "SellerCtrl"
    })

    //admin
    .when("/admin/login", {
      templateUrl: "views/admin-login.html",
      controller: "AdminLoginCtrl"
    })

    .when("/admin", {
      templateUrl: "views/admin-dashboard.html",
      controller: "AdminDashboardCtrl"
    })


    // my order
    .when("/my-orders", {
      templateUrl: "views/my-orders.html",
      controller: "MyOrdersCtrl"
    })


});
