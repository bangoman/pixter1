angular.module('app').controller('dpiWorningModalCtl', function ($uibModalInstance, apiService, $rootScope, $scope) {
    var vm = this;

    vm.close = $uibModalInstance.close;
    vm.dismiss = $uibModalInstance.dismiss;
    $scope.approved = function(){
        $rootScope.editToPreview = true;
        $rootScope.dpiNotAproved = false;        
        vm.close();
    }

    vm.apply = function () {
        
    }


});