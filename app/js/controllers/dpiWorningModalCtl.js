angular.module('app').controller('dpiWorningModalCtl', function ($uibModalInstance, apiService, $rootScope, $scope,$state) {

    var vm = this;

    vm.close = $uibModalInstance.close;
    vm.dismiss = function(){
        $rootScope.finalStep = false;
        $uibModalInstance.dismiss();
    }
    
    $scope.approved = function(){        
        $rootScope.dpiApproved = true;
        $rootScope.editToPreview = true;
        if($state.current == 'app.edit'){
            $state.go('app.preview');
        }else{
            $state.go('app.orderDetails');
        }        
        vm.close();
    }

    vm.apply = function () {
        
    }


});