angular.module('app').controller('orderDetailsCtl',function($state,$rootScope,apiService,$scope,$http,$window){
    var vm = this;
    window.scrollTo(0,0);
    if(!$rootScope.order){
        $rootScope.order = {state:"",address2:""};
    }
    if(!$rootScope.order.state){
        $rootScope.order.state = "";
    }
    if(!$rootScope.order.address2){
        $rootScope.order.address2 = "";
    }

    if (JSON.parse($window.localStorage.getItem("orderDetails"))) {
        $rootScope.order = JSON.parse($window.localStorage.getItem("orderDetails"));
        console.log($rootScope.order);
        $rootScope.order.country = $rootScope.countries.filter(function (country) {
            return $rootScope.order.country.code === country.code;
        })[0];        
    }
	$rootScope.disableScroll = false;
	$scope.tmbWidth = $rootScope.screenW*0.35;
	if($scope.tmbWidth > 120){
		$scope.tmbWidth = 120

	}
 /*   $scope.countryApi = 'http://ec2-52-201-250-90.compute-1.amazonaws.com:8000/api/v2/country/?user=demo';
    
    function getCountry () {
        $http.get($scope.countryApi)
        .then(function (res) {
            $rootScope.countries = res.data.objects;
            console.log("$rootScope.countries2",$rootScope.countries);
            console.log("$rootScope.order.country2",$rootScope.order.country);    
            if(!$rootScope.order.country){
                setDefaultCountry ();
            }
              

        }); 
    }
    getCountry(); */

    apiService.upload($rootScope.finalCroppedImageData).then(function (data) {
        $rootScope.orderKey = data.key;
    });
       

    function setDefaultCountry () {
        for (var i = $rootScope.countries.length - 1; i >= 0; i--) {
            if($rootScope.countries[i].id == 113){             
                $rootScope.order.country = $rootScope.countries[i];
            };
        };
    };
    if(!$rootScope.order.country){
        setDefaultCountry ();
    }    

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