angular.module('app').controller('learnMoreCtl', function ($uibModalInstance, $rootScope) {
    var vm = this;
    vm.close = function () {
        var currencyChanged = $rootScope.productsData.localization.currency.code !== vm.currencyCode;
        var langChanged = $rootScope.productsData.localization.language !== vm.lang;
        $rootScope.currencyCode = vm.currencyCode;
        $rootScope.lang = vm.lang;
        if( currencyChanged ){
            pLoader.setCurrency(vm.currencyCode);
        }
        if( currencyChanged || langChanged ){
            $rootScope.reload();
        }
        $uibModalInstance.close();
    };
    vm.dismiss = $uibModalInstance.dismiss;

    vm.currencyCode = $rootScope.productsData.localization.currency.code;
    vm.lang = $rootScope.productsData.localization.language;
});