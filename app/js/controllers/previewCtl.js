angular.module('app').controller('previewCtl',function($state){
    var vm = this;

    vm.goToEdit = function() {
        $state.go('app.edit');
    }
});