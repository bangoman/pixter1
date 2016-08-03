angular.module('app').controller('checkoutCtl', function ($uibModal, $rootScope, apiService, $filter,$scope) {
    var vm = this;
    $scope.tmbWidth = $rootScope.screenW*0.35;
    $rootScope.quantity = 0;
    if($scope.tmbWidth > 180){
        $scope.tmbWidth = 180

    }
   
    vm.shipmentMethods = [];
    angular.forEach($rootScope.currentProduct.quantities[$rootScope.quantity].pricing.shipping, function(value, key) {
        $scope.restOfWorld = true;

        if($rootScope.currentProduct.quantities[$rootScope.quantity].pricing.shipping[key].region_id == 7){
            $scope.key = key;
        }
             console.log("$rootScope.quantity",$rootScope.quantity);
             console.log("$scope.key = key;",$scope.key);
             console.log("$rootScope.order",$rootScope.order);

        if(value.region_id == $rootScope.order.country.region.id){
            vm.shipmentMethods.push(value);
            $scope.restOfWorld = false;
        }
    });

    if($scope.restOfWorld){
        vm.shipmentMethods.push($rootScope.currentProduct.quantities[$rootScope.quantity].pricing.shipping[$scope.key]);
    }

    vm.shipmentMethod = vm.shipmentMethods[0];
    
    vm.openCuponModal = function () {
        $uibModal.open({
            templateUrl: 'app/views/cupon_modal.html',
            controller: 'cuponModalCtl as vm',
            backdrop: 'static',
        });
    };
    
    vm.getDiscountProductPrice = function () {
        return $rootScope.coupon ? $rootScope.currentProduct.quantities[$rootScope.quantity].price * (100 - $rootScope.coupon.product_discount) / 100 : parseFloat($rootScope.currentProduct.quantities[$rootScope.quantity].price);
    };

    vm.getDiscountShippingPrice = function () {
        return $rootScope.coupon ? vm.shipmentMethod.price * (100 - $rootScope.coupon.shipping_discount ) / 100 : parseFloat(vm.shipmentMethod.price);
    };

    vm.getTotal = function () {
        return vm.getDiscountProductPrice() + vm.getDiscountShippingPrice();
    };

    vm.getSaving = function () {
        return parseFloat(vm.shipmentMethod.price) + parseFloat($rootScope.currentProduct.quantities[$rootScope.quantity].price) - vm.getTotal();
    };
    vm.checkout = function (paymentType) {
        var win = window.open('', "", "width=500, height=500");
        win.document.body.innerHTML = 'Processing...';
        return apiService
            .validateOrder(angular.extend({
                product_id: $rootScope.currentProduct.id,
                price: $filter('number')(vm.getDiscountProductPrice(), 2),
                curr: 'USD',
                quantity: 1,
                shipping_method: vm.shipmentMethod.id,
                shipping_price: $filter('number')(vm.getDiscountShippingPrice(), 2),
                payment_type: paymentType,
                coupon_string: $rootScope.coupon ? $rootScope.coupon.coupon_code.replace(/'/g, '') : undefined,
                properties:getProperties(),
            }, $rootScope.order,{
                country: $rootScope.order.country.code,
            }))
            .then(function (data) {
                win.location.href = data.url;
            },function (data) {
                win.close();
                alert(data.error.message);
            });
    };

    function getProperties() {
        var properties = {};
        $rootScope.currentProduct.params.forEach(function (param) {
            var property = angular.extend({},param.chosenOption);
            if(property.pricing) {
                angular.extend(property, property.pricing);
                delete property.pricing;
            }
            properties[param.key] = property;
        });
        return properties;
    }
});