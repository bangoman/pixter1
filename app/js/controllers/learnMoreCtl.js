angular.module('app').controller('learnMoreCtl', function($uibModalInstance){
	var vm = this;
	vm.close = $uibModalInstance.close;
	vm.dismiss = $uibModalInstance.dismiss;
});