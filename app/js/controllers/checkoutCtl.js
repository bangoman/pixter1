angular.module('app').controller('checkoutCtl',function($uibModal,$rootScope){
    var vm = this;

    vm.shipmentMethod = $rootScope.currentProduct.priceObject.shipping.US[0];

    vm.openCuponModal = function(){
        $uibModal.open({
            templateUrl: 'app/views/cupon_modal.html',
            controller: 'cuponModalCtl as vm',
            backdrop:'static',
        });
    };

    vm.getDiscountProductPrice = function () {
        return $rootScope.coupon ? $rootScope.currentProduct.priceObject.price * $rootScope.coupon.product_discount / 100 : parseFloat($rootScope.currentProduct.priceObject.price);
    };

    vm.getDiscountShoppingPrice = function () {
        return $rootScope.coupon ? vm.shipmentMethod.price * $rootScope.coupon.shipping_discount / 100 : parseFloat(vm.shipmentMethod.price);
    };

    vm.getTotal = function () {
        return vm.getDiscountProductPrice() + vm.getDiscountShoppingPrice();
    };
    
    vm.getSaving = function () {
        return parseFloat(vm.shipmentMethod.price) + parseFloat($rootScope.currentProduct.priceObject.price) - vm.getTotal();
    }
});