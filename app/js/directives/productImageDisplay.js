
angular.module('app').directive('productImageDisplay', function ($http) {
	function link(scope, element, attrs,$http) {
		//console.log(attrs.moduleid);
	  }
  	return {	    
	    restrict: 'E',
	    scope: { },
	  	controller: ['$scope','$http','$attrs','$document','$element','$compile', function($scope,$http,$attrs,$document,$element,$compile) {

		//	setInterval(function(){console.log($attrs.zoom) },1000)
			$scope.zoom = 1.1;
			$scope.editMode = $attrs.editmode;
			console.log($attrs);
			$scope.triggerZoom = function(){
				var preW,preH
				preW = $scope.backgroundSize.w;
				preH = $scope.backgroundSize.h;

				$scope.imageSizeRatio = $scope.imageSizeRatio / $scope.zoom;
				$scope.backgroundSize.h = $scope.currentImg.height/$scope.imageSizeRatio;
				$scope.backgroundSize.w = $scope.currentImg.width/$scope.imageSizeRatio;				
				$scope.imageStyle["background-size"] = $scope.backgroundSize.w + "px "  + $scope.backgroundSize.h + "px";
				console.log("i am at left ",$scope.backgroundPosition.left)
				$scope.backgroundPosition.left = parseInt($scope.backgroundPosition.left) - (($scope.backgroundSize.w -  preW)/2) + "px " ;//  * (($scope.zoom -1)/2) + "px ";
				$scope.backgroundPosition.top =parseInt($scope.backgroundPosition.top) -  (($scope.backgroundSize.h -  preH)/2) + "px"//$scope.backgroundSize.h  * (($scope.zoom -1)/2) + "px";								
				console.log("i move left by",(($scope.backgroundSize.w -  preW)/2))
				console.log("i am at left done ",$scope.backgroundPosition.left)


				$scope.imageStyle["background-position"] =  $scope.backgroundPosition.left  + $scope.backgroundPosition.top 
				console.log($scope.imageStyle["background-position"]);
				//console.log("bakcgroundPositionn",$scope.backgroundPosition,"background-size:",$scope.backgroundSize);				
				//$scope.backgroundPosition.top
				

			}
	  		$scope.onRelease = function(event){	  			
	  			$scope.backgroundPosition.top = currentBackgroundPosition.top  //(parseInt($scope.backgroundPosition.top) + event.gesture.deltaY) + "px"  ;
	  			$scope.backgroundPosition.left = currentBackgroundPosition.left// (parseInt($scope.backgroundPosition.left) + event.gesture.deltaX) + "px "  ;



	  		}
	  		var currentBackgroundPosition = {top:"",left:""};
		    $scope.onDrag=function(event){
		    	 currentBackgroundPosition = {top:"",left:""};
			    var limitVertical =   (($scope.currentImg.height/$scope.imageSizeRatio) - ($scope.product.window.h/$scope.sizeRatio));		       
		       var limitHorizontal =   (($scope.currentImg.width/$scope.imageSizeRatio) - ($scope.product.window.w/$scope.sizeRatio));		       
		       currentBackgroundPosition.top = (parseInt($scope.backgroundPosition.top) + event.gesture.deltaY) +"px "; 
		       currentBackgroundPosition.left = (parseInt($scope.backgroundPosition.left) + event.gesture.deltaX) +"px "; 
		       var remainVertical =  limitVertical - (($scope.product.window.y/$scope.sizeRatio) -  parseInt(currentBackgroundPosition.top) ) ;
		       var remainHorizontal =  limitHorizontal - (($scope.product.window.x/$scope.sizeRatio) -  parseInt(currentBackgroundPosition.left) ) ;
		     //  console.log("vertical",remainVertical,limitVertical);
		      //	 console.log("horizontal",remainHorizontal,limitHorizontal);
		       if(remainVertical <= 0 ){
		       		currentBackgroundPosition.top =  (- limitVertical) + ($scope.product.window.y/$scope.sizeRatio) + "px";
		       }else if( remainVertical > limitVertical){
		       		currentBackgroundPosition.top = ($scope.product.window.y/$scope.sizeRatio) + "px";
		       }

		       if(remainHorizontal <= 0 ){
		       		currentBackgroundPosition.left =  (- limitHorizontal) + ($scope.product.window.x/$scope.sizeRatio) + "px ";
		       }else if( remainHorizontal > limitHorizontal){
		       		currentBackgroundPosition.left = ($scope.product.window.x/$scope.sizeRatio) + "px ";
		       }


		        console.log(currentBackgroundPosition.top);
				$scope.imageStyle["background-position"] = currentBackgroundPosition.left + currentBackgroundPosition.top			       	
		       
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
				//$scope.currentBackgroundPosition = {top:"",left:""}								
				$scope.backgroundSize = {w:"",h:""}
				var bpl,vpt
				if(productRatio >= imgRatio){ // Left case
					$scope.imageSizeRatio = img.height/($scope.product.window.h/ $scope.sizeRatio) ;
					bpl = ($scope.product.window.x/$scope.sizeRatio) -  (((img.width/$scope.imageSizeRatio) - ($scope.product.window.w/$scope.sizeRatio))/2 )     + "px ";
					bpt = $scope.product.window.y / $scope.sizeRatio + "px";
					$scope.backgroundPosition.left = bpl
					$scope.backgroundPosition.top =  bpt;

				}else{ // top case
					$scope.imageSizeRatio = img.width/($scope.product.window.w/ $scope.sizeRatio) ;	
					bpl = ($scope.product.window.y/$scope.sizeRatio) - (((img.height/$scope.imageSizeRatio) - ($scope.product.window.h/$scope.sizeRatio))/2 ) + "px ";
					bpt = $scope.product.window.x / $scope.sizeRatio + "px ";
					$scope.backgroundPosition.top = bpl;
					$scope.backgroundPosition.left = bpt

				}
				//$scope.currentBackgroundPosition = {top:bpt,left:bpl};

				$scope.backgroundSize.h = img.height/$scope.imageSizeRatio;
				$scope.backgroundSize.w = img.width/$scope.imageSizeRatio;

				$scope.imageStyle = {					
					"background-image":"url('" + $attrs.imageurl  + "')",
					"background-size": $scope.backgroundSize.w + "px "  + $scope.backgroundSize.h + "px",
					"background-repeat":"no-repeat", 
					"background-position": $scope.backgroundPosition.left + $scope.backgroundPosition.top,
					"width":$attrs.tmbwidth + "px"

				}

				$scope.$apply();
			}


		  	
		  	//$scope.imageStyle={"width":"500px","height":"400px","background":"pink"}
		  	$scope.product = {"type":"mug","window":{"w":200,"h":200,"x":175,"y":107},"width":600,"height":360,"shortName":"Mug","marketingName":"11oz White Mug","teaser":true,"cropRatio":0.75,"previewImage":"mug/previewImage.png","categoryText":"Ceramic 11oz MUG","children":["CMUG11OZ111MUG"],"index":1};
		  	getImgSize($attrs.imageurl);

	  	
	    }],    
    	templateUrl: 'app/js/directives/productImageDisplayView.html'
  };	
});