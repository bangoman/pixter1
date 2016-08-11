angular.module('app').controller('dpiWorningModalCtl', function ($uibModalInstance, apiService, $rootScope, $scope) {
    var vm = this;

    vm.close = $uibModalInstance.close;
    vm.dismiss = $uibModalInstance.dismiss;
    $scope.approved = function(){
        console.log("!!!")
        $rootScope.editToPreview = true;
        $rootScope.dpiNotAproved = false;        
        $scope.approved = $uibModalInstance.close;

    }

    vm.apply = function () {
        
    }


});