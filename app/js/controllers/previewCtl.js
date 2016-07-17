angular.module('app').controller('previewCtl',function($state,$rootScope,$scope,$q,$stateParams){
    var vm = this;
    $rootScope.disableScroll = false;
    $scope.finalStep = false;
   // console.log($rootScope.category.products);
    $scope.tmbWidth  = $rootScope.screenW * 0.67; 
    $scope.productsToDisplay = [];
    $scope.productsToDisplayOriginal = [];    
    $scope.productsToDisplayRotated = [];    
    $scope.productsArrayForNames = $rootScope.category.products;
    if($scope.tmbWidth > 300){
    	$scope.tmbWidth = 300;
    }
    $scope.displayDropdown = !$rootScope.previewCatalogParams.previewCatalog;
    
   // console.log($scope.displayDropdown);
   // console.log("product",$rootScope.currentProduct);
    $scope.selectedProduct = $rootScope.currentProduct;
    console.log("selected product",$scope.selectedProduct)

    // selectedProduct : the final product after rotation calculation (AKA the output product).
    // chosenProduct : the product user selected in the options menu, without the rotation or not.

    for (var i = 0; i < $rootScope.category.products.length; i++) {
        if ($rootScope.category.products[i].rotate) {
            if ($rootScope.category.products[i].rotate[0] == $rootScope.category.products[i].pid) {
                $scope.productsToDisplayOriginal.push($rootScope.category.products[i]);
            }   
        }
        else{
            $scope.productsToDisplayOriginal.push($rootScope.category.products[i]);
        }
    }

    for (var i = 0; i < $rootScope.category.products.length; i++) {
        if ($rootScope.category.products[i].rotate) {
            if ($rootScope.category.products[i].rotate[1] == $rootScope.category.products[i].pid) {
                $scope.productsToDisplayRotated.push($rootScope.category.products[i]);
            }   
        }
    }

    $scope.productsToDisplay = $scope.productsToDisplayOriginal;
    if ($scope.displayDropdown) {
    $scope.$watch("chosenProduct",function(){
        $scope.selectedProduct =  $scope.chosenProduct;
    });
}


    $scope.chosenProduct = $scope.productsToDisplay[0];

    vm.rotateProduct = function(){
        var index = $scope.productsToDisplay.indexOf($scope.chosenProduct);
        if ($scope.selectedProduct.rotate[0] == $scope.selectedProduct.pid){
            var pidToSearch = $scope.selectedProduct.rotate[1];
            $scope.productsToDisplay = $scope.productsToDisplayRotated;
            $scope.chosenProduct = $scope.productsToDisplay[index];
        }
        else{
            var pidToSearch = $scope.selectedProduct.rotate[0];
            $scope.productsToDisplay = $scope.productsToDisplayOriginal;
            $scope.chosenProduct = $scope.productsToDisplay[index];

        }
        for (var i = 0; i < $rootScope.category.products.length; i++) {
            if ($rootScope.category.products[i].pid == pidToSearch) {                
                $scope.selectedProduct = $rootScope.category.products[i];
            }
        }
        // $scope.productsToDisplay[index] = $scope.selectedProduct;

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
        console.log("selected product",$scope.selectedProduct)
    	$rootScope.currentProduct =  $scope.selectedProduct;
    });

    
});