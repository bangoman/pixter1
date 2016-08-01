angular.module('app').controller('sliderShopCtl',function($scope,$rootScope){
    var vm = this;
    $scope.bannerRatio = 600/360;
    $scope.currentIndex = 0;
    $scope.correction  = 49;
    ;
    if($rootScope.screenW > 600){
        $scope.bannerWidth = window.innerWidth;
        $scope.bannerHeight = $scope.bannerWidth / $scope.bannerRatio;
    }else{
        $scope.bannerWidth = $rootScope.screenW;
        $scope.bannerHeight = $scope.bannerWidth / $scope.bannerRatio;
    }
    $scope.changeBanner = function(i){
        $scope.currentIndex += i;

    }
    $scope.goToPreview = function(category){
        $rootScope.category = category;
        $rootScope.currentProduct = category.products[0];
       // $rootScope.currentProduct.priceObject = $rootScope.category.pricing.price[$rootScope.currentProduct.id];
        if ($rootScope.previewCatalogParams.previewCatalog) {
            $state.go('app.previewCatalog');
        }
        else{
        $state.go('app.preview');
        }


    }

});