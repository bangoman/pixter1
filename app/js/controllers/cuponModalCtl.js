angular.module('app').controller('cuponModalCtl', function ($uibModalInstance, apiService, $rootScope) {
    var vm = this;

    vm.close = $uibModalInstance.close;
    vm.dismiss = $uibModalInstance.dismiss;
    vm.successMessage = false;
    vm.apply = function () {
        return apiService
            .validateCoupon({
                product_id: $rootScope.currentProduct.id,
                coupon_string: vm.couponString,
                quantity:1,
            })
            .then(function (coupon) {
                vm.successMessage = "Congratulations, the coupon has been verified!";
                $rootScope.coupon = coupon;
                setTimeout(function(){
                    $uibModalInstance.close(coupon);
                }, 3000);
                
            },function(data){
               vm.error = data.error.message ;
            });
    }
});