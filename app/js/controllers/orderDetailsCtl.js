angular.module('app').controller('orderDetailsCtl',function($state,$rootScope){
    var vm = this;

    vm.goToCheckout = function(){
        if ($rootScope.order.TOC == true) {
            $state.go('app.checkout');
        }
    }
});        