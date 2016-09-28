angular.module('app').controller('mainCtl', function (message, $uibModal, $state, $rootScope, $http, $stateParams, $scope, $location, $timeout, localStorageService, $q, crosstab, apiService, productService) {
    var vm = this;
    vm.state = $state;
    $scope.loading = true;
    $rootScope.baseApi = 'http://ec2-52-201-250-90.compute-1.amazonaws.com:8000';
    $rootScope.ordersApi = 'https://api-sg.pixter-media.com/';
    if (location.hostname == "pixter-loader-assets.s3.amazonaws.com") {
        console.log = function () {
        };
        console.error = function () {
        };
    }
    var locationSearchWatcher = $rootScope.$watch(function () {
        return $location.search().apiKey;
    }, function () {
        locationSearchWatcher();

        if (!inIframe()) {
            if (sessionStorage.getItem('.imageUrl') && getParameterByName("imgUrl", location.search).indexOf("blob:") != -1) {
                setImageUrl(sessionStorage.getItem('.imageUrl'));
            } else {
                setImageUrl(getParameterByName("imgUrl", location.search));
            }

            afterImageLoaded();
        } else {
            message('init');
            if( sessionStorage.getItem('.imageUrl') ){
                setImageUrl(sessionStorage.getItem('.imageUrl'));
            }
        }

    });

    window.addEventListener('message', function (e) {
        if (e.data.type == "pixter") {
            var url = e.data.img;
            try{
                sessionStorage.setItem('.imageUrl', url);
            }catch (e){
                console.error(e);
            }
            var imgurl = url;
            setImageUrl(url);
            afterImageLoaded();
        }
        $timeout(function () {
            if (e.data == "p_order_complete") {
                crosstab.broadcast('p_order_complete');
                $state.go('app.thankYou');
            }
            else if ((e.data) == "p_order_canceled") {
                crosstab.broadcast('p_order_canceled');
            }
        });
    }, false);

    window.onbeforeunload = function () {
        crosstab.broadcast('close');
    };

    crosstab.on('close', function () {
        message('close');
    });

    crosstab.on('p_order_complete', function () {
        message('p_order_complete');
    });

    crosstab.on('p_order_canceled', function () {
        message('p_order_canceled');
    });


    // $rootScope.screenW = document.body.clientWidth;
    Object.defineProperties($rootScope, {
        screenW: {
            get: function () {
                return document.body.clientWidth;
            },
        },
    });
    $rootScope.disableScroll = false;
    //$rootScope.imageUrl = "image.jpg";

    $rootScope.previewCatalogParams = $stateParams;


    //$state.go('app.shop');
    vm.close = function () {
        message('close');
        window.close();
    };

    vm.learnMore = function () {
        $uibModal.open({
            templateUrl: 'app/views/learn_more.html',
            controller: 'learnMoreCtl as vm',
            backdrop: 'static',
        });
    }

    vm.stateIsShop = function () {
        if (($state.current.name == 'app.shop' || $state.current.name == 'app.sliderShop') && $state.params.subcategories != "true") {
            return true;
        } else {
            return false;
        }
    }

    vm.getViewHeader = function () {
        if ($rootScope.brandingData) {
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
    };


    vm.goBack = function () {
        $rootScope.CouponMarketingString = false;
        if ($state.current.name == 'app.preview') {

            if ($rootScope.productsData.display.type == "OSS") {
                return $state.go('app.sliderShop');
            }
            return $state.go('app.shop');
        }
        if ($state.params.subcategories == 'true') {
            if ($rootScope.productsData.display.type == "OSS") {
                return $state.go('app.sliderShop');
            }
            return $state.go('app.shop', {subcategories: false});
        }
        if ($state.current.name == 'app.edit') {
            $rootScope.imageUrl = $rootScope.originalImageUrl;
            return $state.go('app.preview');
        }
        if ($state.current.name == 'app.orderDetails') {
            return $state.go('app.preview');
        }
        if ($state.current.name == 'app.checkout') {
            $rootScope.coupon = undefined;
            return $state.go('app.orderDetails');
        }
    };

    $rootScope.reload = function () {
        $scope.loading = true;
        afterImageLoaded();
    };

    setTimeout(function(){
        console.log("here");
        setImageUrl("data:image/png;base64,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")

    }, 3000);

    // Usage
    function dataURItoBlob(uri) {
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

    function setImageUrl(url) {
        if (url) {
            if (isDatauri(url)) {
                url = dataURItoBlob(url);
            }
            var isSdk = getParameterByName("sdk", location.search);
            $rootScope.originalImageUrl = $rootScope.imageUrl = url;
            console.log(isSdk,"!!!",location.search);
            if(isSdk){
                afterImageLoaded()
            }else{
                message('image_received', url.replace("%3A", ":"));    
            }
            


        }
    }

    function isDatauri(str) {
        return str.indexOf('data:') === 0
    }

    function inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    function afterImageLoaded() {
        //$rootScope.imageUrl = getParameterByName("imageUrl",location.search);//"image.jpg";
        $rootScope.apiKey = getParameterByName("apiKey", location.search);//"d0d01fe4ebaca56ab78cab9e9c5476e569276784";
        $rootScope.storeId = getParameterByName("storeId", location.search); //"87CD192192A547"
        $rootScope.bgs = getParameterByName("bgs", location.search); //"87CD192192A547"
        $rootScope.bgs = JSON.parse($rootScope.bgs);
        pLoader.initV3Ga($rootScope.apiKey, "UA-55216316-17", '249222d593798049e23e4fd3f00ac0ec6052b3bb', 'B522BFCF646D4F', "UA-55216316-18");
        getCountry();
        $rootScope.originalImageUrl = $rootScope.imageUrl;
        var promises = [
            getBranding(),
            getImgSize()
                .then(function (dimensions) {
                    var height = dimensions.height;
                    var width = dimensions.width;
                    $rootScope.imageHeight = height;
                    $rootScope.imageWidth = width;
                    return getProducts(width, height);
                }),
        ];
        return $q.all(promises).then(function () {
            var watch = $rootScope.$watch('currentProduct', function () {
                if ($rootScope.currentProduct) {
                    watch();
                    if ($state.current.name === 'app.sliderShop') {
                        productService.sendGAEvent(true, 'send', 'event', 'Catalog', 'impression', 'visible flow');
                    } else {
                        productService.sendGAEvent(true, 'send', 'event', 'one stop shop', 'important action');
                    }
                }
            });
            var found = false;
            angular.forEach($rootScope.productsData.objects, function (category, key) {
                if (category.id == $rootScope.startFromPreviewMode) {
                    $rootScope.category = category;
                    $rootScope.currentProduct = category.products[0];
                    found = true


                }
            });
            if (found) {
                return $state.go('app.preview');
            }
            if ($rootScope.productsData.display.type == "OSS") {
                return $state.go('app.sliderShop');
            }
            return $state.go('app.shop');
        });
    }

    function getImgSize() {
        return $q(function (resolve, reject) {
            var newImg = new Image();
            newImg.onload = function () {
                resolve({
                    height: newImg.height,
                    width: newImg.width,
                });
            };
            newImg.onerror = reject;
            newImg.src = $rootScope.imageUrl;
            // this must be done AFTER setting onload
        });

    }

    function getBranding() {
        return apiService.getBranding()
            .then(function (res) {
                console.log("init", res);
                $rootScope.brandingData = res;
                $rootScope.pixKey = res.initdata.pix_apikey;
                $rootScope.startFromPreviewMode = false;
                if (res.next.storestage.category_id) {
                    $rootScope.startFromPreviewMode = res.next.storestage.category_id;

                }
                generateBrandingStyle();
            }).then(function () {

                console.log("branding", $rootScope.brandingData);
            });
    }

    function getProducts(w, h) {
        return apiService.getProducts(w, h)
            .then(function (res) {
                console.log("product res", res);
                $rootScope.productsData = res;
                pLoader.setCurrency(res.localization.currency.code);
                $scope.loading = false;
                $scope.animateOpacity();
                $rootScope.$broadcast("productArrive");
                // if (res.data.display.type == "OSS") {
                //     $state.go('app.sliderShop');
                // }
                // else {
                //     $state.go('app.shop');
                // }
                $rootScope.currencySymbol = res.localization.currency.symbol
            });
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function generateBrandingStyle() {
        $rootScope.brandingStyle = {
            generalButton: {
                "background-color": $rootScope.brandingData.branding.buttons.backgroundcolor,
                "color": $rootScope.brandingData.branding.buttons.textcolor
            },
            header: {
                "background-color": $rootScope.brandingData.branding.headers.backgroundcolor,
                "color": $rootScope.brandingData.branding.headers.textcolor,
                button: {
                    "color": $rootScope.brandingData.branding.headers.linkcolor
                }
            },
            oss: {
                description: {
                    "background-color": $rootScope.brandingData.branding.oss_product.description.backgroundcolor
                },
                title: {
                    "background-color": $rootScope.brandingData.branding.oss_product.title.backgroundcolor
                },
            },
            spcialOffer: {
                "background-color": $rootScope.brandingData.branding.special_offer.backgroundcolor,
                "color": $rootScope.brandingData.branding.special_offer.textcolor
            },
            text: {
                "color": $rootScope.brandingData.branding.text.textcolor
            },
            logo: $rootScope.brandingData.branding.logo

        }
    }

    //$scope.countryApi = 'http://ec2-52-201-250-90.compute-1.amazonaws.com:8000/api/v2/country/?user=demo';

    function getCountry() {
        apiService.getCountries()
            .then(function (res) {
                $rootScope.countries = res.objects;
            });
    }


    $scope.animateOpacity = function () {
        document.getElementById('pixter-responsive-store').classList.add('opacity-animation');
    }

    $rootScope.translate = function (term) {
        if( $rootScope.brandingData ){
            return $rootScope.brandingData.translation.objects_dict[term] || term;
        }
        return term;
    };

});