
angular.module('app').directive('productImageDisplay', function ($http) {
	function link(scope, element, attrs,$http) {
		//console.log(attrs.moduleid);
	  }
  	return {	    
	    restrict: 'E',
	    scope:{},
	  	controller: ['$scope','$http','$attrs','$document','$element','$compile', function($scope,$http,$attrs,$document,$element,$compile) {
	  		$scope.onRelease = function(event){	  			
	  			$scope.backgroundPosition.top =  (parseInt($scope.backgroundPosition.top) + event.gesture.deltaY) + "px "  ;
	  			$scope.backgroundPosition.left =  (parseInt($scope.backgroundPosition.left) + event.gesture.deltaX) + "px "  ;


	  		}
		    $scope.onDrag=function(event){
		       var limitVertical =   (($scope.currentImg.height/$scope.imageSizeRatio) - ($scope.product.window.h/$scope.sizeRatio));		       
		       var limitHorizontal =   (($scope.currentImg.width/$scope.imageSizeRatio) - ($scope.product.window.w/$scope.sizeRatio));		       
		       $scope.currentBackgroundPosition.top = (parseInt($scope.backgroundPosition.top) + event.gesture.deltaY) +"px "; 
		       $scope.currentBackgroundPosition.left = (parseInt($scope.backgroundPosition.left) + event.gesture.deltaX) +"px "; 
		       var remainVertical =  limitVertical - (($scope.product.window.y/$scope.sizeRatio) -  parseInt($scope.currentBackgroundPosition.top) ) ;
		       var remainHorizontal =  limitHorizontal - (($scope.product.window.x/$scope.sizeRatio) -  parseInt($scope.currentBackgroundPosition.left) ) ;
		     //  console.log("vertical",remainVertical,limitVertical);
		      //	 console.log("horizontal",remainHorizontal,limitHorizontal);
		       if(remainVertical <= 0 ){
		       		$scope.currentBackgroundPosition.top =  (- limitVertical) + ($scope.product.window.y/$scope.sizeRatio) + "px";
		       }else if( remainVertical > limitVertical){
		       		$scope.currentBackgroundPosition.top = ($scope.product.window.y/$scope.sizeRatio) + "px";
		       }

		       if(remainHorizontal <= 0 ){
		       		$scope.currentBackgroundPosition.left =  (- limitHorizontal) + ($scope.product.window.x/$scope.sizeRatio) + "px ";
		       }else if( remainHorizontal > limitHorizontal){
		       		$scope.currentBackgroundPosition.left = ($scope.product.window.x/$scope.sizeRatio) + "px ";
		       }


		       console.log($scope.currentBackgroundPosition.top);
				$scope.imageStyle["backgroundPosition"] = $scope.currentBackgroundPosition.left + $scope.currentBackgroundPosition.top			       	
//		       if(remainHorizontal > 0 && remainHorizontal <= limitHorizontal){
//		       		$scope.imageStyle["backgroundPosition"] = $scope.currentBackgroundPosition.left + $scope.backgroundPosition.top	

//		       }

		       
		       //console.log("ps", $scope.currentBackgroundPosition.top,event.gesture.deltaY);
		       
		    }	  		

			function getImgSize(imgSrc) {
			    var newImg = new Image();
			    newImg.onload = function() {
			      var height = newImg.height;
			      var width = newImg.width;
			      
			      calculatePosition(newImg);
			      //alert ('The image size is '+width+'*'+height);
			    }

			    newImg.src = imgSrc; // this must be done AFTER setting onload
			}

			function calculatePosition(img){
				//var imgDisplay = document.getElementById("img");
				var imgRatio = img.height/img.width;
				

				var productRatio = $scope.product.window.h/$scope.product.window.w;
				$scope.currentImg = img;
				$scope.product.tmbWidth = parseInt($attrs.tmbwidth);
				$scope.product.tmbHeight = $scope.product.tmbWidth * ($scope.product.height/$scope.product.width) ;
				$scope.sizeRatio = $scope.product.width/$scope.product.tmbWidth;			
				$scope.backgroundPosition = {top:"",left:""}
				$scope.currentBackgroundPosition = {top:"",left:""}								
				if(productRatio >= imgRatio){ // Left case
					$scope.imageSizeRatio = img.height/($scope.product.window.h/ $scope.sizeRatio) ;			

					$scope.backgroundPosition.left =($scope.product.window.x/$scope.sizeRatio) -  (((img.width/$scope.imageSizeRatio) - ($scope.product.window.w/$scope.sizeRatio))/2 )     + "px ";
					$scope.backgroundPosition.top =  $scope.product.window.y / $scope.sizeRatio + "px";

					$scope.imageStyle = {					
						"background-image":"url('" + $attrs.imageurl  + "')",
						"background-size": "auto "  + $scope.product.window.h / $scope.sizeRatio + "px",
						"background-repeat":"no-repeat", 
						"background-position": $scope.backgroundPosition.left + $scope.backgroundPosition.top,
						"width":$attrs.tmbwidth + "px"

					}
					console.log((img.width/$scope.imageSizeRatio) ,  $scope.product.window.w/$scope.sizeRatio);
					$scope.$apply();				
				}else{ // top case
					$scope.imageSizeRatio = img.width/($scope.product.window.w/ $scope.sizeRatio) ;	

					$scope.backgroundPosition.top = ($scope.product.window.y/$scope.sizeRatio) - (((img.height/$scope.imageSizeRatio) - ($scope.product.window.h/$scope.sizeRatio))/2 ) + "px "	
					$scope.backgroundPosition.left = $scope.product.window.x / $scope.sizeRatio + "px ";
					$scope.imageStyle = {					
						"background-image":"url('" + $attrs.imageurl  + "')",
						"background-size": $scope.product.window.w / $scope.sizeRatio + "px" + " auto",
						"background-repeat":"no-repeat", 
						"background-position": $scope.backgroundPosition.left + $scope.backgroundPosition.top,
						"width":$attrs.tmbwidth + "px"

					}
					$scope.$apply();


				}
				
			}


		  	
		  	//$scope.imageStyle={"width":"500px","height":"400px","background":"pink"}
		  	$scope.product = {"type":"mug","window":{"w":200,"h":200,"x":175,"y":107},"width":600,"height":360,"shortName":"Mug","marketingName":"11oz White Mug","teaser":true,"cropRatio":0.75,"previewImage":"mug/previewImage.png","categoryText":"Ceramic 11oz MUG","children":["CMUG11OZ111MUG"],"index":1};
		  	getImgSize($attrs.imageurl);

	  	
	    }],    
    	templateUrl: 'app/js/directives/productImageDisplayView.html'
  };	
});