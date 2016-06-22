angular.module('app').controller('mainCtl', function(message){
	var vm = this;

	vm.close = function(){
		message('close');
	}
});