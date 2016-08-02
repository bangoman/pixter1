angular.module('app').directive('productParams', function () {

	return{
        scope: {
            params: '=',
        },
		controller: function ($scope,$rootScope){
			$rootScope.choosenParams = {}
			console.log($scope.params,"params");
			if($scope.params){
				generateBackgrounds();
			}

            $scope.$watch('params', function () {
                if ($scope.params) {
                   generateBackgrounds();
                   $scope.setDefaultRadio();
                }
            });
			
			function generateBackgrounds(){
				for (var i = $scope.params.length - 1; i >= 0; i--) {
					if($scope.params[i].key == "background"){
						$scope.params[i].options = $rootScope.bgs

					}
				}				
			}
			$rootScope.choosenParams.backSideColor = $rootScope.bgs[0];
			$scope.setBackground = function(option){
				$rootScope.choosenParams.backSideColor = option;
			}
			$scope.setPrice = function(){
				$scope.price = 0;
				for (var i = $scope.params.length - 1; i >= 0; i--) {
					if($scope.params[i].key != "background" && $scope.params[i].chosenOption.quantity){
						var quantity = $scope.params[i].chosenOption.quantity;
						for (var i = $scope.params.length - 1; i >= 0; i--) {
							if($scope.params[i].key != "background" && $scope.params[i].key != "quantity"){
								$scope.price += $scope.params[i].chosenOption.pricing.price * quantity;
								console.log("pricing.price",$scope.params[i].chosenOption.pricing.price);
								console.log("quantity",quantity);
								console.log("price",$scope.price)
							}
						}
						
						console.log($scope.params,"params2");
					}
				}	
				$rootScope.currentProduct.quantities[0].price += $scope.price;
				console.log("totalprice",$rootScope.currentProduct.quantities[0].price)
			}
			$scope.setDefaultRadio = function(){
				for (var i = $scope.params.length - 1; i >= 0; i--) {
					for (var j = $scope.params[i].options.length - 1; j >= 0; j--) {
						if($scope.params[i].options[j].default){
							$scope.params[i].chosenOption = $scope.params[i].options[j];
						}						
					}
				}
			}			
			$scope.setDefaultRadio()
		},
		templateUrl:'app/js/directives/productParams.html'	
	};
});
