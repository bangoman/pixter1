angular.module('app').controller('mainCtl', function(message, $uibModal, $state,$rootScope,$http, $stateParams,$scope,$location,$window){
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

    function getDataUri(url, callback) {
          var image = new Image();        
          //image.crossOrigin = "anonymous";
          image.onload = function () {

              var canvas = document.createElement('canvas');
              canvasContext = canvas.getContext("2d");
              canvas.width = image.width;
              canvas.height = image.height;
              image.crossOrigin = 'Anonymous';

              // draw image into canvas element
              canvasContext.drawImage(image, 0, 0, image.width, image.height);
      
              // get canvas contents as a data URL (returns png format by default)
              var dataURL = canvas.toDataURL();
              callback(dataURL);
          };

          image.src = url;
      }

  // Usage
      function dataURItoBlob(uri){
          //console.log(uri);
          // convert base64/URLEncoded data component to raw binary data held in a string
          var DOMURL = window.URL || window.webkitURL || window;
          var byteString,
              mimeString,
              ia;

          if (uri.split(',')[0].indexOf('base64') >= 0) {
              byteString = atob(uri.split(',')[1]);
          }
          else {
              byteString = unescape(uri.split(',')[1]);
          }
          // separate out the mime component
          mimeString = uri.split(',')[0].split(':')[1].split(';')[0];
          // write the bytes of the string to a typed array
          ia = new Uint8Array(byteString.length);
          for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }
          var blob = new Blob([ia], {
              type: mimeString
          });            
          return DOMURL.createObjectURL(blob)
          
      }    

    setTimeout(function(){
      $rootScope.imageUrl = localStorage.imageUrl
      getDataUri($rootScope.imageUrl,function(dataUrl){                
          $rootScope.imageUrl = dataURItoBlob(dataUrl);                
          $rootScope.originalImageUrl = $rootScope.imageUrl;
          $rootScope.$apply()
          $rootScope.apiKey = getParameterByName("apiKey",location.search);//"d0d01fe4ebaca56ab78cab9e9c5476e569276784";
          $rootScope.storeId = getParameterByName("storeId",location.search); //"87CD192192A547"
          $rootScope.bgs = getParameterByName("bgs",location.search); //"87CD192192A547"      
          $rootScope.bgs = JSON.parse($rootScope.bgs);
          $rootScope.originalImageUrl = $rootScope.imageUrl;      

          vm.getBranding();
          getImgSize()
          $state.go('app.shop')
          
      });
    }, 1500);    

    $rootScope.originalImageUrl = $rootScope.imageUrl;
    
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
            $rootScope.imageHeight = height;
            $rootScope.imageWidth = width;
            vm.getProducts(width,height);
        }
        newImg.src = $rootScope.imageUrl;
          // this must be done AFTER setting onload

    }


    vm.getBranding = function () {
      $http.get($rootScope.baseApi + '/api/v2/store/init?api_key=' + $rootScope.apiKey + '&store_id=' + $rootScope.storeId )
          .then(function (res) {
              $rootScope.brandingData = res.data;
              generateBrandingStyle();
          }).then(function () {

         console.log("branding", $rootScope.brandingData);
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
  		if ($state.current.name == 'app.shop' && $state.params.subcategories != "true") {
  			return true;
  		} else {
  			return false;
  		}
  	}
	 
      vm.getViewHeader = function() {
        if ($rootScope.brandingData){  
          if ($state.current.name == 'app.shop') {
            return $rootScope.brandingData.branding.screens.catalog.title;    
          }
          if ($state.current.name == 'app.sliderShop') {
            return $rootScope.brandingData.branding.screens.catalog.title;  
          }                
          if ($state.current.name == 'app.preview') {
            return $rootScope.brandingData.branding.screens.preview.title;
          }     
          if ($state.current.name == 'app.edit') {
            return $rootScope.brandingData.branding.screens.edit.title;
          }
          if ($state.current.name == 'app.orderDetails') {
            return $rootScope.brandingData.branding.screens.summary.title;
          }
          if ($state.current.name == 'app.checkout') {
            return $rootScope.brandingData.branding.screens.checkout.title;
          }
        }
      } 
  

  	vm.goBack = function(){
  		if ($state.current.name == 'app.preview') {
        
        if($rootScope.productsData.display.type == "OSS"){
          $state.go('app.sliderShop');
        }
        else{
          $state.go('app.shop');
        } 
      }     
      if ($state.params.subcategories == 'true') {
        if($rootScope.productsData.display.type == "OSS"){
          $state.go('app.sliderShop');
        }
        else{
          $state.go('app.shop',{subcategories:false});
        }         
      }
  		if ($state.current.name == 'app.edit') {
        $rootScope.imageUrl = $rootScope.originalImageUrl;
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