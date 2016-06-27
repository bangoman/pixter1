angular.module('app').controller('shopCtl',function($state, $http){
	var vm = this;
    
    vm.getProductsData = function(){
        $http.get('app/json/products.json')
            .then(function(res){
                vm.productsData = res.data;                
            }).then(function(){
                console.log('vm.productsData = ',vm.productsData);
            });
    }
    vm.getProductsData();
        

    vm.goToPreview = function () {
        $state.go('app.preview');
    }
});