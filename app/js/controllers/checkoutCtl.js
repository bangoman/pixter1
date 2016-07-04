angular.module('app').controller('checkoutCtl', function ($uibModal, $rootScope,apiService) {
    var vm = this;

    vm.shipmentMethod = $rootScope.currentProduct.priceObject.shipping.US[0];

    vm.openCuponModal = function () {
        $uibModal.open({
            templateUrl: 'app/views/cupon_modal.html',
            controller: 'cuponModalCtl as vm',
            backdrop: 'static',
        });
    };

    vm.getDiscountProductPrice = function () {
        return $rootScope.coupon ? $rootScope.currentProduct.priceObject.price * (100 - $rootScope.coupon.product_discount) / 100 : parseFloat($rootScope.currentProduct.priceObject.price);
    };

    vm.getDiscountShippingPrice = function () {
        return $rootScope.coupon ? vm.shipmentMethod.price * (100 - $rootScope.coupon.shipping_discount ) / 100 : parseFloat(vm.shipmentMethod.price);
    };

    vm.getTotal = function () {
        return vm.getDiscountProductPrice() + vm.getDiscountShippingPrice();
    };

    vm.getSaving = function () {
        return parseFloat(vm.shipmentMethod.price) + parseFloat($rootScope.currentProduct.priceObject.price) - vm.getTotal();
    };

    vm.checkout = function (paymentType) {
        return apiService.validateOrder(angular.extend({
            price:vm.getDiscountProductPrice(),
            curr:'USD',
            quantity:1,
            shipping_method: vm.shipmentMethod.id,
            shipping_price:vm.getDiscountShippingPrice(),
            payment_type:paymentType,
            key:'93934b52adbf7fab23579391cd7e891d.jpg',
            coupon_string: $rootScope.coupon.coupon_code.replace(/'/g,'')
        },$rootScope.order));
    };
});