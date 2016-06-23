angular.module('app').controller('checkoutCtl',function($uibModal){
    var vm = this;

    vm.shipmentMethod = 'standart';

    vm.openCuponModal = function(){
        $uibModal.open({
            templateUrl: 'app/views/cupon_modal.html',
            controller: 'cuponModalCtl as vm',
            backdrop:'static',
        });
    }
});