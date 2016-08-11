angular.module('app').controller('dpiWorningModalCtl', function ($uibModalInstance, apiService, $rootScope, $scope) {
    var vm = this;

    vm.close = $uibModalInstance.close;
    vm.dismiss = $uibModalInstance.dismiss;
    $scope.approved = function(){
        $rootScope.editToPreview = true;
        $scope.approved = $uibModalInstance.dismiss;
        $rootScope.dpiNotAproved = false;
    }

    vm.apply = function () {
        
    }


});