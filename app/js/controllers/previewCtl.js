angular.module('app').controller('previewCtl',function($state,$rootScope,$scope){
    var vm = this;

    console.log($rootScope.category.products);
    $scope.selectedProduct = $rootScope.category.products[0];
    vm.goToEdit = function() {
        $state.go('app.edit');
    }

    vm.goToOrderDetails = function() {
        $state.go('app.orderDetails');
    }

    $scope.$watch("selectedProduct",function(){

    	$rootScope.currentProduct =  $scope.selectedProduct;
    })
});