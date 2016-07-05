angular.module('app').controller('orderDetailsCtl',function($state,$rootScope,apiService){
    var vm = this;
    vm.test = "yo";
	$rootScope.disableScroll = false;

    apiService.upload($rootScope.finalCroppedImageData).then(function (data) {
        $rootScope.order.key = data.key;
    });

    vm.goToCheckout = function(){
    	if (!vm.form.$valid) {
    		return;
    	};
        if ($rootScope.order.TOC == true) {
            $state.go('app.checkout');
        }
    };
    
});        