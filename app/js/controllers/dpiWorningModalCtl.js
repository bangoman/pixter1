angular.module('app').controller('dpiWorningModalCtl', function ($uibModalInstance, apiService, $rootScope, $scope) {

    var vm = this;

    vm.close = $uibModalInstance.close;
    vm.dismiss = $uibModalInstance.dismiss;
    $scope.approved = function(){
        $rootScope.editToPreview = true;
        $rootScope.dpiNotAproved = false;
        if($rootScope.editModeOn){
            $rootScope.editModeOn = false;
            $state.go('app.preview');
        }else{
            $state.go('app.orderDetails');
        }        
        vm.close();
    }

    vm.apply = function () {
        
    }


});