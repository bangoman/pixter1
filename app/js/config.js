angular.module('app').config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('/home');
	$stateProvider
		.state('home',{
			url:'/home',
			templateUrl:'app/views/home.html',
			controller:'homeCtl as vm'
		});
        .state('preview',{
            url:'/preview',
            templateUrl:'app/views/preview.html',
            controller:'previewCtl as vm'
        });
        .state('edit',{
            url:'/edit',
            templateUrl:'app/views/edit.html',
            controller:'editCtl as vm'
        });
});