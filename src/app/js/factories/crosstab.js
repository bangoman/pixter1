/**
 * Created by ori on 15/08/16.
 */
angular.module('app').factory('crosstab', function ($timeout) {

    return {
        broadcast: broadcast,
        on: on,
    };

    function broadcast(eventName, data) {
        return localStorageCommunicator.broadcast(eventName, data);
    }

    function on(eventName, cb) {
        return localStorageCommunicator.on(eventName, function () {
            $timeout(cb);
        });
    }
});