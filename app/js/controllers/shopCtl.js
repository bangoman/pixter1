angular.module('app').controller('shopCtl', function ($state, $http, $rootScope) {
    var vm = this;
    window.$state = $state;
    $rootScope.imageUrl = "image.jpg";
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

    };

    vm.getProducts();

    vm.goToPreview = function (category) {
        $rootScope.category = category;
        $rootScope.currentProduct = category.products[0];
        $rootScope.currentProduct.priceObject = $rootScope.prices.products[$rootScope.currentProduct.pid];
        $state.go('app.preview');
    }
});