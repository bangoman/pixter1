angular.module('app').controller('orderDetailsCtl',function($state,$rootScope,apiService,$scope){
    var vm = this;
	$rootScope.disableScroll = false;
	$scope.tmbWidth = $rootScope.screenW*0.35;
	if($scope.tmbWidth > 180){
		$scope.tmbWidth = 180

	}
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