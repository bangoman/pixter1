angular.module('app').controller('previewCtl',function($state){
    var vm = this;

    vm.goToEdit = function() {
        $state.go('app.edit');
    }

    vm.goToOrderDetails = function() {
        $state.go('app.orderDetails');
    }
});