(function () {
    var imgUrl, iframe, overlay;
    window.pixter = {
        loadIframe: loadIframe,
        changeImage: changeImage,
    };

    window.addEventListener('message', function (e) {
        if (e.data === 'pixter_init') {
            postImage();
        }
    }, false);

    window.addEventListener('message', function (e) {
        if (e.data === 'pixter_close') {
            document.body.removeChild(iframe);
            iframe = null;
        }
    }, false);

    function loadIframe(url) {
        if (!iframe) {
            overlay = document.createElement('div');
            overlay.style.width = "100vw";
            overlay.style.height = "100vh";


            overlay.style.position = "fixed";
            overlay.style.background = "rgba(0,0,0,0.4)";
            document.body.appendChild(overlay);
            var screenW = document.body.clientWidth;
            var iframeW = (screenW / 100) * 64;
            if (iframeW > 800) {
                iframeW = 800;
            }
            if (screenW < 800) {
                iframeW = screenW;

            }

            console.log(iframeW, screenW);
            var offsetLeft = (screenW - iframeW) / 2;
            iframe = document.createElement('iframe');
            iframe.src = '../#/app/shop';  //  add this:  #/app/sliderShop  to see the slideShop
            iframe.style.position = 'fixed';
            iframe.style.left = offsetLeft + "px";
            iframe.style.top = '10vh';
            iframe.style.width = iframeW + "px";

            iframe.style.height = '80vh';
            iframe.style.maxWidth = "800px";
        }
        document.body.appendChild(iframe);
        changeImage(url);
    }

    function changeImage(url) {
        imgUrl = url;
        postImage();
    }

    function postImage() {
        iframe.contentWindow.postMessage(imgUrl, '*');
    }
})();