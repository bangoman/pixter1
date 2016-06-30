angular.module('app').controller('shopCtl',function($state, $http,$rootScope){
	var vm = this;
    
    vm.getProducts = function(){
        $http.get('app/json/products.json')
            .then(function(res){
                vm.productsData = res.data;                
            }).then(function(){
                console.log('vm.products = ',vm.products);
            });
    }
    vm.getProducts();

    vm.goToPreview = function (product) {
        $rootScope.product = product
        $state.go('app.preview');
    }
});