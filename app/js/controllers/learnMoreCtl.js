angular.module('app').controller('learnMoreCtl', function ($uibModalInstance, $rootScope) {
    var vm = this;
    vm.close = function () {
        if( $rootScope.productsData.localization.currency.code !== vm.currencyCode ){
            $rootScope.setCurrency(vm.currencyCode);
        }
        $uibModalInstance.close();
    };
    vm.dismiss = $uibModalInstance.dismiss;

    vm.currencyCode = $rootScope.productsData.localization.currency.code;
});