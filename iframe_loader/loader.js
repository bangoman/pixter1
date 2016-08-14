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

    window.mobileAndTabletcheck = function() {
      var check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    }    
    function getDataUri(url, callback) {
        var image = new Image();

        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

            canvas.getContext('2d').drawImage(this, 0, 0);

            // Get raw image data
           // callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

            // ... or get as Data URI
            callback(canvas.toDataURL('image/png'));
        };

        image.src = url;
    }

// Usage
          function dataURItoBlob(uri) {
                // convert base64/URLEncoded data component to raw binary data held in a string
                var DOMURL = window.URL || window.webkitURL || window;
                // console.log(uri);
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

    function loadIframe(imgUrl,apiKey,storeId,backgrounds) {
        var baseUrl = "http://pixter-v1-responsive.s3-website-us-east-1.amazonaws.com";
        baseUrl = "http://localhost/pixter1"        
        getDataUri("http://localhost/pixter1/"  + imgUrl, function(dataUri) {
                imgUrl = dataURItoBlob(dataUri)
                if (!iframe) {
                    backgroundsString = encodeURIComponent(JSON.stringify(backgrounds.background))
                    var url = baseUrl + '/index.html?imageUrl=' + 'image.jpg' + '&apiKey=' + apiKey +'&storeId=' + storeId + '&bgs=' + backgroundsString ;  //   add this:  #/app/sliderShop  to see the slideShop
                    if(mobileAndTabletcheck()){
                        window.open(url,'_blank');
                    }else{
                        overlay = document.createElement('div');
                        overlay.style.width = "100vw";
                        overlay.style.height = "100vh";


                        overlay.style.position = "fixed";
                        overlay.style.background = "rgba(0,0,0,0.4)";
                        document.body.appendChild(overlay);
                        var screenW = document.body.clientWidth;
                        var screenH = document.body.clientHeight
                        var iframeW = 790//(screenW / 100) * 64;
                        var iframeH = 580;
                        if (iframeW > 790) {
                            iframeW = 790;
                        }
                        if (screenW < 790) {
                            iframeW = screenW;

                        }


                        var offsetLeft = (screenW - iframeW) / 2;
                        iframe = document.createElement('iframe');
                        
                        iframe.src = url;
                        iframe.style.position = 'fixed';
                        iframe.style.left = offsetLeft + "px";

                        iframe.style.top = (screenH - iframeH) /2;
                        iframe.style.width = iframeW + "px";

                        iframe.style.height = iframeH + 'px';
                        iframe.style.maxWidth = "920px";
                        iframe.style.border = "none";
                        document.body.appendChild(iframe);


                    }

                    
                }            
            // Do whatever you'd like with the Data URI!
        });

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