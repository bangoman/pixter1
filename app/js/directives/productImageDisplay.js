
angular.module('app').directive('productImageDisplay', function ($http) {
	function link(scope, element, attrs,$http) {
		//console.log(attrs.moduleid);
	  }
  	return {	    
	    restrict: 'E',
	    scope: {
	    	product:'=',
	    	withCanvas: '=',
	    	imageUrl: '=',
	    	appliedChangesFlag: '='

	     },
	  	controller: ['$scope','$http','$attrs','$document','$element','$compile','$rootScope','$state', function($scope,$http,$attrs,$document,$element,$compile,$rootScope,$state) {

		//	setInterval(function(){console.log($attrs.zoom) },1000)
			var lastHeight ,lastWidth,canvas,ctx;
			$scope.editMode = $attrs.editmode;
			$scope.$watch('product', function() {
				//console.log("product changed");
				getImgSize($scope.imageUrl);
			        
			});
			$scope.applyChanges = function(positionLeft,positionTop,height,width,ratio){
				
				$rootScope.backgroundPositionLeft = parseInt(positionLeft) * ratio;
				$rootScope.backgroundPositionTop = parseInt(positionTop) * ratio;
				console.log($rootScope.backgroundPositionTop, "!@#");
				$rootScope.backgroundSizeW = width * ratio;
				$rootScope.backgroundSizeH = height * ratio;
				$rootScope.zoomAmountW = width / ($scope.product.window.w/$scope.sizeRatio);				
                $rootScope.zoomAmountH = height / ($scope.product.window.h/$scope.sizeRatio);
                $state.go('app.orderDetails');
               
			}
            $scope.laodAppliedChanges = function(){
            	if(($scope.product.window.w/$scope.product.window.h)>=($scope.backgroundSize.w/$scope.backgroundSize.h)){
	            	$scope.imageSizeRatio = $scope.imageSizeRatio /	 $rootScope.zoomAmountW;	
				}
				else{
	            	$scope.imageSizeRatio = $scope.imageSizeRatio /	 $rootScope.zoomAmountH;						
                }
            		$scope.backgroundSize.w = parseInt($rootScope.backgroundSizeW)/$scope.imageSizeRatio;
					$scope.backgroundSize.h = parseInt($rootScope.backgroundSizeH)/$scope.imageSizeRatio;
				//var lastToCurrentRatio = parseInt($rootScope.lastBackgroundSize.w) / parseInt($scope.backgroundSize.w) ;
				console.log("image size ratio!!",$scope.imageSizeRatio);
            	$scope.backgroundPosition.left = parseInt($rootScope.backgroundPositionLeft) / $scope.imageSizeRatio;
				$scope.backgroundPosition.top = parseInt($rootScope.backgroundPositionTop) / $scope.imageSizeRatio;

                $scope.imageStyle = {					
					"background-image":"url('" + $scope.imageUrl  + "')",
					"background-size": $scope.backgroundSize.w + "px "  + $scope.backgroundSize.h + "px",
					"background-repeat":"no-repeat", 
					"background-position": $scope.backgroundPosition.left + "px " + $scope.backgroundPosition.top + "px",
					"width":$attrs.tmbwidth + "px",
				}
				$scope.$apply();
				console.log("la", $scope.imageSizeRatio)
                console.log("apply=", $scope.imageStyle)
            }
			$scope.initCanvas = function (){
				canvas= document.getElementById("canvas");					
				ctx=canvas.getContext("2d");
				$scope.angleInDegrees=0;				
				lastWidth = $scope.currentImg.width;
				lastHeight = $scope.currentImg.height;
			}
			function dataURItoBlob( uri ) {
			    // convert base64/URLEncoded data component to raw binary data held in a string
			    var DOMURL = window.URL || window.webkitURL || window;
			    var byteString,
			        mimeString,
			        ia;

			    if ( uri.split( ',' )[0].indexOf( 'base64' ) >= 0 ) {

			        byteString = atob( uri.split(',')[1] );
			    }
			    else {

			        byteString = unescape( uri.split(',')[1] );
			    }
			    // separate out the mime component
			    mimeString = uri.split( ',' )[ 0 ].split( ':' )[ 1 ].split( ';' )[ 0 ];

			    // write the bytes of the string to a typed array
			    ia = new Uint8Array( byteString.length );

			    for ( var i = 0; i < byteString.length; i++ ) {
			        
			        ia[ i ] = byteString.charCodeAt( i );
			    }

			    var blob = new Blob( [ ia ], {
			        type: mimeString
			    });
			    return DOMURL.createObjectURL( blob )
			}
			$scope.rotateBackgroundImage = function(degrees){


				canvas.height = lastWidth;	
				canvas.width = lastHeight;
				lastWidth = canvas.width;
				lastHeight = canvas.height;

			    ctx.clearRect(0,0,canvas.width,canvas.height);
			    ctx.save();
			    ctx.translate(canvas.width/2,canvas.height/2);
			    ctx.rotate(degrees*Math.PI/180);
			    ctx.drawImage($scope.currentImg,-$scope.currentImg.width/2,-$scope.currentImg.height/2);
			    ctx.restore();
			    ctx.save()			    
			    dataURL  = canvas.toDataURL();

			    $rootScope.imageUrl = dataURItoBlob( dataURL );
			    getImgSize($rootScope.imageUrl);
			    console.log($scope.angleInDegrees);
			    $scope.angleInDegrees += degrees;

			}
			$scope.findWindowCenterPositonOnBackground = function(){
				var wx = $scope.product.window.x/$scope.sizeRatio;
				var wy = $scope.product.window.y / $scope.sizeRatio;
				var wh = $scope.product.window.h/$scope.sizeRatio;
				var ww = $scope.product.window.w/$scope.sizeRatio;
				var bt = parseInt($scope.backgroundPosition.top);	
				var bl = parseInt($scope.backgroundPosition.left);		
				var bw = parseInt($scope.backgroundSize.w);		
				var bh = parseInt($scope.backgroundSize.h);

				var centerX  = (wx + ww/2) - bl;
				var centerY  = (wy + wh/2) - bt;
				return {x:centerX,y:centerY} 			
			}

			$scope.triggerZoom = function(zoom){
				var center = $scope.findWindowCenterPositonOnBackground();
				var preW,preH
				preW = $scope.backgroundSize.w;
				preH = $scope.backgroundSize.h;				
               // console.log( $scope.backgroundPosition.left, $scope.backgroundPosition.top,$scope.backgroundSize.w,$scope.backgroundSize.h)
				var tmpImageSizeRatio = $scope.imageSizeRatio / zoom
				if(($scope.currentImg.height/tmpImageSizeRatio) < parseInt($scope.product.window.h/$scope.sizeRatio) || ($scope.currentImg.width/tmpImageSizeRatio) < parseInt($scope.product.window.w/$scope.sizeRatio)){
					return false;
				}	


				$scope.imageSizeRatio = $scope.imageSizeRatio / zoom;				
				$scope.backgroundSize.h = $scope.currentImg.height/$scope.imageSizeRatio;
				$scope.backgroundSize.w = $scope.currentImg.width/$scope.imageSizeRatio;	
				$scope.imageStyle["background-size"] = $scope.backgroundSize.w + "px "  + $scope.backgroundSize.h + "px";
				$scope.backgroundPosition.left = parseInt($scope.backgroundPosition.left) - (($scope.backgroundSize.w -  preW) * (center.x)/$scope.backgroundSize.w) + "px " ;//  $scope.backgroundSizeW * (($scope.zoom -1)/2) + "px ";				
				$scope.backgroundPosition.top = parseInt($scope.backgroundPosition.top) -  (($scope.backgroundSize.h -  preH)* (center.y)/$scope.backgroundSize.h) + "px"//$scope.backgroundSize.h  * (($scope.zoom -1)/2) + "px";		
				if(parseInt($scope.backgroundPosition.left) > ($scope.product.window.x/$scope.sizeRatio)){
					$scope.backgroundPosition.left = ($scope.product.window.x/$scope.sizeRatio) + "px ";
				}else if(parseInt($scope.backgroundPosition.left) + parseInt($scope.backgroundSize.w) < ($scope.product.window.x/$scope.sizeRatio) + ($scope.product.window.w/$scope.sizeRatio)   ){
					$scope.backgroundPosition.left = ($scope.product.window.x/$scope.sizeRatio) + ($scope.product.window.w/$scope.sizeRatio) - parseInt($scope.backgroundSize.w) + "px ";
				}

				if(parseInt($scope.backgroundPosition.top) > ($scope.product.window.y/$scope.sizeRatio)){
					$scope.backgroundPosition.top = ($scope.product.window.y/$scope.sizeRatio) + "px ";
				}else if(parseInt($scope.backgroundPosition.top) + parseInt($scope.backgroundSize.h) < ($scope.product.window.y/$scope.sizeRatio) + ($scope.product.window.h/$scope.sizeRatio)   ){
					$scope.backgroundPosition.top = ($scope.product.window.y/$scope.sizeRatio) + ($scope.product.window.h/$scope.sizeRatio) - parseInt($scope.backgroundSize.h) + "px ";
				}


				$scope.imageStyle["background-position"] =  $scope.backgroundPosition.left  + $scope.backgroundPosition.top ;				
				//console.log("bakcgroundPositionn",$scope.backgroundPosition,"background-size:",$scope.backgroundSize);				
				//$scope.backgroundPosition.top
				

			}

	  		$scope.onRelease = function(event){	  			
	  			$scope.backgroundPosition.top = currentBackgroundPosition.top  //(parseInt($scope.backgroundPosition.top) + event.gesture.deltaY) + "px"  ;
	  			$scope.backgroundPosition.left = currentBackgroundPosition.left// (parseInt($scope.backgroundPosition.left) + event.gesture.deltaX) + "px "  ;
               //console.log("bpldb",$scope.backgroundPosition.left);
			   //console.log("bptdb",$scope.backgroundPosition.top);



	  		}
	  		var currentBackgroundPosition = {top:"",left:""};
			document.body.addEventListener('touchmove', function(event) {
		      console.log(event.source);
		      //if (event.source == document.body)
		    	if($attrs.editmode){		      
		        	event.preventDefault();
		        }
		    }, false);		    	


		    $scope.onDrag=function(event){
		    	if($attrs.editmode){

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


			       // console.log(currentBackgroundPosition.top);
					$scope.imageStyle["background-position"] = currentBackgroundPosition.left + currentBackgroundPosition.top
					//console.log("bplda",$scope.backgroundPosition.left);
				  //  console.log("bptda",$scope.backgroundPosition.top);			       				       
		    	}

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
					"background-image":"url('" + $scope.imageUrl  + "')",
					"background-size": $scope.backgroundSize.w + "px "  + $scope.backgroundSize.h + "px",
					"background-repeat":"no-repeat", 
					"background-position": $scope.backgroundPosition.left + $scope.backgroundPosition.top,
					"width":$attrs.tmbwidth + "px",
				}
				// console.log( $scope.imageStyle)
				if($scope.withCanvas){
					$scope.initCanvas();
				}

				if($scope.appliedChangesFlag){
						$scope.laodAppliedChanges();	

				}
				$scope.$apply();
//				$scope.triggerZoom();
               // console.log($scope.appliedChangesFlag)

			}
    

		  	//$scope.imageStyle={"width":"500px","height":"400px","background":"pink"}
		  	//$scope.product = {"type":"mug","window":{"w":200,"h":200,"x":175,"y":107},"width":600,"height":360,"shortName":"Mug","marketingName":"11oz White Mug","teaser":true,"cropRatio":0.75,"previewImage":"mug/previewImage.png","categoryText":"Ceramic 11oz MUG","children":["CMUG11OZ111MUG"],"index":1};
		  	getImgSize($scope.imageUrl);

	  	
	    }],    
    	templateUrl: 'app/js/directives/productImageDisplayView.html'
  };	
});