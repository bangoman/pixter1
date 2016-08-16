angular.module('app').factory('message', function(){
	return function message(msg){
		window.top.postMessage('pixter_' + msg, '*');
	};
});