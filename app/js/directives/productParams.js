angular.module('app').directive('productParams', function () {

	return{
        scope: {
            params: '=',
        },
		controller: function ($scope,$rootScope){
			console.log($scope.params,"params");
			for (var i = $scope.params.length - 1; i >= 0; i--) {
				if($scope.params[i].key == "background"){
					$scope.params[i].options = $rootScope.bgs
				}
			}
			$scope.setBackground = function(option){
				$rootScope.currentProduct.backSideColor = option;
				console.log("backSideColor",$rootScope.currentProduct.backSideColor);
			}
		},
		templateUrl:'app/js/directives/productParams.html'	
	};
});
