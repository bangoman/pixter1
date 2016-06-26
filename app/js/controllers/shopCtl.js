angular.module('app').controller('shopCtl',function($state){
	var vm = this;

    vm.goToPreview = function () {
        $state.go('app.preview');
    }
});