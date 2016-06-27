angular.module('app').controller('shopCtl',function($state, $http){
	var vm = this;
      $http.get('app/json/products.json')
        .then(function(res){
          vm.products = res.data.products;                
        });
        console.log('vm.products = ',vm.products);


    vm.goToPreview = function () {
        $state.go('app.preview');
    }
});