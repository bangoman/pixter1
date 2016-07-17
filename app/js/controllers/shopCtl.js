angular.module('app').controller('shopCtl', function ($state, $http, $rootScope,$stateParams) {
    var vm = this;
    window.$state = $state;
    $rootScope.screenW = document.body.clientWidth;
    $rootScope.disableScroll = false;
    $rootScope.imageUrl = "image.jpg";

    $rootScope.previewCatalogParams = $stateParams;
    console.log($stateParams);

    vm.getProducts = function () {
        $http.get('app/json/products.json')
            .then(function (res) {
                vm.productsData = res.data;
                $rootScope.productsData = res.data;
            }).then(function () {
            console.log('vm.products = ', vm.products);
        });
        $http.get('app/json/pricing.json')
            .then(function (res) {
                $rootScope.prices = res.data;
            }).then(function () {
            console.log('vm.products = ', vm.products);
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
        $http.get($rootScope.baseApi + '/api/v2/product/preview?user=demo&product_id=' +  category.next.storestage.id)
            .then(function (res) {
                console.log(res);
                $rootScope.currentProduct = res.data;        
                console.log($rootScope.products,"!!!!!!!");
            });        
        
        if ($rootScope.previewCatalogParams.previewCatalog) {
            $state.go('app.previewCatalog');
        }
        else{
        $state.go('app.preview');
        }
    }
});