app.controller("AdminDashboardCtrl", function ($scope, ProductService, UserService) {

  // CURRENT ADMIN INFO (from localStorage)
  $scope.currentAdmin = {
    name: localStorage.getItem("username") || "Admin",
    role: localStorage.getItem("role") || "admin"
  };

  // DASHBOARD STATS
  $scope.stats = {
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    soldProducts: 0,
    totalOrders: 0
  };

  function updateStats() {
    $scope.stats.totalUsers = ($scope.users || []).length;
    $scope.stats.totalSellers = ($scope.sellers || []).length;
    $scope.stats.totalProducts = ($scope.products || []).length;
    $scope.stats.soldProducts = ($scope.products || []).filter(function (p) {
      return p.status === "sold";
    }).length;
    $scope.stats.totalOrders = ($scope.orders || []).length;
  }

  // LOAD USERS
  function loadUsers() {
    UserService.getUsers().then(function (res) {
      $scope.users = res.data;
      updateStats();
    });
  }
  loadUsers();

  // SELLERS (will be derived from products)
  $scope.sellers = [];

  // load orders from API
  function loadOrders(startDate, endDate) {
    // $http inject
    const $http = angular.element(document.body).injector().get('$http');
    let url = "http://localhost:5000/api/orders";

    if (startDate && endDate) {
      url += "?startDate=" + startDate + "&endDate=" + endDate;
    }

    $http.get(url)
      .then(function (res) {
        $scope.orders = res.data;
        updateStats();
      })
      .catch(function (err) {
        console.error("Error loading orders", err);
      });
  }
  loadOrders();

  // Initialize Date Picker
  setTimeout(function () {
    flatpickr("#orderDatePicker", {
      mode: "range",
      dateFormat: "Y-m-d",
      onClose: function (selectedDates, dateStr, instance) {
        if (selectedDates.length === 2) {
          const start = instance.formatDate(selectedDates[0], "Y-m-d");
          const end = instance.formatDate(selectedDates[1], "Y-m-d");
          $scope.$apply(function () {
            loadOrders(start, end);
          });
        }
      }
    });
  }, 500);

  $scope.clearDateFilter = function () {
    const picker = document.querySelector("#orderDatePicker")._flatpickr;
    if (picker) {
      picker.clear();
    }
    loadOrders();
  };

  $scope.refreshOrders = function () {
    const picker = document.querySelector("#orderDatePicker")._flatpickr;
    if (picker && picker.selectedDates.length === 2) {
      const start = picker.formatDate(picker.selectedDates[0], "Y-m-d");
      const end = picker.formatDate(picker.selectedDates[1], "Y-m-d");
      loadOrders(start, end);
    } else {
      loadOrders();
    }
    alert("Orders refreshed!");
  };

  // LOAD PRODUCTS AND BUILD SELLERS LIST
  ProductService.getProducts().then(function (res) {
    $scope.products = res.data;

    // derive unique sellers from products
    var sellerMap = {};
    $scope.sellers = [];
    $scope.products.forEach(function (p) {
      if (p.seller && !sellerMap[p.seller]) {
        sellerMap[p.seller] = true;
        $scope.sellers.push({ name: p.seller });
      }
    });

    updateStats();
  });

  // Initial stats (in case there is data in localStorage)
  updateStats();

  // DELETE USER (via backend)
  $scope.deleteUser = function (user) {
    if (confirm("Delete this user?")) {
      UserService.deleteUser(user._id).then(function () {
        $scope.users = $scope.users.filter(function (u) {
          return u._id !== user._id;
        });
        updateStats();
      });
    }
  };

  // DELETE SELLER (UI only – derived from products)
  $scope.deleteSeller = function (i) {
    if (confirm("Hide this seller from list?")) {
      $scope.sellers.splice(i, 1);
      updateStats();
    }
  };

  // DELETE PRODUCT
  $scope.deleteProduct = function (id) {
    if (confirm("Delete product?")) {
      ProductService.deleteProduct(id).then(function () {
        $scope.products = $scope.products.filter(function (p) {
          return p._id !== id;
        });
        updateStats();
      });
    }
  };

  // DELETE ORDER
  $scope.deleteOrder = function (id) {
    const $http = angular.element(document.body).injector().get('$http');
    if (confirm("Are you sure you want to delete this order?")) {
      $http.delete("http://localhost:5000/api/orders/" + id)
        .then(function () {
          $scope.orders = $scope.orders.filter(function (o) {
            return o._id !== id;
          });
          updateStats();
        })
        .catch(function (err) {
          console.error("Error deleting order", err);
          alert("Failed to delete order");
        });
    }
  };

  // USER ORDER HISTORY MODAL
  $scope.showUserOrdersModal = false;
  $scope.selectedUserOrders = [];
  $scope.selectedUserName = "";

  $scope.viewUserOrders = function (userName) {
    $scope.selectedUserName = userName;
    $scope.selectedUserOrders = ($scope.orders || []).filter(function (o) {
      return o.buyer === userName;
    });
    $scope.showUserOrdersModal = true;
  };

  $scope.closeUserOrdersModal = function () {
    $scope.showUserOrdersModal = false;
    $scope.selectedUserOrders = [];
    $scope.selectedUserName = "";
  };

});
