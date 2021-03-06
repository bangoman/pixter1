angular.module('app').controller('checkoutCtl', function ($uibModal, $rootScope, apiService, $filter, $scope, formatPriceCurrency, crosstab, productService, $state) {
    var vm = this;

    window.scrollTo(0, 0);

    $scope.tmbWidth = $rootScope.screenW * 0.35;
    //$rootScope.quantity = 0;
    if ($scope.tmbWidth > 180) {
        $scope.tmbWidth = 180

    }

    vm.shipmentMethods = [];


    $scope.priceCurrencyOrder = formatPriceCurrency;


    function generateShippingMethods() {
        $scope.restOfWorld = true;
        angular.forEach($rootScope.currentProduct.finalPrice.shipping, function (value, key) {
            if ($rootScope.currentProduct.finalPrice.shipping[key].region_id == 7) {
                $scope.key = key;
            }

            if (value.region_id == $rootScope.order.country.region.id) {
                vm.shipmentMethods.push(value);
                $scope.restOfWorld = false;
            }
        });

        if ($scope.restOfWorld) {
            vm.shipmentMethods.push($rootScope.currentProduct.finalPrice.shipping[$scope.key]);
        }

        vm.shipmentMethod = vm.shipmentMethods[0];


    }

    generateShippingMethods();
    vm.openCuponModal = function () {
        $uibModal.open({
            templateUrl: 'app/views/cupon_modal.html',
            controller: 'cuponModalCtl as vm',
            backdrop: 'static',
        });
    };

    vm.getDiscountProductPrice = function () {
        return $rootScope.coupon ? $rootScope.currentProduct.finalPrice.price * (100 - $rootScope.coupon.product_discount) / 100 : parseFloat($rootScope.currentProduct.finalPrice.price);
    };

    vm.getDiscountShippingPrice = function () {
        return $rootScope.coupon ? vm.shipmentMethod.price * (100 - $rootScope.coupon.shipping_discount ) / 100 : parseFloat(vm.shipmentMethod.price);
    };

    vm.getTotal = function () {
        return vm.getDiscountProductPrice() + vm.getDiscountShippingPrice();
    };

    vm.getSaving = function () {
        return parseFloat(vm.shipmentMethod.price) + parseFloat($rootScope.currentProduct.finalPrice.price) - vm.getTotal();
    };

    vm.getDiscountPrice = function (price) {
        return $rootScope.coupon ? price * (100 - $rootScope.coupon.shipping_discount ) / 100 : parseFloat(price);
    };

    vm.checkout = function (paymentType) {
        var win = window.open('', "", "width=500, height=500");
        win.document.body.innerHTML = '<h5>Uploading your image ...</h5>';
        var returnAddressPrice = 0;
        var quantity = 1;
        if (properties) {
            quantity = properties.quantity.quantity;
            properties.return_address.discountedPrice = quantity * properties.return_address.discount_price;
            properties.return_address.totalPrice = properties.return_address.discountedPrice;
            returnAddressPrice = properties.return_address.totalPrice;
        }
        var price = $filter('number')(vm.getDiscountProductPrice() + returnAddressPrice, 2);
        var shippingPrice = $filter('number')(vm.getDiscountShippingPrice(), 2);
        productService.sendGAEvent(true, 'send', 'event', 'Checkout', "impression", "flow");
        productService.sendGA('checkout', {
            shipping: shippingPrice,
            revenue: price,
            option: paymentType,
        });
        var watch = $rootScope.$watch('orderKey', function () {
            if ($rootScope.orderKey) {
                win.document.body.innerHTML = '<h5>Processing your order ...</h5>';
                console.log($rootScope.order);
                watch();
                apiService
                    .validateOrder(angular.extend({
                        product_id: $rootScope.currentProduct.id,
                        price: price,
                        curr: $rootScope.productsData.localization.currency.code,
                        quantity: quantity,
                        shipping_method: vm.shipmentMethod.method,
                        shipping_id: vm.shipmentMethod.id,
                        shipping_price: shippingPrice,
                        payment_type: paymentType,
                        coupon_string: $rootScope.coupon ? $rootScope.coupon.coupon_code.replace(/'/g, '') : undefined,
                        properties: properties,
                    }, $rootScope.order, {
                        country: $rootScope.order.country.code,
                        key: $rootScope.orderKey,
                    }))
                    .then(function (data) {
                        $rootScope.order.id = data.order_id;
                        productService.sendGAEvent(true,"send", "event", "Checkout", "order validated by server", "event");
                        productService.sendGA('purchase', {
                            id: data.order_id,
                            shipping: shippingPrice,
                            revenue: price,
                            option: paymentType,
                        });
                        if (data.url) {
                            win.document.body.innerHTML = '<h5>Redirecting you to the payment provider...</h5>';
                            win.location.href = data.url;
                        } else {
                            win.close();
                            $rootScope.CouponMarketingString = false;
                            $state.go('app.thankYou');
                            crosstab.broadcast('p_order_complete',{
                                orderId:data.order_id,
                            });
                        }
                    }, function (data) {
                        win.close();
                        alert(data.error.message);
                    });
            }
        });

    };

    vm.getParamPrice = function (param) {
        if( angular.isDefined(param.chosenOption.price)){
            return param.chosenOption.price;
        }
        return param.chosenOption.pricing.price;
    };

    var properties = getProperties();

    function getProperties() {
        if ($rootScope.currentProduct && $rootScope.currentProduct.params) {
            var properties = {};
            $rootScope.currentProduct.params.forEach(function (param) {
                var property = angular.extend({}, param.chosenOption);
                if (property.pricing) {
                    angular.extend(property, property.pricing);
                    delete property.pricing;
                }
                property.discount_price = parseFloat(
                    $filter('number')(
                        vm.getDiscountPrice(property.price
                        ), 2)
                );
                properties[param.key] = property;
            });
            return properties;
        }
    }


});