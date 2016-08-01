angular.module('app').controller('editCtl',function($scope,$rootScope){
    var vm = this;
    $scope.zoom = 1;
    $scope.zoomFactor = 0.2;
    $scope.tmbWidth = $rootScope.screenW;
    if($scope.tmbWidth > 520){
    	$scope.tmbWidth = 360;
    }
    $scope.initZoom = function(value){
    	$scope.zoom += value
    	//$scope.$apply();
    }

});