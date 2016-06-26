angular.module('app').controller('orderDetailsCtl',function($state){
    var vm = this;

    vm.termsAgreed = false;

    vm.goToCeckout = function(){
        if (vm.termsAgreed == true) {
            $state.go('app.checkout');
        }
    }
});        