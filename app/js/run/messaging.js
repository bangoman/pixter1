angular.module('app').run(function($rootScope,message){
	message('init');
    window.addEventListener('message', function(e) {
        if (e.data) {
            $rootScope.$apply(function(){
                $rootScope.sourceImg = e.data;
            });
        }
    }, false);
});