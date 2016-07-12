angular.module('app').controller('mainCtl', function(message, $uibModal, $state,$rootScope,$http, $stateParams){
	var vm = this;
    vm.state = $state;
  vm.getProducts = function () {
        $http.get('http://ec2-52-201-250-90.compute-1.amazonaws.com:8000/api/v2/category/get_list?user=demo')
            .then(function (res) {
                console.log(res);
                //vm.productsData = res.data;
                //console.log(vm.productsData.objects,"!!");
                $rootScope.productsData = res.data;
            }).then(function () {
            console.log('vm.products = ', vm.products);
        });
        $http.get('app/json/pricing.json')
            .then(function (res) {
                $rootScope.prices = res.data;
            }).then(function () {
            console.log('vm.products = ', vm.products);
        });
            $http.get('app/json/branding_default.json')
            .then(function (res) {
                $rootScope.branding = res.data;
            }).then(function () {
            console.log($rootScope.branding.marketingData.ossData , "branding");
        });

    };
    window.$state = $state;
    $rootScope.screenW = document.body.clientWidth;
    $rootScope.disableScroll = false;
    $rootScope.imageUrl = "image.jpg";

    $rootScope.previewCatalogParams = $stateParams;
    
    vm.getProducts();

    //$state.go('app.shop');
	vm.close = function(){
		message('close');
	}

	vm.learnMore = function(){
		$uibModal.open({
		    templateUrl: 'app/views/learn_more.html',
		    controller: 'learnMoreCtl as vm',
		    backdrop:'static',
		});
	}

	vm.stateIsShop = function(){
		if ($state.current.name == 'app.shop') {
			return true;
		} else {
			return false;
		}
	}
	
  	vm.getViewHeader = function() {
  		return $state.current.title;
  	}

  	vm.goBack = function(){
  		if ($state.current.name == 'app.preview') {
        if ($rootScope.previewCatalogParams.previewCatalog && $rootScope.category.products.length != 1) {
            $state.go('app.previewCatalog');          
        }
        else{
            $state.go('app.shop',$rootScope.previewCatalogParams);
        }
  		}
  		if ($state.current.name == 'app.previewCatalog') {
  			$state.go('app.shop',$rootScope.previewCatalogParams);
  		}
  		if ($state.current.name == 'app.edit') {
            $state.go('app.preview');
      }
  		if ($state.current.name == 'app.orderDetails') {
  			$state.go('app.preview');
  		}
  		if ($state.current.name == 'app.checkout') {
  			$state.go('app.orderDetails');
  		}
  	}

});