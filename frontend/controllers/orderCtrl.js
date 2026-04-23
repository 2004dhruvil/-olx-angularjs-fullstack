app.controller("OrderCtrl", function ($scope, $routeParams, $location, $http, $timeout, $sce, ProductService) {

  const productId = $routeParams.id;
  let widgetId = null;

  // --- reCAPTCHA logic ---
  $timeout(function () {
    if (typeof grecaptcha !== 'undefined' && document.getElementById('recaptcha-container')) {
      widgetId = grecaptcha.render('recaptcha-container', {
        'sitekey': '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
      });
    }
  }, 500);

  // --- Text CAPTCHA logic ---
  $scope.captchaSvg = "";
  let correctCaptchaText = "";

  $scope.refreshCaptcha = function () {
    $http.get("http://localhost:5000/api/captcha/generate")
      .then(function (res) {
        $scope.captchaSvg = $sce.trustAsHtml(res.data.data);
        correctCaptchaText = res.data.text;
        $scope.order.captchaInput = ""; // Clear previous input
      })
      .catch(function (err) {
        console.error("Error fetching captcha", err);
      });
  };

  // Initial fetch
  $scope.refreshCaptcha();

  ProductService.getProducts().then(function (res) {
    $scope.product = res.data.find(p => p._id == productId);
    if (!$scope.product) {
      console.error("Product not found with ID:", productId);
      alert("Product not found!");
      $location.path("/");
    }
  });

  $scope.order = {
    paymentMethod: 'COD' // Default
  };

  $scope.qpayVisible = false;
  $scope.qrCodeUrl = "";

  $scope.showQPay = function() {
    $scope.qpayVisible = true;
    // Generate a random QR code using a public API
    const randomId = Math.random().toString(36).substring(7);
    $scope.qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=OLX-PAY-" + randomId;
    $scope.order.paymentMethod = "Qpay";
  };

  $scope.goToOrderForm = function () {
    $location.path('/order-form/' + productId);
  };

  $scope.placeOrder = function () {
    if (!$scope.order.name || !$scope.order.email || !$scope.order.address || !$scope.order.phone || !$scope.order.captchaInput) {
      alert("Please fill all fields including Email");
      return;
    }

    // 1. Verify reCAPTCHA Checkbox
    const captchaResponse = (widgetId !== null) ? grecaptcha.getResponse(widgetId) : "";
    if (!captchaResponse) {
      alert("Please complete the 'I'm not a robot' check");
      return;
    }

    // 2. Verify Text CAPTCHA (Frontend check for better UX)
    if ($scope.order.captchaInput.toLowerCase() !== correctCaptchaText.toLowerCase()) {
      alert("Incorrect letters entered. Please try again.");
      $scope.refreshCaptcha();
      return;
    }

    // Buyer should be the logged-in user if available, otherwise the form name
    const buyerAccount = localStorage.getItem("username");
    const buyerName = buyerAccount ? buyerAccount : $scope.order.name;

    if (!$scope.product) {
      alert("Cannot place order: Product data missing.");
      return;
    }

    const orderData = {
      productId: $scope.product._id,
      buyer: buyerName, 
      seller: $scope.product.seller,
      price: $scope.product.price,
      shippingAddress: {
        name: $scope.order.name,
        email: $scope.order.email,
        address: $scope.order.address,
        phone: $scope.order.phone
      },
      captchaToken: captchaResponse,
      textCaptchaInput: $scope.order.captchaInput,
      expectedCaptchaText: correctCaptchaText,
      paymentMethod: $scope.order.paymentMethod
    };

    console.log("SENDING ORDER:", orderData);

    $http.post("http://localhost:5000/api/orders", orderData)
      .then(function (res) {
        console.log("Order placed success:", res.data);
        alert("Order placed successfully!");
        $location.path("/order-success");
      })
      .catch(function (err) {
        console.error("Order error", err);
        alert("Failed to place order: " + (err.data ? err.data.message : err.statusText));
        $scope.refreshCaptcha(); // Refresh captcha on failure
      });
  };

});
