angular.module('app').controller('previewCtl',function($state,$rootScope,$scope,$q,$stateParams,$timeout){
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
    $scope.isImageRotated = false;
    $scope.isLoading = false;
    $scope.displayDropdown = !$rootScope.previewCatalogParams.previewCatalog;
    $scope.selectedProduct = $rootScope.currentProduct;
    $scope.chosenProduct = $scope.selectedProduct;
    $scope.imageToPreview = $rootScope.currentProduct.images['Preview'];
    vm.seeFullListOnMobile = false;
    console.log($rootScope.category);

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
            $scope.imageToPreview = $scope.selectedProduct.images['Preview'];            
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
        $scope.getBestMatchedOriantation();
          
    }

    $scope.getBestMatchedOriantation = function(){
        if ($scope.currentProduct.rotate_product && $scope.currentProduct.rotate_product.length > 0) {
            var ratio1 = parseInt($scope.currentProduct.size_height) / parseInt($scope.currentProduct.size_width);
            var ratio2 = parseInt($scope.currentProduct.rotate_product[0].size_height) / parseInt($scope.currentProduct.rotate_product[0].size_width);
            var imageRatio = $rootScope.imageHeight / $rootScope.imageWidth;
            if (imageRatio >= 1 && ratio1 >= ratio2) {


            }
            else{
                $scope.selectedProduct = $scope.currentProduct.rotate_product[0];
                $scope.imageToPreview = $scope.currentProduct.rotate_product[0].images['Preview'];                
                console.log(" $scope.selectedProduct", $scope.imageToPreview)
            }
        }
    }
   // $scope.getBestMatchedOriantation();

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

    $scope.rotateImage = function(){
        $scope.isLoading = true;
        $timeout(function() {$scope.isLoading = false;}, 1000);

        console.log("rotateImage called");
        if ($scope.isImageRotated) {
            $scope.isImageRotated = false;
            $scope.imageToPreview = $rootScope.currentProduct.images['Preview'];
        }
        else{
            $scope.isImageRotated = true;
            $scope.imageToPreview = $rootScope.currentProduct.rotate_images['Preview'];
        }
        console.log($scope.imageToPreview);
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
        $scope.isLoading = true;
        $timeout(function() {$scope.isLoading = false;}, 1000);
        for (var i = $rootScope.category.products.length - 1; i >= 0; i--) {
            if ($rootScope.category.products[i].id == productId){
                 $scope.chosenProduct = $rootScope.category.products[i];
                 $scope.imageToPreview = $scope.chosenProduct.images['Preview'];
                return;
            };
        };
    };
    vm.rotateProduct = function(){
        console.log($scope.productsToDisplay);
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
        console.log($scope.chosenProduct);
    }
    vm.goToEdit = function() {
        $state.go('app.edit');
        $rootScope.editModeOn = true;
    };

    vm.goToOrderDetails = function() {
    	$scope.finalStep = true;
        $rootScope.currentProduct = $scope.chosenProduct;
        if($rootScope.finalCroppedImageData && !$rootScope.dpiNotAproved){
            $state.go('app.orderDetails');
        }
        var unbind = $scope.$watch(function () {
           return $rootScope.finalCroppedImageData; 
        },function () {
            if($rootScope.finalCroppedImageData && !$rootScope.dpiNotAproved){
                $state.go('app.orderDetails');
                unbind();
            }
        });
    };

    $scope.$watch("selectedProduct",function(){
        if($scope.chosenProduct !== $rootScope.currentProduct && $scope.chosenProduct !== undefined){
            $rootScope.dpiNotAproved = true
        }
    	$rootScope.currentProduct =  $scope.selectedProduct;
    });

    
});