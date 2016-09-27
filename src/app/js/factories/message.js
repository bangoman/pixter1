angular.module('app').factory('message', function(){
	return function message(msg,img){
        if(msg=="image_received"){
            window.top.postMessage({img: img, type: "pixter_" + msg}, '*');                

        }else{

            window.top.postMessage('pixter_' + msg, '*');    
        }
		
	};
});