angular.module('app').controller('previewCtl',function($state,$rootScope,$scope){
    var vm = this;
    $rootScope.disableScroll = false;
    $scope.finalStep = false
    console.log($rootScope.category.products);
    $scope.selectedProduct = $rootScope.category.products[0];
    vm.goToEdit = function() {
        $state.go('app.edit');
    }

    vm.goToOrderDetails = function() {
    	$scope.finalStep = true;
        //$state.go('app.orderDetails');
    }

    $scope.$watch("selectedProduct",function(){
    	$rootScope.currentProduct =  $scope.selectedProduct;
    })
});