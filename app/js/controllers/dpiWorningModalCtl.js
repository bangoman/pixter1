angular.module('app').controller('dpiWorningModalCtl', function ($uibModalInstance, apiService, $rootScope) {
    var vm = this;

    vm.close = $uibModalInstance.close;
    vm.dismiss = $uibModalInstance.dismiss;
    $scope.approved = function(){
        $state.go('app.preview');
    }

    vm.apply = function () {
        
    }


});