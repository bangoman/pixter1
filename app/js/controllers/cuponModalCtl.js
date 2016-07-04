angular.module('app').controller('cuponModalCtl',function($uibModalInstance){
    var vm = this;

    vm.close = $uibModalInstance.close;
    vm.dismiss = $uibModalInstance.dismiss;
    
    vm.apply = function () {
        
    }
});