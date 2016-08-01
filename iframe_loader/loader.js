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

    function loadIframe(imgUrl,apiKey,storeId,backgrounds) {
        if (!iframe) {
            backgroundsString = encodeURIComponent(JSON.stringify(backgrounds.background))
            overlay = document.createElement('div');
            overlay.style.width = "100vw";
            overlay.style.height = "100vh";


            overlay.style.position = "fixed";
            overlay.style.background = "rgba(0,0,0,0.4)";
            document.body.appendChild(overlay);
            var screenW = document.body.clientWidth;
            var screenH = document.body.clientHeight
            var iframeW = (screenW / 100) * 64;
            var iframeH = 628;
            if (iframeW > 800) {
                iframeW = 800;
            }
            if (screenW < 800) {
                iframeW = screenW;

            }

            console.log(iframeW, screenW);
            var offsetLeft = (screenW - iframeW) / 2;
            iframe = document.createElement('iframe');

            iframe.src = 'http://localhost/pixter1/index.html?imageUrl=' + imgUrl + '&apiKey=' + apiKey +'&storeId=' + storeId + '&bgs=' + backgroundsString ;  //  add this:  #/app/sliderShop  to see the slideShop
            iframe.style.position = 'fixed';
            iframe.style.left = offsetLeft + "px";

            iframe.style.top = (screenH - iframeH) /2;
            iframe.style.width = iframeW + "px";

            iframe.style.height = iframeH + 'px';
            iframe.style.maxWidth = "800px";
            iframe.style.border = "none";
            iframe.style.borderTopLeftRadius ="15px"
            iframe.style.borderTopRightRadius ="15px"
            iframe.setAttribute('allowtransparency', 'true');
        }
        document.body.appendChild(iframe);
     //   changeImage(url);
    }

    function changeImage(url) {
        imgUrl = url;
        postImage();
    }

    function postImage() {
        iframe.contentWindow.postMessage(imgUrl, '*');
    }
})();