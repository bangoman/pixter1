angular.module('app').controller('cuponModalCtl', function ($uibModalInstance, apiService, $rootScope) {
    var vm = this;

    vm.close = $uibModalInstance.close;
    vm.dismiss = $uibModalInstance.dismiss;

    vm.apply = function () {
        return apiService
            .validateCoupon({
                product_id: $rootScope.currentProduct.id,
                coupon_string: vm.couponString,
                quantity:1,
            })
            .then(function (coupon) {
                $rootScope.coupon = coupon;
                $uibModalInstance.close(coupon);
            });
    }
});