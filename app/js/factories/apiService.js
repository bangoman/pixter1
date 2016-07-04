/**
 * Created by ori on 04/07/16.
 */
angular.module('app').factory('apiService', function ($http, uuidService, $q) {
    return {
        validateCoupon: validateCoupon,
        validateOrder: validateOrder,
        upload:upload,
    };

    function request(endPoint, data, method, baseUrl) {
        baseUrl = baseUrl || 'https://api-sg.pixter-media.com/';
        method = method || 'get';
        data = angular.extend({
            session_id: uuidService.getId('session'),
            user_id: uuidService.getId('session'),
            lang: 'en_US',
            metadata: {
                api_key: 'SDKSLIDELY',
                l_version: '1.1.0.0',
                brand: 'none',
                s_version: '1.4.0.0'
            }
        }, data || {});
        var config = {
            url: baseUrl + endPoint,
            method: method,
            paramSerializer: '$httpParamSerializerJQLike'
        };
        if( method === 'get' ){
            config.params = data;
        }else{
            config.data = data;
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
        return request('order/validate', data);
    }

    function upload(dataUrl) {
        return request('image/upload',{
            image_data:dataUrl,
        },'post','https://upload-sg.pixter-media.com/');
    }
});