angular.module('app').factory('formatPriceCurrency', function () {

    return function (price, currency) {
        price = price || 0;
        var p = price.toFixed(2);
        if (currency == "$") {
            return (currency + p);
        }
        return (p + currency);
    }


});