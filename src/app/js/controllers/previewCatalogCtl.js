angular.module('app').controller('previewCatalogCtl',function($state,$rootScope,$scope,$q,$stateParams){
    var vm = this;
    $rootScope.disableScroll = false;
    $scope.finalStep = false;
    console.log($rootScope.category.products);
    $scope.tmbWidth  = $rootScope.screenW * 0.67; 
    $scope.productsToDisplay = [];
    $scope.productsArrayForNames = $rootScope.category.products;
    if($scope.tmbWidth > 300){
    	$scope.tmbWidth = 300;
    }

    if ($rootScope.category.products.length == 1) {
        $state.go('app.preview');
    }
    // selectedProduct : the final product after rotation calculation (AKA the output product).
    // chosenProduct : the product user selected in the options menu, without the rotation or not.
    console.log($rootScope.previewCatalogParams);

    for (var i = 0; i < $rootScope.category.products.length; i++) {
        if ($rootScope.category.products[i].rotate) {
            if ($rootScope.category.products[i].rotate[0] == $rootScope.category.products[i].pid) {
                $scope.productsToDisplay.push($rootScope.category.products[i]);
            }   
        }
        else{
            $scope.productsToDisplay.push($rootScope.category.products[i]);
        }
    }

    vm.goToPreview = function(product){
        $rootScope.currentProduct = product;
        $state.go('app.preview');
    };
    
});
