angular.module('app').directive('productParams', function () {

	return{
        scope: {
            params: '=',
        },
		controller: function ($scope ,$rootScope, formatPriceCurrency){
			$rootScope.choosenParams = {};
			$scope.paramPrice = 0 ;
			$scope.priceCurrencyOrder = formatPriceCurrency;
            $scope.$watch('params', function () {
                if ($scope.params) {
                   $scope.generateBackgrounds();
                   $scope.setDefaultRadio();
                }
            });
			$scope.setBackground = function(option){
				for (var i = $scope.params.length - 1; i >= 0; i--) {
					if($scope.params[i].key == "background" ){
						$scope.params[i].chosenOption = option;
						$rootScope.choosenParams.backSideColor = option;
					}
				}

			}
			
			$scope.generateBackgrounds = function(){
				for (var i = $scope.params.length - 1; i >= 0; i--) {
					if($scope.params[i].key == "background"){
						$scope.params[i].options = $rootScope.bgs

					}
				}				
				$scope.setBackground($rootScope.bgs[0]);
			}
			if($scope.params){
				$scope.generateBackgrounds();
			}
			
			$scope.getQuantity = function(){
				for (var i = $scope.params.length - 1; i >= 0; i--) {
					if($scope.params[i].key != "background" && $scope.params[i].chosenOption.quantity){
						$scope.quantity = $scope.params[i].chosenOption.quantity;
					}
				}
				$scope.setParamPrice();				
			}
			
			$scope.setParamPrice = function(){
				$scope.paramPrice = 0;
				for (var i = $scope.params.length - 1; i >= 0; i--) {
					if($scope.params[i].key != "background"){
						$scope.paramPrice += $scope.params[i].chosenOption.pricing.price * $scope.quantity;
					}
				}

				$scope.setTotalPrice ();				
				
			}
			$scope.setTotalPrice = function(){
				$rootScope.currentProduct.finalPrice = {};
				for (var i = $rootScope.currentProduct.quantities.length - 1; i >= 0; i--) {
					if($scope.quantity >= $rootScope.currentProduct.quantities[i].min && $scope.quantity <= $rootScope.currentProduct.quantities[i].max){
						$scope.tempPrice = $rootScope.currentProduct.quantities[i].pricing.price * $scope.quantity;
						$scope.shipping = $rootScope.currentProduct.quantities[i].pricing.shipping;
					}
				};
				$rootScope.currentProduct.finalPrice.price = $scope.tempPrice + $scope.paramPrice;
				$rootScope.currentProduct.finalPrice.shipping = $scope.shipping;
			}

			$scope.setDefaultRadio = function(){
				if($scope.params){}
				for (var i = $scope.params.length - 1; i >= 0; i--) {
					for (var j = $scope.params[i].options.length - 1; j >= 0; j--) {
						if($scope.params[i].options[j].default){
							$scope.params[i].chosenOption = $scope.params[i].options[j];
						}						
					}
				}
				$scope.getQuantity();
			}
			if($scope.params){
				$scope.setDefaultRadio();
			}			
		},
		templateUrl:'app/js/directives/productParams.html'	
	};
});
