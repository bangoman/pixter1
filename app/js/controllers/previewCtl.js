angular.module('app').controller('previewCtl',function($state,$rootScope,$scope,$q){
    var vm = this;
    $rootScope.disableScroll = false;
    $scope.finalStep = false
    console.log($rootScope.category.products);
    $scope.selectedProduct = $rootScope.category.products[0];
    vm.goToEdit = function() {
        $state.go('app.edit');
    };

    vm.goToOrderDetails = function() {
    	$scope.finalStep = true;
        var unbind = $scope.$watch(function () {
           return $rootScope.finalCroppedImageData; 
        },function () {
            if( $rootScope.finalCroppedImageData ){
                $state.go('app.orderDetails');
                unbind();
            }
        });
    };

    $scope.$watch("selectedProduct",function(){
    	$rootScope.currentProduct =  $scope.selectedProduct;
    });

    
});