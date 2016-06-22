angular.module('app').config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('/shop');
	$stateProvider
		.state('shop',{
			url:'/shop',
			templateUrl:'app/views/shop.html',
			controller:'shopCtl as vm'
		})
        .state('preview',{
            url:'/preview',
            templateUrl:'app/views/preview.html',
            controller:'previewCtl as vm'
        })
        .state('edit',{
            url:'/edit',
            templateUrl:'app/views/edit.html',
            controller:'editCtl as vm'
        })
    ;
});