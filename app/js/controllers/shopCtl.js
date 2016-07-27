angular.module('app').controller('shopCtl', function ($state, $http, $rootScope,$stateParams) {
    var vm = this;
    window.$state = $state;
    $rootScope.screenW = document.body.clientWidth;
    $rootScope.disableScroll = false;
    $rootScope.previewCatalogParams = $stateParams;

    vm.goToPreview = function (category) {
        $rootScope.category = category;
        $rootScope.currentProduct = category.products[0];
        
        if ($rootScope.previewCatalogParams.previewCatalog) {
            $state.go('app.previewCatalog');
        }
        else{
        $state.go('app.preview');
        }
    }
});