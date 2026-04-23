app.controller("SellerCtrl",function($scope,$location){

$scope.seller={};

$scope.saveSeller=function(){

 if(!$scope.seller.name || !$scope.seller.phone){
   alert("Fill all fields");
   return;
 }

 localStorage.setItem("seller",JSON.stringify($scope.seller));

 $location.path("/add-product");
};

});
