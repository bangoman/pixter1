angular.module('app').controller('mainCtl', function(message, $uibModal, $state,$rootScope){
	var vm = this;
    vm.state = $state;
    $state.go('app.shop');
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