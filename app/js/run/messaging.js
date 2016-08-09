angular.module('app').run(function($rootScope,message){
    $rootScope.imageUrl = "image.jpg";
	message('init');
    window.addEventListener('message', function(e) {
        if (e.source !== window && e.data) {
            $rootScope.$apply(function(){
                //$rootScope.imageUrl = e.data;
            });
        }
    }, false);
});