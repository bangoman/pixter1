angular.module('app').directive('productImageDisplay', function ($http) {
    function link(scope, element, attrs, $http) {
    }

    return {
        restrict: 'E',
        scope: {
            product: '=',
            withCanvas: '=',
            imageUrl: '=',
            appliedChangesFlag: '=',
            finalStep: '=',
            tmbWidth: '=',

        },
        controllerAs: 'vm',
        controller: function ($scope, $http, $attrs, $document, $element, $compile, $rootScope, $state, $q, $ionicScrollDelegate) {

            var vm = this;
            var lastHeight, lastWidth, canvas, ctx;
            console.log($scope.tmbWidth);
//			setInterval(function(){				
//				$scope.triggerPinchZoom($ionicScrollDelegate.getScrollPosition().zoom)
//			},100)

            $scope.editMode = $attrs.editmode;
            $scope.finalImagePosition = {};
            $scope.finalWindowPosition = {};
            $scope.finalWindowSize = {};
            $scope.$watch('product', function () {
                getImgSize($rootScope.imageUrl);

            });
            $scope.$watch('finalStep', function () {
                if ($scope.finalStep) {
                    $scope.backToReality($scope.backgroundPosition, $scope.product.window, $scope.sizeRatio, $scope.imageSizeRatio)

                }

            });

            $scope.onDrag = function (event) {
                if ($attrs.editmode) {
                    //$scope.getPinchZoom();
                    currentBackgroundPosition = {top: "", left: ""};
                    var limitVertical = (($scope.currentImg.height / $scope.imageSizeRatio) - ($scope.product.window.h / $scope.sizeRatio));
                    var limitHorizontal = (($scope.currentImg.width / $scope.imageSizeRatio) - ($scope.product.window.w / $scope.sizeRatio));
                    currentBackgroundPosition.top = (parseInt($scope.backgroundPosition.top) + event.gesture.deltaY) + "px ";
                    currentBackgroundPosition.left = (parseInt($scope.backgroundPosition.left) + event.gesture.deltaX) + "px ";
                    var remainVertical = limitVertical - (($scope.product.window.y / $scope.sizeRatio) - parseInt(currentBackgroundPosition.top) );
                    var remainHorizontal = limitHorizontal - (($scope.product.window.x / $scope.sizeRatio) - parseInt(currentBackgroundPosition.left) );

                    if (remainVertical <= 0) {
                        currentBackgroundPosition.top = (-limitVertical) + ($scope.product.window.y / $scope.sizeRatio) + "px";
                    } else if (remainVertical > limitVertical) {
                        currentBackgroundPosition.top = ($scope.product.window.y / $scope.sizeRatio) + "px";
                    }

                    if (remainHorizontal <= 0) {
                        currentBackgroundPosition.left = (-limitHorizontal) + ($scope.product.window.x / $scope.sizeRatio) + "px ";
                    } else if (remainHorizontal > limitHorizontal) {
                        currentBackgroundPosition.left = ($scope.product.window.x / $scope.sizeRatio) + "px ";
                    }

                    $scope.imageStyle["background-position"] = currentBackgroundPosition.left + currentBackgroundPosition.top

                }

            }


            $scope.backToReality = function (backgroundPosition, productWindow, sizeRatio, imageSizeRatio) {
                backgroundPosition.top = parseInt(backgroundPosition.top);
                backgroundPosition.left = parseInt(backgroundPosition.left);
                productWindow.x = parseInt(productWindow.x);
                productWindow.y = parseInt(productWindow.y);
                productWindow.w = parseInt(productWindow.w);
                productWindow.h = parseInt(productWindow.h);

                $scope.finalImagePosition.top = (backgroundPosition.top) * imageSizeRatio;
                $scope.finalImagePosition.left = (backgroundPosition.left) * imageSizeRatio;

                $scope.finalWindowPosition.y = (((productWindow.y) / sizeRatio) * imageSizeRatio) - $scope.finalImagePosition.top;
                $scope.finalWindowPosition.x = (((productWindow.x) / sizeRatio) * imageSizeRatio) - $scope.finalImagePosition.left;

                $scope.finalWindowSize.height = (productWindow.h / sizeRatio) * imageSizeRatio;
                $scope.finalWindowSize.width = (productWindow.w / sizeRatio) * imageSizeRatio;


                // dealing with canvas export
                canvas = document.getElementById("canvas");
                ctx = canvas.getContext("2d");
                canvas.height = $scope.finalWindowSize.height;
                canvas.width = $scope.finalWindowSize.width;

                ctx.clearRect(0, 0, $scope.currentImg.width, $scope.currentImg.height);
                ctx.save();
                ctx.drawImage($scope.currentImg, -$scope.finalWindowPosition.x, -$scope.finalWindowPosition.y);
                ctx.restore();
                ctx.save()
                dataURL = canvas.toDataURL();
                $rootScope.finalCroppedImageData = dataURL;

                $rootScope.finalCroppedImageUrl = dataURItoBlob(dataURL);
                $state.go('app.orderDetails');

            }
            $scope.applyChanges = function (positionLeft, positionTop, height, width, ratio) {
                $rootScope.disableScroll = false;
                $rootScope.backgroundPositionLeft = parseInt(positionLeft) * ratio;
                $rootScope.backgroundPositionTop = parseInt(positionTop) * ratio;
                $rootScope.backgroundSizeW = width * ratio;
                $rootScope.backgroundSizeH = height * ratio;
                $rootScope.zoomAmountW = width / ($scope.product.window.w / $scope.sizeRatio);
                $rootScope.zoomAmountH = height / ($scope.product.window.h / $scope.sizeRatio);
                $state.go('app.orderDetails');
                $scope.backToReality($scope.backgroundPosition, $scope.product.window, $scope.sizeRatio, $scope.imageSizeRatio)

            }
            $scope.laodAppliedChanges = function () {
                if ($rootScope.backgroundSizeW) {
                    if (($scope.product.window.w / $scope.product.window.h) >= ($scope.backgroundSize.w / $scope.backgroundSize.h)) {
                        $scope.imageSizeRatio = $scope.imageSizeRatio / $rootScope.zoomAmountW;
                    }
                    else {
                        $scope.imageSizeRatio = $scope.imageSizeRatio / $rootScope.zoomAmountH;
                    }
                    $scope.backgroundSize.w = parseInt($rootScope.backgroundSizeW) / $scope.imageSizeRatio;
                    $scope.backgroundSize.h = parseInt($rootScope.backgroundSizeH) / $scope.imageSizeRatio;
                    //var lastToCurrentRatio = parseInt($rootScope.lastBackgroundSize.w) / parseInt($scope.backgroundSize.w) ;

                    $scope.backgroundPosition.left = parseInt($rootScope.backgroundPositionLeft) / $scope.imageSizeRatio;
                    $scope.backgroundPosition.top = parseInt($rootScope.backgroundPositionTop) / $scope.imageSizeRatio;

                    $scope.imageStyle = {
                        "background-image": "url('" + $scope.imageUrl + "')",
                        "background-size": $scope.backgroundSize.w + "px " + $scope.backgroundSize.h + "px",
                        "background-repeat": "no-repeat",
                        "background-position": $scope.backgroundPosition.left + "px " + $scope.backgroundPosition.top + "px",
                        "width": $scope.tmbWidth + "px",
                    }
                    $scope.$apply();


                }
            }
            $scope.initCanvas = function () {
                canvas = document.getElementById("canvas");
                ctx = canvas.getContext("2d");
                $scope.angleInDegrees = 0;
                lastWidth = $scope.currentImg.width;
                lastHeight = $scope.currentImg.height;
            }

            function dataURItoBlob(uri) {
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

            $scope.rotateInProgress = false;
            vm.showLoader = false;

            $scope.startRotateLoader = function (degrees) {
                vm.degrees = degrees;
                vm.showLoader = true;
                setTimeout(function () {
                    $scope.$apply();
                    $scope.rotateBackgroundImage(vm.degrees);

                }, 100)

            }
            $scope.rotateCanvas = function (degrees) {
                return $q(function (resolve, reject) {
                    canvas.height = lastWidth;
                    canvas.width = lastHeight;
                    lastWidth = canvas.width;
                    lastHeight = canvas.height;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(degrees * Math.PI / 180);
                    ctx.drawImage($scope.currentImg, -$scope.currentImg.width / 2, -$scope.currentImg.height / 2);
                    ctx.save()
                    dataURL = canvas.toDataURL();
                    var src = dataURItoBlob(dataURL);
                    resolve(src);
                })

            }
            $scope.rotateBackgroundImage = function (degrees) {

                if (!$scope.rotateInProgress) {
                    $scope.rotateInProgress = true;

                    $scope.rotateCanvas(degrees).then(function (data) {
                        getImgSize(data);
                        vm.showLoader = false;
                        $scope.rotateInProgress = false;

                    })
                }

            }
            $scope.findWindowCenterPositonOnBackground = function () {
                var wx = $scope.product.window.x / $scope.sizeRatio;
                var wy = $scope.product.window.y / $scope.sizeRatio;
                var wh = $scope.product.window.h / $scope.sizeRatio;
                var ww = $scope.product.window.w / $scope.sizeRatio;
                var bt = parseInt($scope.backgroundPosition.top);
                var bl = parseInt($scope.backgroundPosition.left);
                var bw = parseInt($scope.backgroundSize.w);
                var bh = parseInt($scope.backgroundSize.h);

                var centerX = (wx + ww / 2) - bl;
                var centerY = (wy + wh / 2) - bt;
                return {x: centerX, y: centerY}
            }

            $scope.triggerZoom = function (zoom) {
                var center = $scope.findWindowCenterPositonOnBackground();
                var preW, preH
                preW = $scope.backgroundSize.w;
                preH = $scope.backgroundSize.h;
                var tmpImageSizeRatio = $scope.imageSizeRatio / zoom
                if (($scope.currentImg.height / tmpImageSizeRatio) < parseInt($scope.product.window.h / $scope.sizeRatio) || ($scope.currentImg.width / tmpImageSizeRatio) < parseInt($scope.product.window.w / $scope.sizeRatio)) {
                    return false;
                }


                $scope.imageSizeRatio = $scope.imageSizeRatio / zoom;
                $scope.backgroundSize.h = $scope.currentImg.height / $scope.imageSizeRatio;
                $scope.backgroundSize.w = $scope.currentImg.width / $scope.imageSizeRatio;
                $scope.imageStyle["background-size"] = $scope.backgroundSize.w + "px " + $scope.backgroundSize.h + "px";
                $scope.backgroundPosition.left = parseInt($scope.backgroundPosition.left) - (($scope.backgroundSize.w - preW) * (center.x) / $scope.backgroundSize.w) + "px ";//  $scope.backgroundSizeW * (($scope.zoom -1)/2) + "px ";				
                $scope.backgroundPosition.top = parseInt($scope.backgroundPosition.top) - (($scope.backgroundSize.h - preH) * (center.y) / $scope.backgroundSize.h) + "px"//$scope.backgroundSize.h  * (($scope.zoom -1)/2) + "px";		

                if (parseInt($scope.backgroundPosition.left) > ($scope.product.window.x / $scope.sizeRatio)) {
                    $scope.backgroundPosition.left = ($scope.product.window.x / $scope.sizeRatio) + "px ";
                } else if (parseInt($scope.backgroundPosition.left) + parseInt($scope.backgroundSize.w) < ($scope.product.window.x / $scope.sizeRatio) + ($scope.product.window.w / $scope.sizeRatio)) {
                    $scope.backgroundPosition.left = ($scope.product.window.x / $scope.sizeRatio) + ($scope.product.window.w / $scope.sizeRatio) - parseInt($scope.backgroundSize.w) + "px ";
                }

                if (parseInt($scope.backgroundPosition.top) > ($scope.product.window.y / $scope.sizeRatio)) {
                    $scope.backgroundPosition.top = ($scope.product.window.y / $scope.sizeRatio) + "px ";
                } else if (parseInt($scope.backgroundPosition.top) + parseInt($scope.backgroundSize.h) < ($scope.product.window.y / $scope.sizeRatio) + ($scope.product.window.h / $scope.sizeRatio)) {
                    $scope.backgroundPosition.top = ($scope.product.window.y / $scope.sizeRatio) + ($scope.product.window.h / $scope.sizeRatio) - parseInt($scope.backgroundSize.h) + "px ";
                }


                $scope.imageStyle["background-position"] = $scope.backgroundPosition.left + $scope.backgroundPosition.top;

            }

            $scope.onRelease = function (event) {
                $scope.backgroundPosition.top = currentBackgroundPosition.top  //(parseInt($scope.backgroundPosition.top) + event.gesture.deltaY) + "px"  ;
                $scope.backgroundPosition.left = currentBackgroundPosition.left// (parseInt($scope.backgroundPosition.left) + event.gesture.deltaX) + "px "  ;
            }

            var currentBackgroundPosition = {top: "", left: ""};
            if ($attrs.editmode) {
                $rootScope.disableScroll = true;
            }

            document.body.addEventListener('touchmove', function (event) {
                if ($rootScope.disableScroll) {
                    event.preventDefault();
                }
            }, false);


            function getImgSize(imgSrc) {
                $rootScope.imageUrl = imgSrc;
                var newImg = new Image();
                newImg.onload = function () {
                    var height = newImg.height;
                    var width = newImg.width;
                    calculatePosition(newImg);
                }

                newImg.src = imgSrc; // this must be done AFTER setting onload
            }


            function calculatePosition(img) {
                var imgRatio = img.height / img.width;


                var productRatio = $scope.product.window.h / $scope.product.window.w;
                $scope.currentImg = img;
                $scope.product.tmbWidth = parseInt($scope.tmbWidth);
                $scope.product.tmbHeight = $scope.product.tmbWidth * ($scope.product.height / $scope.product.width);
                $scope.sizeRatio = $scope.product.width / $scope.product.tmbWidth;
                $scope.backgroundPosition = {top: "", left: ""}
                $scope.backgroundSize = {w: "", h: ""}
                var bpl, vpt

                if (productRatio >= imgRatio) { // Left case
                    $scope.imageSizeRatio = img.height / ($scope.product.window.h / $scope.sizeRatio);
                    bpl = ($scope.product.window.x / $scope.sizeRatio) - (((img.width / $scope.imageSizeRatio) - ($scope.product.window.w / $scope.sizeRatio)) / 2 ) + "px ";
                    bpt = $scope.product.window.y / $scope.sizeRatio + "px";
                    $scope.backgroundPosition.left = bpl
                    $scope.backgroundPosition.top = bpt;

                } else { // top case
                    $scope.imageSizeRatio = img.width / ($scope.product.window.w / $scope.sizeRatio);
                    bpl = ($scope.product.window.y / $scope.sizeRatio) - (((img.height / $scope.imageSizeRatio) - ($scope.product.window.h / $scope.sizeRatio)) / 2 ) + "px ";
                    bpt = $scope.product.window.x / $scope.sizeRatio + "px ";
                    $scope.backgroundPosition.top = bpl;
                    $scope.backgroundPosition.left = bpt

                }

                $scope.backgroundSize.h = img.height / $scope.imageSizeRatio;
                $scope.backgroundSize.w = img.width / $scope.imageSizeRatio;

                $scope.imageStyle = {
                    "background-image": "url('" + $scope.imageUrl + "')",
                    "background-size": $scope.backgroundSize.w + "px " + $scope.backgroundSize.h + "px",
                    "background-repeat": "no-repeat",
                    "background-position": $scope.backgroundPosition.left + $scope.backgroundPosition.top,
                    "width": $scope.tmbWidth + "px",
                }

                if ($scope.withCanvas) {
                    $scope.initCanvas();
                }

                if ($scope.appliedChangesFlag) {
                    $scope.laodAppliedChanges();

                }
                $scope.$apply();

            }

        },
        templateUrl: 'app/js/directives/productImageDisplayView.html'
    };
});