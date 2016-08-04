angular.module('app').controller('shopCtl', function ($state, $http, $rootScope,$stateParams,$scope) {
    var vm = this;
    window.$state = $state;
    $scope.bannerRatio = 600/360;
    $scope.currentIndex = 0;
    $scope.correction  = 150;
    $rootScope.imageUrl = $rootScope.originalImageUrl;  
    console.log($state.params);

    ;
    if($rootScope.screenW > 600){
        $scope.bannerWidth = window.innerWidth - 30;
        $scope.bannerHeight = $scope.bannerWidth / $scope.bannerRatio;
    }else{
        $scope.bannerWidth = $rootScope.screenW;
        $scope.bannerHeight = $scope.bannerWidth / $scope.bannerRatio;
    }
    $scope.changeBanner = function(i){
        $scope.currentIndex += i;

    }
    $rootScope.screenW = document.body.clientWidth;
    $rootScope.disableScroll = false;
    $rootScope.previewCatalogParams = $stateParams;
     if($rootScope.productsData){
        if($rootScope.subcategories){    
            $scope.categories = $rootScope.subcategories;
            $rootScope.subcategories = null;

        }else{
            $scope.categories = $rootScope.productsData.objects;    
        }
        
     }
    $scope.$on("productArrive",function(){
        $scope.categories = $rootScope.productsData.objects;
    });

    vm.goToPreview = function (category) {
        if(category.subcategories){
            $rootScope.subcategories  = category.subcategories.objects;             
            $state.go('app.shop',{subcategories:true})            
        }
        else
        {
            $rootScope.category = category;
            $rootScope.currentProduct = category.products[0];
            
            if ($rootScope.previewCatalogParams.previewCatalog) {
                $state.go('app.previewCatalog');
            }
            else{
                $state.go('app.preview');
            }
                 
        }


    }
});