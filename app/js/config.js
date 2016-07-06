angular.module('app').config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('/app/shop/');
	$stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'app/views/main.html',
            controller:'mainCtl as vm',
        })
		.state('app.shop',{
            title:'CLICK A PRODUCT',// TO GET STARTED
            views:{
                main:{
                    templateUrl:'app/views/shop.html',                    
                    controller:'shopCtl as vm'
                }
            },
		})
        .state('app.preview',{
            url:'/preview',
            title:'PREVIEW YOUR PRODUCT',
            views:{
                main:{
                    templateUrl:'app/views/preview.html',                    
                    controller:'previewCtl as vm'
                }
            },
        })
            title:'PREVIEW YOUR PRODUCT',
            views:{
                main:{
                }
            },
        })
        .state('app.edit',{
            url:'/edit',
            title:'EDIT YOUR IMAGE',
            views:{
                main:{
                    templateUrl:'app/views/edit.html',                    
                    controller:'editCtl as vm'
                }
            },
        })
        .state('app.orderDetails',{
            url:'/orderDetails',
            title:'ORDER DETAILS',
            views:{
                main:{
                    templateUrl:'app/views/order_details.html',                    
                    controller:'orderDetailsCtl as vm'
                }
            },
        })
        .state('app.checkout',{
            url:'/checkout',
            title:'CHECKOUT INFORMATION',
            views:{
                main:{
                    templateUrl:'app/views/checkout.html',                    
                    controller:'checkoutCtl as vm'
                }
            },
        })
        .state('app.sliderShop',{
            url:'/sliderShop',
            title:'Choose Your Photo Product',
            views:{
                main:{
                    templateUrl:'app/views/slider_shop.html',                    
                    controller:'sliderShopCtl as vm'
                }
            },
        })
        .state('app.thankYou',{
            url:'/thankYou',
            title:'THANK YOU FOR YOUR ORDER!',
            views:{
                main:{
                    templateUrl:'app/views/thank_you.html',                    
                    controller:'thankYouCtl as vm'
                }
            },
        })
    ;
});