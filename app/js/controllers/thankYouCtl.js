
angular.module('app').controller('thankYouCtl',function(message,$rootScope,$state){
    var vm = this;

    vm.close = function(){
        message('close');
        window.close();
    };    
    
    vm.goToShopView = function() {
        $rootScope.coupon = undefined;
        $state.go('app.shop');
    };

});