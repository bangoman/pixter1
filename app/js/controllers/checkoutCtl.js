angular.module('app').controller('checkoutCtl', function ($uibModal, $rootScope, apiService, $filter,$scope, formatPriceCurrency) {
    var vm = this;

    $scope.tmbWidth = $rootScope.screenW*0.35;
    //$rootScope.quantity = 0;
    if($scope.tmbWidth > 180){
        $scope.tmbWidth = 180

    }
   
    vm.shipmentMethods = [];


    $scope.priceCurrencyOrder = formatPriceCurrency;


    function generateShippingMethods(){
        $scope.restOfWorld = true;
        angular.forEach($rootScope.currentProduct.finalPrice.shipping, function(value, key) {            
            if($rootScope.currentProduct.finalPrice.shipping[key].region_id == 7){
                $scope.key = key;
            }

            if(value.region_id == $rootScope.order.country.region.id){
                vm.shipmentMethods.push(value);
                $scope.restOfWorld = false;
            }
        });

        if($scope.restOfWorld){
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
        win.document.body.innerHTML = 'Processing...';
        var returnAddressPrice = 0;
        var quantity = 1;
        if( properties ){
            quantity = properties.quantity.quantity;
            properties.return_address.discountedPrice = quantity * properties.return_address.discount_price;
            properties.return_address.totalPrice = properties.return_address.discountedPrice;
            returnAddressPrice = properties.return_address.totalPrice;
        }
        var watch = $rootScope.$watch('order.key',function () {
            if( $rootScope.order.key ){
                watch();
                apiService
                    .validateOrder(angular.extend({
                        product_id: $rootScope.currentProduct.id,
                        price: $filter('number')(vm.getDiscountProductPrice() + returnAddressPrice, 2),
                        curr: $rootScope.productsData.localization.currency.code,
                        quantity: quantity,
                        shipping_method: vm.shipmentMethod.method,
                        shipping_id: vm.shipmentMethod.id,
                        shipping_price: $filter('number')(vm.getDiscountShippingPrice(), 2),
                        payment_type: paymentType,
                        coupon_string: $rootScope.coupon ? $rootScope.coupon.coupon_code.replace(/'/g, '') : undefined,
                        properties:properties,
                    }, $rootScope.order,{
                        country: $rootScope.order.country.code,
                    }))
                    .then(function (data) {
                        win.location.href = data.url;
                                                 
                    },function (data) {
                        win.close();
                        alert(data.error.message);
                    });
            }
        });

    };

    var properties = getProperties();

    function getProperties() {
        if( $rootScope.currentProduct && $rootScope.currentProduct.params ){
            var properties = {};
            $rootScope.currentProduct.params.forEach(function (param) {
                var property = angular.extend({},param.chosenOption);
                if(property.pricing) {
                    angular.extend(property, property.pricing);
                    delete property.pricing;
                }
                property.discount_price = parseFloat(
                    $filter('number')(
                        vm.getDiscountPrice(property.price
                        ),2)
                );
                properties[param.key] = property;
            });
            return properties;
        }
    }
});