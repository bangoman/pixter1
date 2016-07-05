angular.module('app').controller('editCtl',function($scope,$rootScope){
    var vm = this;
    $scope.zoom = 1;
    $scope.zoomFactor = 0.2;
    $scope.tmbWidth = $rootScope.screenW*0.92;
    if($scope.tmbWidth > 520){
    	$scope.tmbWidth = 520;
    }
    $scope.initZoom = function(value){
    	$scope.zoom += value
    	//$scope.$apply();
    }

});