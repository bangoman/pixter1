angular.module('app').controller('mainCtl', function(message, $uibModal, $state,$rootScope,$http, $stateParams,$scope,$location){
	var vm = this;
    vm.state = $state;    
    $scope.loading = true;
    $rootScope.baseApi = 'http://ec2-52-201-250-90.compute-1.amazonaws.com:8000';
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }    
    setTimeout(function(){
      $rootScope.imageUrl = getParameterByName("imageUrl",location.search);//"image.jpg";
      $rootScope.apiKey = getParameterByName("apiKey",location.search);//"d0d01fe4ebaca56ab78cab9e9c5476e569276784";
      $rootScope.storeId = getParameterByName("storeId",location.search); //"87CD192192A547"
      $rootScope.bgs = getParameterByName("bgs",location.search); //"87CD192192A547"      
      $rootScope.bgs = JSON.parse($rootScope.bgs);
      

      vm.getBranding();
      getImgSize()
      $state.go('app.shop')

    }, 1500);    
    
    vm.getProducts = function (w,h) {
        
        $http.get($rootScope.baseApi + '/api/v2/category/get_list?api_key=' + $rootScope.apiKey + '&store_id=' + $rootScope.storeId + '&add_products=true&img_w=' + w + '&img_h=' + h)
            .then(function (res) {
                console.log("product res",res);
                $rootScope.productsData = res.data;
                $scope.loading = false;
                $rootScope.$broadcast("productArrive");
                if(res.data.display.type == "OSS"){
                  $state.go('app.sliderShop');
                }
                else{
                  $state.go('app.shop');
                }
                $rootScope.currencySymbol = res.data.localization.currency.symbol
            }).then(function () {


        });
    };
    function getImgSize() {
        var newImg = new Image();
        newImg.onload = function () {
            var height = newImg.height;
            var width = newImg.width;
            vm.getProducts(width,height);
        }
        newImg.src = $rootScope.imageUrl;
          // this must be done AFTER setting onload

    }


    vm.getBranding = function () {
      $http.get($rootScope.baseApi + '/api/v2/store/init?api_key=' + $rootScope.apiKey + '&store_id=' + $rootScope.storeId )
          .then(function (res) {
              $rootScope.brandingData = res.data;
              generateBrandingStyle()
              console.log("branding1111",$rootScope.brandingData);
          }).then(function () {


        });


    };
    function generateBrandingStyle(){
        $rootScope.brandingStyle = {
          generalButton:{
            "background-color" : $rootScope.brandingData.branding.buttons.backgroundcolor,
            "color" : $rootScope.brandingData.branding.buttons.textcolor
          },
          header : {
            "background-color" : $rootScope.brandingData.branding.headers.backgroundcolor,
            "color" : $rootScope.brandingData.branding.headers.textcolor,
            button : {
              "color" : $rootScope.brandingData.branding.headers.linkcolor
            }
          },
          oss : {
            description : {
              "background-color" : $rootScope.brandingData.branding.oss_product.description.backgroundcolor
            },
            title : {
              "background-color" : $rootScope.brandingData.branding.oss_product.title.backgroundcolor
            },
          },
          spcialOffer : {
            "background-color" : $rootScope.brandingData.branding.special_offer.backgroundcolor,
            "color" : $rootScope.brandingData.branding.special_offer.textcolor
          },
          text : {
            "color" : $rootScope.brandingData.branding.text.textcolor
          },
          logo :  $rootScope.brandingData.branding.logo
          
        }
    }

    window.$state = $state;
    $rootScope.screenW = document.body.clientWidth;
    $rootScope.disableScroll = false;
    //$rootScope.imageUrl = "image.jpg";

    $rootScope.previewCatalogParams = $stateParams;
    
    
    

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