angular.module('app').controller('previewCtl',function($state,$rootScope,$scope,$q,$stateParams,$timeout, formatPriceCurrency, productService){
    var vm = this;
    window.scrollTo(0,0);
    $rootScope.disableScroll = false;
    $rootScope.finalStep = false;
    $scope.bsf = false;
    $scope.first = true;
    $scope.tmbWidth  = $rootScope.screenW * 0.67; 
    $scope.productsToDisplay = [];
    $scope.productsToDisplayOriginal = [];    
    $scope.productsToDisplayRotated = [];

    /**
     * Send Event to Google analytics ecommerce
     * Event type: Viewed product
     */
    $timeout(function () {
        productService.sendGAEvent(true,'send', 'event', 'preview','preview impression','flow');
        productService.sendGA('detail');
    },1000);

    if($scope.tmbWidth > 320){
    	$scope.tmbWidth = 320;
    }

    $scope.isImageRotated = false;
    $scope.isLoading = false;
    $scope.displayDropdown = !$rootScope.previewCatalogParams.previewCatalog;
        
    $scope.imageToPreview = $rootScope.currentProduct.images['Preview'];
    vm.seeFullListOnMobile = false;
    $scope.productsToDisplay = $rootScope.category.products;
    $scope.windowArea = parseInt($rootScope.currentProduct.size_width) * parseInt($rootScope.currentProduct.size_height);

    $scope.priceCurrencyOrder = formatPriceCurrency;

    $scope.findRotatedProduct = function (productId){
        $scope.isLoading = true;
        $timeout(function() {$scope.isLoading = false;}, 1000);
        for (var i = $rootScope.category.products.length - 1; i >= 0; i--) {
            if ($rootScope.category.products[i].id == productId){
                 $rootScope.currentProduct = $rootScope.category.products[i];
                 $scope.imageToPreview = $rootScope.currentProduct.images['Preview'];
                return;
            };
        };
    };

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
        if (parseInt($rootScope.currentProduct.size_width) < parseInt($rootScope.currentProduct.size_height)){
            $scope.productsToDisplay = $scope.productsToDisplayPortrait;
        }
        else if (parseInt($rootScope.currentProduct.size_width) > parseInt($rootScope.currentProduct.size_height)){
            $scope.productsToDisplay = $scope.productsToDisplayLandscape;
        }
        else{
            $scope.productsToDisplay = $rootScope.category.products;
        }

    }

    //if($rootScope.currentProduct.rotate_product){
    $scope.setLandscapeOrPortrait();
   //}


    $scope.getBestMatchedOriantation = function(){
        if ($scope.currentProduct.rotate_product && $scope.currentProduct.rotate_product.length > 0) {
            var ratio1 = parseInt($rootScope.currentProduct.size_height) / parseInt($scope.currentProduct.size_width);
            var ratio2 = parseInt($rootScope.currentProduct.rotate_product[0].size_height) / parseInt($scope.currentProduct.rotate_product[0].size_width);
            var imageRatio = $rootScope.imageHeight / $rootScope.imageWidth;
            if (imageRatio >= 1 && ratio1 >= ratio2) {                

            }
            else if(!$rootScope.editToPreview){
                $scope.chooseLandscapeOrPortrait(); 
                $scope.findRotatedProduct($scope.currentProduct.rotate_product[0].id);
            }
        }
    }    
    $scope.getBestMatchedOriantation();
    
    $scope.rotateImage = function(){
        $scope.isLoading = true;
        $timeout(function() {$scope.isLoading = false;}, 100);
        if($rootScope.currentProduct.display.image_orientation == "rotate_images"){
            $rootScope.currentProduct.display.image_orientation = "images";

        }else{
            $rootScope.currentProduct.display.image_orientation = "rotate_images";
        }
        
//        $rootScope.currentProduct.rotate_images = rotatedTarget;
//        $rootScope.currentProduct.images = mainTarget;

    }

    $scope.getFinalPrice = function(){
        if (!$rootScope.currentProduct.params){
            $rootScope.currentProduct.finalPrice = $rootScope.currentProduct.quantities[0].pricing;
            
        }
    }
    $scope.getFinalPrice();
   


    $scope.changeBackSideFlag = function(ifBackSide){
        $scope.bsf = ifBackSide;
    }

    vm.goToEdit = function() {
        $state.go('app.edit');
        $rootScope.editModeOn = true;
    };

    vm.goToOrderDetails = function() {
    	$rootScope.finalStep = true;
    };

    if ($scope.displayDropdown) {
        $scope.$watch(function() {
            return $rootScope.currentProduct;
        }, function(current, original) {
            if($rootScope.currentProduct.rotate_product){
                //$scope.setLandscapeOrPortrait();
                $scope.chooseLandscapeOrPortrait(); 
            }                                        
            
            if(current !== original){
                $rootScope.finalStep = false;
                $rootScope.imageUrl = $rootScope.originalImageUrl;
                //$rootScope.dpiApproved = false;
                $scope.imageToPreview = $rootScope.currentProduct.images['Preview']; 
                $scope.getFinalPrice()  
            }
        });        
    }

    
});