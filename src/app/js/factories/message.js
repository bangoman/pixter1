angular.module('app').factory('message', function () {
    return function message(type, data) {
        return window.top.postMessage({
            type: 'pixter_' + type,
            data: data,
        },'*');

    };
});