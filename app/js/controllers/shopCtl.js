angular.module('app').controller('shopCtl', function ($state, $http, $rootScope,$stateParams,$scope) {
    var vm = this;
    window.$state = $state;
    $rootScope.screenW = document.body.clientWidth;
    $rootScope.disableScroll = false;
    $rootScope.previewCatalogParams = $stateParams;
     if($rootScope.productsData){
        $scope.categories = $rootScope.productsData.objects;
     }
    $scope.$on("productArrive",function(){
        $scope.categories = $rootScope.productsData.objects;
    });

    vm.goToPreview = function (category) {
        if(category.subcategories){
            $scope.categories = category.subcategories.objects;
            console.log("subcategories1",$rootScope.productsData.objects.subcategories);
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