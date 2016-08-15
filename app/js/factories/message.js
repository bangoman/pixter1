angular.module('app').factory('message', function (localStorageCommunicator) {
    localStorageCommunicator.on('message',function (e) {
        window.top.postMessage('pixter_' + e.data, '*');
    });

    return function message(msg) {
        localStorageCommunicator.broadcast('message',msg);
    };
});