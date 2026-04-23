app.controller("HomeCtrl",function($scope,$http){

$scope.products=[];

$http.get("http://localhost:5000/api/products")
.then(function(res){
    $scope.products=res.data;
})

});
