angular.module('app').controller('previewCtl',function($state,$rootScope,$scope,$q){
    var vm = this;
    $rootScope.disableScroll = false;
    $scope.finalStep = false;
    console.log($rootScope.category.products);
    $scope.tmbWidth  = $rootScope.screenW * 0.67; 
    $scope.productsToDisplay = [];

    if($scope.tmbWidth > 300){
    	$scope.tmbWidth = 300;
    }

    // selectedProduct : the final product after rotation calculation (AKA the output product).
    // chosenProduct : the product user selected in the options menu, without the rotation or not.

    for (var i = 0; i < $rootScope.category.products.length; i++) {
        if ($rootScope.category.products[i].rotate) {
            if ($rootScope.category.products[i].rotate[0] == $rootScope.category.products[i].pid) {
                $scope.productsToDisplay.push($rootScope.category.products[i]);
            }   
        }
        else{
            $scope.productsToDisplay.push($rootScope.category.products[i]);
        }
        // if there are no products with rotation ability then just make sure selectedProduct matches chosenProduct
        // if ($scope.productsToDisplay.length == $rootScope.category.products.length) { 
        // }
    }

    $scope.$watch("chosenProduct",function(){
        $scope.selectedProduct =  $scope.chosenProduct;
    });


    $scope.chosenProduct = $scope.productsToDisplay[0];

    vm.rotateProduct = function(){
        if ($scope.selectedProduct.rotate[0] == $scope.selectedProduct.pid){
            var pidToSearch = $scope.selectedProduct.rotate[1];
        }
        else{
            var pidToSearch = $scope.selectedProduct.rotate[0];
        }
        for (var i = 0; i < $rootScope.category.products.length; i++) {
            if ($rootScope.category.products[i].pid == pidToSearch) {
                $scope.selectedProduct = $rootScope.category.products[i];
            }
        }

    }
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
        console.log("selectedProduct",$scope.selectedProduct.pid);
    	$rootScope.currentProduct =  $scope.selectedProduct;
    });

    
});