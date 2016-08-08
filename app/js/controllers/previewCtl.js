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
            $scope.getFinalPrice()
        });
    }


    $scope.setLandscapeOrPortrait = function(currentProductWidth,currentProductHeight){
        if(currentProductWidth <= currentProductHeight){
            console.log("1")
            $scope.productsToDisplay = [];
            for (var i = $rootScope.category.products.length - 1; i >= 0; i--) {
                if (parseInt($rootScope.category.products[i].size_width) <= parseInt($rootScope.category.products[i].size_height) && $scope.removeDoubles($rootScope.category.products[i]) ){
                console.log("2");
                    $scope.productsToDisplay.push($rootScope.category.products[i]);     
                }
            };            
        }else{
            for (var i = $rootScope.category.products.length - 1; i >= 0; i--) {
                if ($scope.removeDoubles($rootScope.category.products[i])){
                    console.log("3");
                    console.log("$scope.productsToDisplay2.5",$scope.productsToDisplay)
                    $scope.productsToDisplay.push($rootScope.category.products[i]);
                    
                }
            } 
            console.log("$rootScope.category.products2",$rootScope.category.products)
            console.log("$scope.productsToDisplay2",$scope.productsToDisplay)              
        }
    }
   
    $scope.removeDoubles = function(productI) {

        if ($scope.productsToDisplay.length == 0){
            console.log("4");
            return true
        }
        for (var i = $scope.productsToDisplay.length - 1; i >= 0; i--) {
        console.log("productI.shortname",productI.shortname);
        console.log("$scope.productsToDisplay",$scope.productsToDisplay);
            if (productI.shortname == $scope.productsToDisplay[i].shortname){
                console.log("5");
                return false;
            }else{
                console.log("6");
                return true;
            }
        };
    }    
    $scope.setLandscapeOrPortrait(parseInt($rootScope.currentProduct.size_width),parseInt($rootScope.currentProduct.size_height));

    $scope.getFinalPrice = function(){
        if (!$rootScope.currentProduct.params){
            $scope.selectedProduct.finalPrice = $scope.chosenProduct.quantities[0].pricing;
            console.log("$currentProduc",$rootScope.currentProduct);
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
        console.log("currentProduct",$rootScope.currentProduct);
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