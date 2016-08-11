angular.module('app').controller('dpiWorningModalCtl', function ($uibModalInstance, apiService, $rootScope, $scope) {
    var vm = this;

    vm.close = $uibModalInstance.close;
    vm.dismiss = $uibModalInstance.dismiss;
    $scope.approved = function(){
        $state.go('app.preview');
        $rootScope.dpiNotAproved = false;
    }

    vm.apply = function () {
        
    }


});