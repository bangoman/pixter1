angular.module('app').controller('shopCtl',function($state, $http,$rootScope){
	var vm = this;
    $rootScope.imageUrl = "http://3v6x691yvn532gp2411ezrib.wpengine.netdna-cdn.com/wp-content/uploads/sites/default/files/story_images/112602_fg5.jpg"
    vm.getProducts = function(){
        $http.get('app/json/products.json')
            .then(function(res){
                vm.productsData = res.data; 
                $rootScope.productsData = res.data;               
            }).then(function(){
                console.log('vm.products = ',vm.products);
            });
        $http.get('app/json/pricing.json')
            .then(function(res){                
                $rootScope.prices = res.data;               
            }).then(function(){
                console.log('vm.products = ',vm.products);
            });

    }
    
    vm.getProducts();

    vm.goToPreview = function (category) {
        $rootScope.category = category;
        $rootScope.currentProduct =  category.products[0];
        $state.go('app.preview');
    }
});