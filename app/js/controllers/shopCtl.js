angular.module('app').controller('shopCtl', function ($state, $http, $rootScope,$stateParams) {
    var vm = this;
    window.$state = $state;
    $rootScope.screenW = document.body.clientWidth;
    $rootScope.disableScroll = false;
    $rootScope.imageUrl = "image.jpg";

    $rootScope.previewCatalogParams = $stateParams;

    vm.getProducts = function () {
        $http.get('app/json/products.json')
            .then(function (res) {
                vm.productsData = res.data;
                $rootScope.productsData = res.data;
 
            }).then(function () {
        });
        $http.get('app/json/pricing.json')
            .then(function (res) {
                $rootScope.prices = res.data;
            }).then(function () {
            console.log('res data ',res.data);
        });
            $http.get('app/json/branding_default.json')
            .then(function (res) {
                $rootScope.branding = res.data;

            }).then(function () {
            console.log($rootScope.branding.marketingData.ossData , "branding");
        });

    };

//    vm.getProducts();

    vm.goToPreview = function (category) {
        $rootScope.category = category;
        $rootScope.currentProduct = category.products[0];
        
        if ($rootScope.previewCatalogParams.previewCatalog) {
            $state.go('app.previewCatalog');
        }
        else{
        $state.go('app.preview');
        }
    }
});