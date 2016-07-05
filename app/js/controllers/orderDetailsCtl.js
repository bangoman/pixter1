angular.module('app').controller('orderDetailsCtl',function($state,$rootScope){
    var vm = this;
	$rootScope.disableScroll = false;
    vm.goToCheckout = function(){
        if ($rootScope.order.TOC == true) {
            $state.go('app.checkout');
        }
    }
});        