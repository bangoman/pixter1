angular.module('app').controller('previewCtl',function($state,$rootScope,$scope,$q,$stateParams){
    var vm = this;
    $rootScope.disableScroll = false;
    $scope.finalStep = false;
    $scope.bsf = false;
    $scope.tmbWidth  = $rootScope.screenW * 0.67; 
    $scope.productsToDisplay = [];
    $scope.productsToDisplayOriginal = [];    
    $scope.productsToDisplayRotated = [];       
    if($scope.tmbWidth > 320){
    	$scope.tmbWidth = 320;
    }

    $scope.displayDropdown = !$rootScope.previewCatalogParams.previewCatalog;
    $scope.selectedProduct = $rootScope.currentProduct;
    $scope.chosenProduct = $scope.selectedProduct;

    // selectedProduct : the final product after rotation calculation (AKA the output product).
    // chosenProduct : the product user selected in the options menu, without the rotation or not.

/*    for (var i = 0; i < $rootScope.category.products.length; i++) {
        if ($rootScope.category.products[i].rotate) {
            if ($rootScope.category.products[i].rotate[0] == $rootScope.category.products[i].id) {
                $scope.productsToDisplayOriginal.push($rootScope.category.products[i]);
            }   
        }
        else{
            $scope.productsToDisplayOriginal.push($rootScope.category.products[i]);
        }
    }

    for (var i = 0; i < $rootScope.category.products.length; i++) {
        if ($rootScope.category.products[i].rotate) {
            if ($rootScope.category.products[i].rotate[1] == $rootScope.category.products[i].id) {
                $scope.productsToDisplayRotated.push($rootScope.category.products[i]);
            }   
        }
    }*/

    $scope.productsToDisplay = $rootScope.category.products;
    if ($scope.displayDropdown) {
        $scope.$watch("chosenProduct",function(){
            $scope.selectedProduct = $scope.chosenProduct;
            $rootScope.dpiAproved = true;
            $scope.getFinalPrice()
            if($rootScope.currentProduct.rotate_product){
                $scope.setLandscapeOrPortrait();
            }            
        });
    }



   $scope.windowArea = parseInt($scope.chosenProduct.size_width) * parseInt($scope.chosenProduct.size_height);
    $scope.setLandscapeOrPortrait = function(){
        $scope.productsToDisplayPortrait = [];
        $scope.productsToDisplayLandscape = [];
        for (var i = 0 ; i <= $rootScope.category.products.length - 1; i++) {
            if (parseInt($rootScope.category.products[i].size_width) <= parseInt($rootScope.category.products[i].size_height)){
                $scope.productsToDisplayPortrait.push($rootScope.category.products[i]);     
            }
            if (parseInt($rootScope.category.products[i].size_width) >= parseInt($rootScope.category.products[i].size_height)){
                $scope.productsToDisplayLandscape.push($rootScope.category.products[i]);     
            }                
        };
        $scope.chooseLandscapeOrPortrait();           
    }

    $scope.chooseLandscapeOrPortrait = function(){
        if (parseInt($scope.chosenProduct.size_width) <= parseInt($scope.chosenProduct.size_height)){
            $scope.productsToDisplay = $scope.productsToDisplayPortrait;
        }
        else if (parseInt($scope.chosenProduct.size_width) >= parseInt($scope.chosenProduct.size_height)){
            $scope.productsToDisplay = $scope.productsToDisplayLandscape;
        }
    }
    if($rootScope.currentProduct.rotate_product){
        $scope.setLandscapeOrPortrait();
    }


    $scope.getFinalPrice = function(){
        if (!$rootScope.currentProduct.params){
            $scope.selectedProduct.finalPrice = $scope.chosenProduct.quantities[0].pricing;
        }
    }
    $scope.getFinalPrice();

    $scope.changeBackSideFlag = function(ifBackSide){
        $scope.bsf = ifBackSide;
    }

    $scope.findRotatedProduct = function (productId){
        for (var i = $rootScope.category.products.length - 1; i >= 0; i--) {
            if ($rootScope.category.products[i].id == productId){
                 $scope.chosenProduct = $rootScope.category.products[i];
                return;
            };
        };
    };
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
            if ($rootScope.category.products[i].id == pidToSearch) {                
                $scope.selectedProduct = $rootScope.category.products[i];
            }
        }

    }
    vm.goToEdit = function() {
        $state.go('app.edit');
    };

    vm.goToOrderDetails = function() {
    	$scope.finalStep = true;
        $rootScope.currentProduct = $scope.chosenProduct;
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