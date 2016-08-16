angular.module('app').run(function ($rootScope, message, localStorageService, $location) {
    //
    message('init');
    var host = $location.search().host;
    setImageUrl(localStorageService.get(host + '.imageUrl'));
    window.addEventListener('message', function (e) {
        if (e.data.type == "pixter") {

            getDataUri(e.data.img, function (dataUrl) {
                $rootScope.$apply(setImageUrl.bind(null, dataUrl));
                message('image_received');
            });
        }
    }, false);

    function getDataUri(url, callback) {
        var image = new Image();
        //image.crossOrigin = "anonymous";
        image.onload = function () {

            var canvas = document.createElement('canvas');
            canvasContext = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            image.crossOrigin = 'Anonymous';

            // draw image into canvas element
            canvasContext.drawImage(image, 0, 0, image.width, image.height);
            // get canvas contents as a data URL (returns png format by default)
            var dataURL = canvas.toDataURL();
            callback(dataURL);
        };

        image.src = url;
    }

    // Usage
    function dataURItoBlob(uri) {
        //console.log(uri);
        // convert base64/URLEncoded data component to raw binary data held in a string
        var DOMURL = window.URL || window.webkitURL || window;
        var byteString,
            mimeString,
            ia;

        if (uri.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(uri.split(',')[1]);
        }
        else {
            byteString = unescape(uri.split(',')[1]);
        }
        // separate out the mime component
        mimeString = uri.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to a typed array
        ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ia], {
            type: mimeString
        });
        return DOMURL.createObjectURL(blob)

    }

    function setImageUrl(url) {
        if (url) {
            localStorageService.set(host + '.imageUrl', url);
            var blobUrl = dataURItoBlob(url);
            $rootScope.originalImageUrl = $rootScope.imageUrl = blobUrl;
        }
    }
});