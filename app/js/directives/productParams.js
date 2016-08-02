angular.module('app').directive('productParams', function () {

	return{
        scope: {
            params: '=',
        },
		controller: function ($scope,$rootScope){
			$rootScope.choosenParams = {}
			console.log($scope.params,"params");

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
						$scope.tempPrice = $scope.params[i].chosenOption.pricing.price;
					}
				}
				$scope.setPrice()				
			}
			
			$scope.setPrice = function(){
				$scope.price = 0;
				for (var i = $scope.params.length - 1; i >= 0; i--) {
					if($scope.params[i].key != "background" && $scope.params[i].key != "quantity"){
						$scope.price += $scope.params[i].chosenOption.pricing.price * $scope.quantity;
					}
				}
				$rootScope.currentProduct.quantities[0].price = $scope.tempPrice + $scope.price;				
				
			}
			$scope.setDefaultRadio = function(){
				for (var i = $scope.params.length - 1; i >= 0; i--) {
					for (var j = $scope.params[i].options.length - 1; j >= 0; j--) {
						if($scope.params[i].options[j].default){
							$scope.params[i].chosenOption = $scope.params[i].options[j];
						}						
					}
				}
				$scope.getQuantity()
			}			
			$scope.setDefaultRadio()
		},
		templateUrl:'app/js/directives/productParams.html'	
	};
});
