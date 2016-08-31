angular.module('app').controller('cuponModalCtl', function ($uibModalInstance, apiService, $rootScope,$timeout) {
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
                $timeout($rootScope.CouponMarketingString = coupon.marketing_string);                
                $rootScope.coupon = coupon;
                setTimeout(function(){
                    $uibModalInstance.close(coupon);
                }, 3000);
                
            },function(data){
               vm.error = data.error.message ;
            });
    }
});