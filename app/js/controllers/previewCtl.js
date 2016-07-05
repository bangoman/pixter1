angular.module('app').controller('previewCtl',function($state,$rootScope,$scope,$q,apiService){
    var vm = this;
    $rootScope.disableScroll = false;
    $scope.finalStep = false
    console.log($rootScope.category.products);
    $scope.selectedProduct = $rootScope.category.products[0];
    vm.goToEdit = function() {
        $state.go('app.edit');
    };

    vm.goToOrderDetails = function() {

    	$scope.finalStep = true;
        //$state.go('app.orderDetails');
        return getDataUrlFromImageUrl($rootScope.imageUrl).then(apiService.upload).then(function (data) {
            $rootScope.order.key = data.key;
            $state.go('app.orderDetails');
        });
    };

    $scope.$watch("selectedProduct",function(){
    	$rootScope.currentProduct =  $scope.selectedProduct;
    });

    function getDataUrlFromImageUrl(url) {
        return $q(function (resolve,reject) {
            try{
                var img = new Image();

                img.setAttribute('crossOrigin', 'anonymous');

                img.onload = function () {
                    var canvas = document.createElement("canvas");
                    canvas.width =this.width;
                    canvas.height =this.height;

                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(this, 0, 0);

                    resolve(canvas.toDataURL("image/png"));
                };

                img.src = url;
            }catch (e){
                reject(e);
            }
        });
    }
});