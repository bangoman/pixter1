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
			//	console.log("$rootScope.choosenParams",$rootScope.choosenParams);
			}
			$scope.setParamsArrey = function(){
	
				console.log("$scope.params",$scope.params);
			//	console.log("$scope.chosenQuantity;",$scope.chosenQuantity);
				//console.log("$rootScope.choosenParams",$rootScope.choosenParams);
			}
			$scope.setDefaultRadio = function(){
				for (var i = $scope.params.length - 1; i >= 0; i--) {
					for (var j = $scope.params[i].options.length - 1; j >= 0; j--) {
						if($scope.params[i].options[j].default){
							$scope.params[i].chosenOption = $scope.params[i].options[j].name;
						}						
					}
				}
			}			
			$scope.setDefaultRadio()
		},
		templateUrl:'app/js/directives/productParams.html'	
	};
});
