angular.module('app').controller('orderDetailsCtl',function($state,$rootScope,apiService,$scope,$http,$window){
    var vm = this;
    if(!$rootScope.order){
        $rootScope.order = {};
    }
    if (JSON.parse($window.localStorage.getItem("orderDetails"))) {
        $rootScope.order = JSON.parse($window.localStorage.getItem("orderDetails"));        
    }
	$rootScope.disableScroll = false;
	$scope.tmbWidth = $rootScope.screenW*0.35;
	if($scope.tmbWidth > 120){
		$scope.tmbWidth = 120

	}
    $scope.countryApi = 'http://ec2-52-201-250-90.compute-1.amazonaws.com:8000/api/v2/country/?user=demo';
    
    function getCountry () {
        $http.get($scope.countryApi)
        .then(function (res) {
            $rootScope.countries = res.data.objects;
            if(!$rootScope.order.country){  
                setDefaultCountry ();
            }
        }); 
    }

       getCountry();
  

    apiService.upload($rootScope.finalCroppedImageData).then(function (data) {
        $rootScope.order.key = data.key;
    });   

    function setDefaultCountry () {
        for (var i = $rootScope.countries.length - 1; i >= 0; i--) {
            if($rootScope.countries[i].id == 113){                
                $rootScope.order.country = $rootScope.countries[i];
            };
        };
    };

    vm.goToCheckout = function(){
        $window.localStorage.setItem("orderDetails", JSON.stringify($rootScope.order));
    	if (!vm.form.$valid) {
            $scope.showErrorMessage = true;
            setTimeout(function(){
                $scope.showErrorMessage = false;
                $scope.$apply()
            },5000);

    		return;
    	};
        if ($rootScope.order.TOC == true) {
            $state.go('app.checkout');
        }
    };
    
});        