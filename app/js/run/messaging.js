angular.module('app').run(function($rootScope,message){
	$rootScope.sourceImg = 'app/images/image1.jpg';
	message('init');
    window.addEventListener('message', function(e) {
        if (e.source !== window && e.data) {
            $rootScope.$apply(function(){
                $rootScope.sourceImg = e.data;
            });
        }
    }, false);
});