angular.module('app').controller('orderDetailsCtl',function($state,$rootScope,apiService){
    var vm = this;
	$rootScope.disableScroll = false;

    apiService.upload($rootScope.finalCroppedImageData).then(function (data) {
        $rootScope.order.key = data.key;
    });

    vm.goToCheckout = function(){
        if ($rootScope.order.TOC == true) {
            $state.go('app.checkout');
        }
    };
    
});        