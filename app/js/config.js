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
                    title:'CLICK A PRODUCT TO GET STARTED',
                    controller:'shopCtl as vm'
                }
            },
		})
        .state('app.preview',{
            url:'/preview',
            views:{
                main:{
                    templateUrl:'app/views/preview.html',
                    title:'PREVIEW YOUR PRODUCT',
                    controller:'previewCtl as vm'
                }
            },
        })
        .state('app.edit',{
            url:'/edit',
            views:{
                main:{
                    templateUrl:'app/views/edit.html',
                    title:'EDIT YOUR IMAGE',
                    controller:'editCtl as vm'
                }
            },
        })
        .state('app.orderDetails',{
            url:'/orderDetails',
            views:{
                main:{
                    templateUrl:'app/views/order_details.html',
                    title:'ORDER DETAILS',
                    controller:'orderDetailsCtl as vm'
                }
            },
        })
        .state('app.checkout',{
            url:'/checkout',
            views:{
                main:{
                    templateUrl:'app/views/checkout.html',
                    title:'CHECKOUT INFORMATION',
                    controller:'checkoutCtl as vm'
                }
            },
        })
        .state('app.sliderShop',{
            url:'/shop',
            views:{
                main:{
                    templateUrl:'app/views/slider_shop.html',
                    title:'CLICK A PRODUCT TO GET STARTED',
                    controller:'sliderShopCtl as vm'
                }
            },
        })
    ;
});