angular.module('app').controller('checkoutCtl',function($uibModal){
    var vm = this;

    vm.shipmentMethod = 'standart';

    vm.openCuponModel = function(){
        $uibModal.open({
            templateUrl: 'app/views/cupon_model.html',
            controller: 'cuponModelCtl as vm',
            backdrop:'static',
        });
    }
});