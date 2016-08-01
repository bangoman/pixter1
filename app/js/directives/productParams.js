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
			function setParamsArrey(){
				$rootScope.choosenParams.paperType = $scope.paperType;
				$rootScope.choosenParams.quantity = $scope.chosenQuantity.option;

			}
			console.log("$rootScope.choosenParams",$rootScope.choosenParams);
		},
		templateUrl:'app/js/directives/productParams.html'	
	};
});
