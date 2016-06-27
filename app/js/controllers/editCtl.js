angular.module('app').controller('editCtl',function($scope){
    var vm = this;
    $scope.zoom = 1;
    $scope.zoomFactor = 0.2;
    $scope.initZoom = function(value){
    	$scope.zoom += value
    	//$scope.$apply();
    }

});