/**
 * Created by ori on 18/08/16.
 */
(function () {
    window.localStorageCommunicator = {
        broadcast: broadcast,
        on: on,
    };

    window.addEventListener('storage', function (storageEvent) {
        if (storageEvent.key === 'localStorageCommunicator') {
            var e = JSON.parse(localStorage.getItem('localStorageCommunicator'));
            dispatchEventToWindow(e);
        }
    });

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
        window.addEventListener('localStorageCommunicator.' + eventName, function (windowEvent) {
            cb(windowEvent.detail);
        });
    }

    function dispatchEventToWindow(e) {
        var event = new CustomEvent('localStorageCommunicator.' + e.name, {detail: e});
        window.dispatchEvent(event);
    }
})();