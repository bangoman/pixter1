angular.module('app').controller('previewCtl',function($state,$rootScope){
    var vm = this;

    console.log($rootScope.category.products);
    vm.goToEdit = function() {
        $state.go('app.edit');
    }

    vm.goToOrderDetails = function() {
        $state.go('app.orderDetails');
    }
});