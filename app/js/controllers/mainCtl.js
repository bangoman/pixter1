angular.module('app').controller('mainCtl', function(message,$uibModal){
	var vm = this;

	vm.close = function(){
		message('close');
	}

	vm.learnMore = function(){
		$uibModal.open({
		    templateUrl: 'app/views/learn_more.html',
		    controller: 'learnMoreCtl as vm',
		    backdrop:'static',
		});
	}
});