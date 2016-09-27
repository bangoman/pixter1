/**
 * Created by ori on 04/07/16.
 */
angular.module('app').factory('apiService', function ($http, $rootScope, uuidService, $q, $httpParamSerializerJQLike) {
    return {
        validateCoupon: validateCoupon,
        validateOrder: validateOrder,
        upload: upload,
        getBranding: getBranding,
        getProducts: getProducts,
        getCountries: getCountries
    };

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }


    function request(endPoint, data, method, baseUrl) {
        baseUrl = baseUrl || $rootScope.ordersApi;
        method = method || 'get';
        data = angular.extend({
            session_id: uuidService.getId('session'),
            user_id: uuidService.getId('session'),
            lang: 'en_US',
            metadata: {
                api_key: $rootScope.pixKey,
                l_version: '1.1.0.0',
                brand: 'none',
                s_version: '1.4.0.0'
            }
        }, data || {});
        var config = {
            url: baseUrl + endPoint,
            method: method,
            paramSerializer: '$httpParamSerializerJQLike',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
        };
        if (method === 'get') {
            config.params = data;
            if ($rootScope.currencyCode) {
                config.params.currency_code = $rootScope.currencyCode;
            }
            if ($rootScope.lang) {
                config.params.language = $rootScope.lang;
            }
        } else {
            config.data = $httpParamSerializerJQLike(data);
        }
        return $http(config).then(function (res) {
            var data = res.data;
            if (data.error) {
                return $q.reject(data);
            }
            return data;
        });
    }

    function validateCoupon(data) {
        return request('campaign/validateCoupon', data);
    }

    function validateOrder(data) {
        console.log(data);
        return request('order/validate', data);
    }

    function upload(dataUrl) {
        return request('image/upload', {
            image_data: dataUrl,
        }, 'post', 'https://upload-sg.pixter-media.com/');
    }

    function getProducts(w, h) {
        return request(
            '/api/v2/category/get_list',
            {
                api_key: $rootScope.apiKey,
                store_id: $rootScope.storeId,
                add_products: true,
                img_w: w,
                img_h: h,
            },
            'get',
            $rootScope.baseApi
        );


    }

    function getBranding() {
        return request(
            '/api/v2/store/init',
            {
                store_id: $rootScope.storeId,
                api_key: $rootScope.apiKey,
                obj_id: getParameterByName('objId'),
                translation: 'True',
            },
            'get',
            $rootScope.baseApi);

    }

    function getCountries() {
        return request(
            '/api/v2/country/',
            {
                api_key: $rootScope.apiKey,
                store_id: $rootScope.storeId,
                add_products: true,
            },
            'get',
            $rootScope.baseApi
        );

    }


});