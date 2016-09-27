/**
 * Created by ori on 06/09/16.
 */
angular.module('app').factory('productService', function ($rootScope,$filter) {

    var currency = 'USD';

    return {
        sendGA: sendGA,
        sendGAEvent: sendGAEvent,
    };
    
    function sendGA(eventName,actionData) {
        var ecommerceProduct = {
            id: $rootScope.currentProduct.id, // (productid)
            name: $rootScope.currentProduct.name, //(productname)
            price: $rootScope.currentProduct.finalPrice.price,
            quantity: getQuantity(),
            category: $rootScope.category.name  //(categoryname)
        };
        var ecommerceActionData = {
            id: $rootScope.currentProduct.id,
            affiliation: $rootScope.apiKey,
            coupon: $rootScope.coupon ? $rootScope.coupon.coupon_code.replace(/'/g, '') : undefined,
        };
        if( actionData ){
            angular.extend(ecommerceActionData,actionData);
        }
        return sendGAEvent(true,'ecommerce',ecommerceProduct,eventName,ecommerceActionData);
    }

    function sendGAEvent() {
        return pLoader.sendGAEvent.apply(pLoader,arguments);
    }

    function getQuantity() {
        var properties = getProperties();
        if (properties) {
            return properties.quantity.quantity;
        }
        return 1;
    }

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
                        getDiscountPrice(property.price
                        ), 2)
                );
                properties[param.key] = property;
            });
            return properties;
        }
    }

    function getDiscountPrice(price) {
        return $rootScope.coupon ? price * (100 - $rootScope.coupon.shipping_discount ) / 100 : parseFloat(price);
    };
});