/**
 * Created by ori on 15/08/16.
 */
angular.module('app').factory('localStorageCommunicator', function () {
    window.addEventListener('storage', function (storageEvent) {
        if (storageEvent.key === 'localStorageCommunicator') {
            var e = JSON.parse(localStorage.getItem('localStorageCommunicator'));
            dispatchEventToWindow(e);
        }
    });

    return {
        broadcast: broadcast,
        on: on,
    };

    function broadcast(eventName, data) {
        var e = {
            random: Math.random(),
            name: eventName,
            data: data,
        };
        localStorage.setItem('localStorageCommunicator', JSON.stringify(e));
        dispatchEventToWindow(e);
    }

    function on(eventName, cb) {
        window.addEventListener('localStorageCommunicator.' + eventName,function (windowEvent) {
            var e = windowEvent.detail;
            var newE = angular.extend({},e);
            delete newE.random;
            cb(newE);
        });
    }

    function dispatchEventToWindow(e) {
        var event = new CustomEvent('localStorageCommunicator.' + e.name, {detail: e});
        window.dispatchEvent(event);
    }
});