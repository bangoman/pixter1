
angular.module('app').controller('thankYouCtl',function(message, $state){
    var vm = this;

    vm.close = function(){
        message('close');
        window.close();
    };    
    
    vm.goToShopView = function() {
        console.log('somthing happend');
        $state.go('app.shop');
    };

});