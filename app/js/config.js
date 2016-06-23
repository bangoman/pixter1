angular.module('app').config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('/app/shop');
	$stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'app/views/main.html',
            controller:'mainCtl as vm',
        })
		.state('app.shop',{
			url:'/shop',
            views:{
                main:{
                    templateUrl:'app/views/shop.html',
                    controller:'shopCtl as vm'
                }
            },
		})
        .state('app.preview',{
            url:'/preview',
            views:{
                main:{
                    templateUrl:'app/views/preview.html',
                    controller:'previewCtl as vm'
                }
            },
        })
        .state('app.edit',{
            url:'/edit',
            views:{
                main:{
                    templateUrl:'app/views/edit.html',
                    controller:'editCtl as vm'
                }
            },
        })
        .state('app.orderDetails',{
            url:'/orderDetails',
            views:{
                main:{
                    templateUrl:'app/views/order_details.html',
                    controller:'orderDetailsCtl as vm'
                }
            },
        })
        .state('app.checkout',{
            url:'/checkout',
            views:{
                main:{
                    templateUrl:'app/views/checkout.html',
                    controller:'checkoutCtl as vm'
                }
            },
        })
    ;
});