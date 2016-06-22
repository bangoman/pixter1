angular.module('app').run(function($rootScope){
    window.top.postMessage('pixter_init', '*');
    window.addEventListener('message', function(e) {
        if (e.data) {
            $rootScope.$apply(function(){
                $rootScope.sourceImg = e.data;
            });
        }
    }, false);
});