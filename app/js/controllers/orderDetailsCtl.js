angular.module('app').controller('orderDetailsCtl',function($state,$rootScope,apiService,$scope,$http){
    var vm = this;
	$rootScope.disableScroll = false;
	$scope.tmbWidth = $rootScope.screenW*0.35;
	if($scope.tmbWidth > 180){
		$scope.tmbWidth = 180

	}
    $scope.countryApi = 'http://ec2-52-201-250-90.compute-1.amazonaws.com:8000/api/v2/country/?user=demo';
    
    function getCountry () {
        $http.get($scope.countryApi)
            .then(function (res) {
             $rootScope.countries = res.data.objects;
            }); 
    }  
    getCountry();

    
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