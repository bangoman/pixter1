pLoader.s_version = "1.4.0.0";
pLoader.eventListener = {};
pLoader.pLogic = {};
pLoader.pLogic.immediateStats = {};
pLoader.pLogic.shop = {};
pLoader.pLogic.shop.stepNum = 0;
pLoader.pLogic.currency = !!pLoader.data.pricing && !!pLoader.data.pricing.currency ? pLoader.data.pricing.currency.sign : '$';
pLoader.pLogic.currencyName = !!pLoader.data.pricing && !!pLoader.data.pricing.currency ? pLoader.data.pricing.currency.name : 'USD';
pLoader.pLogic.shop.imageDataURL = {};
pLoader.pLogic.bottomVal = 40;
pLoader.pLogic.dpiFlag = false;
// Imgur lightbox images, Imgur private, Imgur, dropbox, DPBox new, SDK, FB, flickr
pLoader.pLogic.acceptedSelectors = ['.main-image #image img', '#image-container img', 'div#image div.album-image div.image img', '.content-item img.thumbnail', '.preview-image-wrapper .preview-image', '.p_sdk_enabled', '.spotlight', '.view .main-photo'];
pLoader.pLogic.corsDisabledSites = ["https://www.flickr.com", "https://www.dropbox.com"];
pLoader.pLogic.orderDetails = {};
pLoader.pLogic.showExitSurvey = true;
/**********OLD SERVER************/

/*
 pLoader.pLogic.baseServerURL = document.location.protocol+'//api-sg.pixtly.com/';
 pLoader.pLogic.uploadServerURL = document.location.protocol+'//media-sg.pixtly.com/';
 pLoader.pLogic.proxyServerURL = document.location.protocol + '//media-proxy.pixtly.com/';
 */

/*
 pLoader.pLogic.baseServerURL = 'https://api.pixtly.com/';
 pLoader.pLogic.uploadServerURL = 'https://media.pixtly.com/';
 pLoader.pLogic.proxyServerURL = 'https://media-proxy.pixtly.com/';
 */

/************NEW SERVER******************/

pLoader.pLogic.baseServerURL = 'https://api-sg.pixter-media.com/';
pLoader.pLogic.uploadServerURL = 'https://upload-sg.pixter-media.com/';
pLoader.pLogic.proxyServerURL = 'https://crx-proxy.pixter-media.com/';


pLoader.pLogic.expD = new Date('2017-01-01').getTime();

pLoader.pLogic.getOS = function () {
    var OSName = "Unknown OS";
    if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
    if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
    if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

    return OSName;
};

pLoader.pLogic.convertStepsToNames = function (stepNum) {
    switch (stepNum) {
        case 1:
        {
            return "Catalog";
            break;
        }
        case 1.5:
        {
            return "Catalog - sub products";
            break;
        }
        case 2:
        {
            if (typeof pLoader.pLogic.previewType == "undefined") {
                return "Preview";
            } else {
                return pLoader.pLogic.previewType;
            }
            break;
        }
        case 3:
        {
            return "Crop";
            break;
        }
        case 3.5:
        {
            return "Real Size Preview";
            break;
        }
        case 4:
        {
            return "Shipping Details";
            break;
        }
        case 5:
        {
            return "Order Confirmation";
            break;
        }
        case 6:
        {
            return "Thank you page";
            break;
        }
        default:
        {
            return "Meta";
            break;
        }
    }
};

pLoader.pLogic.convertGEOToZone = function (geo) {
    var geo = geo.toUpperCase();
    switch (geo) {
        case "US":
        {
            return "US";

        }
        case "CA":
        {
            return "CA";

        }
        case "IL":
        {
            return "IL";

        }
        case "DK":
        case "FI":
        case "IS":
        case "IE":
        case "IM":
        case "NO":
        case "SJ":
        case "SE":
        case "GB":
        case "GI":
        case "GR":
        case "VA":
        case "IT":
        case "MT":
        case "PT":
        case "SM":
        case "ES":
        case "AT":
        case "BE":
        case "FR":
        case "DE":
        case "LI":
        case "LU":
        case "MC":
        case "NL":
        case "CH":
        {
            return "EU";
            break;
        }
        default:
        {
            return "ROW";
            break;
        }
    }
};

pLoader.isDataURL = function (s) {
    var regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
    return !!s.match(regex);
};


if (!String.prototype.pFormat) {
    String.prototype.pFormat = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

pLoader.pLogic.switchProduct = function (pid) {
    // Find the new product object
    pLoader.pLogic.shop.selectedItem = pixQuery.grep(pLoader.pLogic.productsJson, function (e) {
        return e.pid == pid
    })[0];
    // remove share assets
    delete pLoader.pLogic.shareImageURL;
    pixQuery('#p_shareButton').removeClass('readyToShare');
    pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
};


pLoader.pLogic.findProduct = function (pid) {
    return pixQuery.grep(pLoader.data.products, function (e) {
        return e.pid == pid
    })[0];
};

pLoader.pLogic.findProductCategory = function (pid) {
    for (var i = 0; i < pLoader.data.categories.length; i++) {
        var categoryChildren = pLoader.data.categories[i].children;
        if (typeof pLoader.data.categories[i].hiddenChildren != "undefined") {
            categoryChildren = categoryChildren.concat(pLoader.data.categories[i].hiddenChildren);
        }
        if (pixQuery.inArray(pid, categoryChildren) != -1) {
            return pLoader.data.categories[i]
        }
    }
};

pLoader.pLogic.centerStore = function (setTop, skipAnimation, overloadedHeight) {
    var overlay = pixQuery('#p_overlay');
    var store = pixQuery('#p_Store');
    // if the store is in catalog mode
    if (typeof pLoader.data.brandingDetails.marketingData.ossEnabled == "undefined" || pLoader.data.brandingDetails.marketingData.ossEnabled == false) {

        if (pLoader.data.categories.length > 4) {
            store.css('height', '465');

        }
        if (pLoader.data.categories.length == 6) {
            //pixQuery('#p_ShopCanvas').css('width','610');
            //pixQuery('#p_ShopCanvas').css('padding-left','75px');
        }
    }
    var left = (overlay.width() - store.width()) / 2;
    var top;
    if (typeof overloadedHeight == "undefined") {
        top = (overlay.height() - store.height()) / 2;
    } else {
        top = (overlay.height() - overloadedHeight) / 2;
    }
    if (typeof skipAnimation == "undefined" || !skipAnimation) {
        store.css('position', 'fixed').stop().animate({
            "left": left + "px",
            "top": top + "px"
        }, 100)
    } else {
        store.stop().css({
            "left": left + "px",
            "top": top + "px",
            "position": "fixed"
        })
    }
    setTimeout(function () {
        pLoader.pLogic.originalTop = parseInt(pixQuery('#p_Store').css('top'));
    }, 500)
};

pLoader.pLogic.configSupportWindow = function (messaging, cb, secondLine, locationHref) {
    // Count only the first opening of the support window
    if (typeof pLoader.pLogic.supportWindow != 'object' || pLoader.pLogic.supportWindow.closed) {
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'open payment window', 'flow');
        pLoader.pLogic.supportWindow = window.open('about:blank', 'opened_window', 'menubar=no,status=no,titlebar=no,resizable=yes,scrollbars=yes,width=1000,height=730,left=20');
    } else {
        try { // If there is a location and it equal about:blank
            var testAccesabilityLocal = !!pLoader.pLogic.supportWindow.location && pLoader.pLogic.supportWindow.location.href === 'about:blank';
        }
        catch (ex) {
            pLoader.pLogic.supportWindow.location = 'about:blank';
        }
    }
    var changeSupportWindowContent = function () {
        try { // If there is a location and it equal about:blank
            ga_$pex('send', 'event', 'hWindow', messaging, 'important action');

            var testAccesability = !!pLoader.pLogic.supportWindow.location && pLoader.pLogic.supportWindow.location.href === 'about:blank';
            // Enable survey
            pLoader.pLogic.showExitSurvey = true;
            pLoader.pLogic.supportWindow.document.title = messaging.translate();
            var gifIcon = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + 'loader.gif';
            var color = "#00B22D";
            if (typeof pLoader.data.brandingDetails.ui_id != "undefined" && pLoader.data.brandingDetails.ui_id == "_pg1") {
                color = "#FF8E20";
            }
            if (typeof pLoader.data.brandingDetails.ui_id != "undefined" && pLoader.data.brandingDetails.ui_id == "_pg3") {
                color = "#45619D";
                gifIcon = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + 'blueLoader.gif'
            }
            var addedLine = "";
            if (!!secondLine) {
                addedLine = "<p style='color:" + color + ";font-size:16px;font-weight:normal;'>" + secondLine + "</p>"
            }

            pLoader.pLogic.supportWindow.document.body.innerHTML = "<div style='padding:100px;text-align: center'><h2 style='color:" + color + ";font-size:26px;font-weight:normal;'>" + messaging.translate() + "</h2>" + addedLine.translate() + "<br/><br/><img src=" + gifIcon + "></div>";


            pLoader.pLogic.supportWindow.resizeTo(1000, 730);
            pLoader.pLogic.supportWindow.focus();
            if (!!locationHref) {
                pLoader.pLogic.supportWindow.location = locationHref;
            }
            if (typeof cb == "function") {
                cb();
            }
        } catch (ex) {
            setTimeout(function () {
                changeSupportWindowContent();
            }, 30);
        }

    };
    changeSupportWindowContent();
};

pLoader.pLogic.showPageLoader = function () {
    var currentLoader = pixQuery('#pStoreLoader');
    if (currentLoader.length == 0) {
        var gifIcon = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + 'miniLoader.gif';
        var parentEl = pixQuery('#themeContainer');
        var parentLeft = parseInt(pixQuery('#themeContainer').width() / 2 - 16);
        var parentTop = parseInt(pixQuery('#themeContainer').height() / 2 - 16);
        var htmlString = '<div id="pStoreLoader"><img src="{0}" height="32" width="32" style="position:absolute;top:{1}px;left:{2}px" id="p_Loader"/></div>';
        htmlString = htmlString.pFormat(gifIcon, parentTop, parentLeft);
        parentEl.append(htmlString);
    } else {
        currentLoader.fadeIn(200);
    }
};

pLoader.pLogic.initExternalCheckout = function (productData, type) {
    function expressOrderRequest() {
        function completeOrder() {
            pLoader.pLogic.shop.stepNum = 6;
            pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
            pLoader.pLogic.disableUserMessaging();
        }

        var product = productData;
        var productPriceData = pLoader.data.pricing.products[productData.pid];
        var shippingPriceUSRegular = productPriceData.shipping.US[0].price;
        var data = {
            price: productPriceData.price,
            product_id: product.pid,
            quantity: 1,
            shipping_method: 'reg',
            shipping_price: shippingPriceUSRegular,
            payment_type: type,
            lang: pLoader.data.language,
            client_data: JSON.stringify(pLoader.pLogic.immediateStats),
            express_checkout: true,
            metadata: pLoader.appendedAjaxData
        };


        //data.price = "0.00";
        data.shipping_price = "0.00";
        data.coupon_string = "PIXPGFS100S";


        pixQuery.extend(data, {"key": pLoader.pLogic.orderDetails.imageUpload})


        var emptyUserAddress = {
            "country": "US",
            "user_name": "Temp name PP",
            "user_email": "N/A",
            "recipient_name": "N/A",
            "city": "N/A",
            "address": "N/A",git 
            "state": "",
            "zip": "N/A",
            "address2": "",
            "TOC": "on"
        };
        data = pixQuery.extend(data, emptyUserAddress, pLoader.pLogic.statistics);

        pixQuery.ajax({
            url: pLoader.pLogic.baseServerURL + 'order/validate',
            data: data,
            success: function (result) {
                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'order validated by server', 'event');
                pLoader.pLogic.sendInternalEvent('express_checkout_validated_by_server', '2', {}, false);
                if (result.success) {
                    if (result.free) {
                        completeOrder();
                    } else {
                        try {
                            pLoader.pLogic.supportWindow.location.href = result.url;
                            pLoader.pLogic.supportWindow.document.body.innerHTML = ("<div style='padding:100px;text-align: center'><h2 style='color:#00B22D;font-size:26px;font-weight:normal;'>##Redirecting you to the payment vendor...##</h2><br/><br/><p>##(Please note: Your shipping address will be obtained during checkout)##</p><br/><br/><img src=" + gifIcon + "></div>").translate();
                            pLoader.pLogic.supportWindow.document.title = 'Redirecting you to the payment vendor...'.translate();
                        } catch (ex) {
                            delete pLoader.pLogic.supportWindow;
                            pLoader.pLogic.configSupportWindow('Redirecting you to the payment provider...'.translate(), null, '(Please note: Your shipping address will be obtained during checkout)'.translate());
                            pLoader.pLogic.supportWindow.location = result.url;
                            try {
                                pLoader.pLogic.supportWindow.focus();
                            } catch (ex2) {
                            }
                        }

                        window.addEventListener("message", receiveMessage, false);
                        function receiveMessage(event) {
                            if ((event.data) == "p_order_complete") {
                                completeOrder();
                            }
                            if ((event.data) == "p_order_canceled") {
                                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'user cancellation in Paypal', 'important action');
                            }


                        }
                    }
                } else {
                    if (typeof result.error != "undefined" && typeof result.error.description != "undefined") {
                        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'order invalid ' + result.error.description, 'warning');
                        pLoader.pLogic.createPopup('order_error', {
                            errorCode: result.error.code,
                            errorText: result.error.description,
                            popupHeader: "We're sorry...".translate()
                        })
                    } else {
                        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'order invalid - unknown error', 'warning');
                        pLoader.pLogic.createPopup('order_error', {
                            errorCode: 999,
                            errorText: 'Please try again later.'.translate(),
                            popupHeader: "We're sorry...".translate()
                        })
                    }
                }
            }
        });

    }


    function fireUploadRequest(newDataURL) {
        pLoader.pLogic.configSupportWindow('Uploading your image...'.translate(), function () {
            pLoader.pLogic.sendDataURL(pLoader.pLogic.shop.imageDataURL[pLoader.pLogic.shop.selectedItem.type], function (data) {
                pLoader.pLogic.orderDetails.imageUpload = data;
                pixQuery(pLoader.pLogic).trigger('readyToSendExpressOrder');
            })
        }, '(Please note: Your shipping address will be obtained during checkout)'.translate());

        //Remove previous express order handlers
        pixQuery(pLoader.pLogic).off('readyToSendExpressOrder');

        // Bind a new one
        pixQuery(pLoader.pLogic).one('readyToSendExpressOrder', function () {
            expressOrderRequest();
        })

    }

    if (typeof pLoader.pLogic.shop.imageDataURL[pLoader.pLogic.shop.selectedItem.type] == "undefined") {
        pLoader.pLogic.generateThumbnailDataURL(productData, pLoader.pLogic.selectedImage, function (dataURL) {
            fireUploadRequest(dataURL);
        })
    } else {
        fireUploadRequest(pLoader.pLogic.shop.imageDataURL[pLoader.pLogic.shop.selectedItem.type]);
    }


};
pLoader.pLogic.hidePageLoader = function (fadeDuration) {
    pixQuery('#pStoreLoader').fadeOut(fadeDuration);
};
pLoader.pLogic.showRobustPageLoader = function () {
    var currentLoader = pixQuery('#pStoreLoader');
    if (currentLoader.length == 0) {
        var gifIcon = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + 'miniLoader.gif';
        var parentEl = pixQuery('#themeContainer');
        var parentLeft = parseInt(pixQuery('#themeContainer').width() / 2 - 16);
        var parentTop = parseInt(pixQuery('#themeContainer').height() / 2 - 16);
        var htmlString = '<div id="pStoreLoader" style="background:white;height:95%;width:100%;display:block;position: absolute;top:0;left:0;z-index:100;"><img src="{0}" height="32" width="32" style="position:absolute;top:{1}px;left:{2}px" id="p_Loader"/></div>';
        htmlString = htmlString.pFormat(gifIcon, parentTop, parentLeft);
        parentEl.append(htmlString);
    } else {
        currentLoader.fadeIn(200);
    }
};

pLoader.pLogic.sendInternalEvent = function (eventName, stepNum, metaData, unique) {
    // user_id    session_id    api_key    sub_brand    event_name    step    (meta_data)

    if (typeof pLoader.pLogic.uniqueEvents == "undefined") {
        pLoader.pLogic.uniqueEvents = {}
    }

    if (typeof pLoader.pLogic.uniqueEvents[eventName] == "undefined" || unique == false) {
        var endPoint = pLoader.data.brandingDetails.reportingEndpoint;
        if (pLoader.appendedAjaxData.brand == null) {
            pLoader.appendedAjaxData.brand = "none";
        }
        if (typeof pLoader.appendedAjaxData.s_version == "undefined") {
            pLoader.appendedAjaxData.s_version = pLoader.s_version;
        }
        pixQuery.get(endPoint, {
            "user_id": pLoader.pLogic.statistics.user_id,
            "session_id": pLoader.pLogic.statistics.session_id,
            "api_key": pLoader.appendedAjaxData.api_key,
            "sub_brand": pLoader.appendedAjaxData.brand,
            "script_version": pLoader.appendedAjaxData.s_version,
            "loader_version": pLoader.appendedAjaxData.l_version,
            "event_name": eventName,
            "step": stepNum,
            "meta_data": metaData
        }, function (data) {
            //console.log(data);
            pLoader.pLogic.uniqueEvents[eventName] = data;
        })
    }
};


pLoader.initGA = function () {
    var ui_id = "default";
    if (typeof pLoader.data.brandingDetails.ui_id != "undefined") {
        ui_id = pLoader.data.brandingDetails.ui_id;
    }
    if (typeof chrome != "undefined" && typeof chrome.extension != "undefined") {
        function fireAnalyticsInExtension() {
            var argumentsArray = [].slice.apply(arguments);
            argumentsArray.shift();
            argumentsArray[0] = "_trackEvent";
            pLoader.gaPort.postMessage({
                "type": "event",
                "gaParams": argumentsArray,
                "pageURL": window.location.pathname
            });
        }

        pLoader.gaPort = chrome.runtime.connect({name: "pexAnalytics"});
        pLoader.gaPort.postMessage({
            "type": "init",
            "GA_ID": pLoader.data.brandingDetails.GA_ID,
            "api_key": pLoader.appendedAjaxData.api_key,
            "domain": window.location.origin,
            "pageURL": window.location.pathname,
            "ui_id": ui_id
        });
        ga_$pex = fireAnalyticsInExtension;
    } else {
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga_$pex');

        // Since we're running from the loader, create a new cookie domain to not mess up our host's GA object
        ga_$pex('create', pLoader.data.brandingDetails.GA_ID, {
            'cookieName': 'p_ga',
            'cookieDomain': document.location.host,
            'cookieExpires': 60 * 60 * 24 * 28
        }, {'name': 'p_gaTracker'});
        ga_$pex('set', {
            'appName': pLoader.data.brandingDetails.brandName,
            'appId': '1',
            'appVersion': pLoader.metadata.version,
            'appInstallerId': pLoader.data.brandingDetails.brandName,
        });
        ga_$pex('set', 'dimension1', ui_id);
        ga_$pex('set', 'dimension2', pLoader.appendedAjaxData.api_key);
        ga_$pex('set', 'dimension3', document.location.origin);
        ga_$pex('send', 'pageview');
    }
    //ga_$pex('require', 'ec');
};

pLoader.fireAnalyticsOnVisible = function (params) {
    if (pixQuery('#p_Store').is(':visible')) {
        ga_$pex('send', 'event', params[0], params[1], params[2]);
    }
};


function setStyle(obj, propertyObject) {
    for (var property in propertyObject)
        obj.style[property] = propertyObject[property];
}

if (!Object.keys) {
    Object.keys = function (obj) {
        var keys = [],
            k;
        for (k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}

pLoader.pLogic.enableUserMessaging = function (text, delay) {
    pixQuery('#p_Store').addClass('activeMessaging');
    pixQuery('#userMessaging').html(text.translate()).fadeIn(delay);
    //ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'user message - '+text,'event');
};
pLoader.pLogic.disableUserMessaging = function () {
    pixQuery('#userMessaging').fadeOut(300, function () {
        pixQuery('#p_Store').removeClass('activeMessaging');
        pixQuery('#userMessaging').html('');
    })
};

pLoader.pLogic.calculateDPI = function (productData, cb, imgSrc) {
    var tempImg = new Image();
    tempImg.onload = function () {
        var imgHeight = tempImg.height;
        var imgWidth = tempImg.width;

        if (imgHeight < productData.productH * productData.minimumDPI || imgWidth < productData.productW * productData.minimumDPI) {
            tempImg = null;
            cb(false);
        } else {
            tempImg = null;
            cb(true);
        }
    };
    if (typeof imgSrc == "undefined") {
        tempImg.src = pLoader.pLogic.shop.imageDataURL[pLoader.pLogic.shop.selectedItem.type];
    } else {
        tempImg.src = imgSrc
    }
};


pLoader.pLogic.createShareButton = function () {
    var serverName = "https://services.pixter-media.com/";

    if (typeof  pLoader.data.brandingDetails.share != "undefined" && typeof pLoader.data.brandingDetails.share.enabled != "undefined" && pLoader.data.brandingDetails.share.enabled == true) {
        pixQuery('#p_ShopCanvas > div').addClass('shareEnabled');
        // identify state - is discount enabled or not?
        if (typeof pLoader.pLogic.immediateStats.sharePostId == "undefined" && typeof pixQuery.cookie('p_sdic') == "undefined" && typeof pLoader.data.brandingDetails.share.discount != "undefined") {
            pixQuery('#p_ShopCanvas > div').addClass('shareDiscount')
        } else {
            pixQuery('#p_ShopCanvas > div').removeClass('shareDiscount')
        }

        var shareButtonText, itemID = pLoader.pLogic.shop.selectedItem.pid;
        if (typeof pLoader.data.brandingDetails.share.buttonTextOnRegular == "undefined") {
            shareButtonText = "Share your photo product!".translate();
        } else {
            shareButtonText = pLoader.data.brandingDetails.share.buttonTextOnRegular
        }
        if (pixQuery('#p_ShopCanvas > div').hasClass('shareDiscount')) {
            if (typeof pLoader.data.brandingDetails.share.buttonTextOnDiscount == "undefined") {
                shareButtonText = "Share & Get 80% Discount!".translate();
            } else {
                shareButtonText = pLoader.data.brandingDetails.share.buttonTextOnDiscount
            }
        }


        var shareButton = pixQuery('<a href="javascript:void(0);" class="" id="p_shareButton">' + shareButtonText.translate() + '</a>').appendTo(pLoader.pLogic.shop.canvas);

        function shareButtonAction(e) {

            e.preventDefault();

            //console.log(e);

            //Look at this beautiful iPhone6 Case I just ordered from my Facebook photos with Pixter.me!
            var title = "Look at this beautiful {0} I just ordered {1}with Pixter.me!".translate();
            var productName = pLoader.pLogic.shop.selectedItem.marketingName;
            var productID = pLoader.pLogic.shop.selectedItem.pid;
            if (typeof pLoader.pLogic.shop.selectedItem.shareFriendlyName != "undefined") {
                productName = pLoader.pLogic.shop.selectedItem.shareFriendlyName;
            }
            var siteName = "";

            if (typeof pLoader.pLogic.shareSiteName != "undefined" && pLoader.pLogic.shareSiteName != null) {
                siteName = "from " + pLoader.pLogic.shareSiteName + " ";
            } else {
                if (typeof pageFriendlyName != "undefined") {
                    siteName = "from " + window.pageFriendlyName + " ";
                }
            }

            title = title.pFormat(productName, siteName);

            var link = document.location.origin;
            if (typeof pLoader.pLogic.shareURL != "undefined" && pLoader.pLogic.shareURL != null) {
                link = pLoader.pLogic.shareURL;
            } else {
                // If this is FB, use a redirect URL provided by the framed app to prevent FB scraping and hopping
                if (document.location.origin == "https://fb.pixter-media.com") {
                    link = serverName + "redirect/?url=" + window.pageTabUrl;
                    link += "&caption=" + window.pageFriendlyName;
                }
            }


            var popupURL = "https://www.facebook.com/dialog/feed?app_id=1662093260675428&display=popup&link={1}&redirect_uri={3}&picture={2}&name={0}";
            popupURL = popupURL.pFormat(title, link, pLoader.pLogic.shareImageURL, encodeURIComponent("http://pixter.me/share/?productID=" + productID));

            window.open(popupURL, "share" + pLoader.pLogic.shareImageURL, 'titlebar=no,width=610, height=350');
            if (pixQuery('#p_ShopCanvas > div').hasClass('shareDiscount')) {
                window.addEventListener("message", function (event) {
                    if (event.data.type == "p_share") {
                        if (typeof pLoader.pLogic.immediateStats.sharePostId == "undefined" && typeof pixQuery.cookie('p_sdic') == "undefined") {
                            ga_$pex('send', 'event', 'share', 'user completed sharing with discount', 'important action');
                            pLoader.pLogic.immediateStats.shareCouponCode = event.data.coupon_code;
                            pLoader.pLogic.immediateStats.sharePostId = event.data.post_id;
                            pLoader.pLogic.replaceSpecialOfferData(event.data.coupon_json);
                            //desc: "Apply this coupon code on checkout for 80% discount:<br/><br/><span id='successCoupon'>" + pLoader.pLogic.immediateStats.shareCouponCode + "</span>",
                            pLoader.pLogic.createPopup('share_successful', {
                                desc: "##The coupon has been applied automatically.##<br/><br/>".translate(),
                                popupHeader: "Thank you for sharing!".translate(),
                                cb: function () {
                                    pixQuery('.previewNextButton ').click()
                                }
                            })
                        } else {
                            ga_$pex('send', 'event', 'share', 'user completed sharing without discount', 'important action');
                        }
                        pixQuery('#p_ShopCanvas > div').removeClass('shareDiscount');
                        shareButton.html('Share your photo product!'.translate());
                    }
                }, false);
            }
        }


        //Prepare the image on the server if needed

        if (typeof pLoader.pLogic.shareImageURL == "undefined") {
            var randomUploadID = Math.ceil(Math.random(12) * 10000000000000000);
            pixQuery.ajax({
                url: serverName + "mergeImage",
                type: "POST",
                data: JSON.stringify({
                    api_key: pLoader.appendedAjaxData.api_key,
                    sub_id: pLoader.appendedAjaxData.brand,
                    lang: pLoader.data.language,
                    productID: itemID,
                    imageID: randomUploadID,
                    dataURL: pLoader.pLogic.shop.imageDataURL[pLoader.pLogic.shop.selectedItem.type]
                }),
                contentType: "application/json",
                dataType: "json"
            }).done(
                function (res) {
                    ga_$pex('send', 'event', 'share', 'server succesful response', 'important action');
                    pLoader.pLogic.shareSiteName = res.siteName;
                    pLoader.pLogic.shareURL = res.shareURL;
                    pLoader.pLogic.shareImageURL = serverName + res.imageName;
                    pixQuery(pLoader.pLogic).trigger('shareImageReady');
                }
            ).error(function () {
                ga_$pex('send', 'event', 'share', 'server error', 'warning');
            });
            pixQuery(pLoader.pLogic).one('shareImageReady', function () {
                shareButton.addClass('readyToShare');
                shareButton.on('click', shareButtonAction)
            });
            //setTimeout(function(){shareButton.addClass('readyToShare')},2000);

        } else {
            shareButton.addClass('readyToShare');
            shareButton.on('click', shareButtonAction)
        }
        // Cleanup if the step changed
        pixQuery(pLoader.pLogic).on('stepChanged', function () {
            shareButton.removeClass('readyToShare');
            pixQuery(pLoader.pLogic).off('shareImageReady');
        })
    }
};

pLoader.pLogic.sendDataURL = function (dataURL, cb, async) {
    //if(typeof pLoader.pLogic.currentUploadRequest == "undefined" || pLoader.pLogic.currentUploadRequest.readyState == 4 || typeof pLoader.pLogic.dataURLSent == "undefined" || pLoader.pLogic.dataURLSent == dataURL){
    if (typeof pLoader.pLogic.currentUploadRequest == "undefined") {

    } else {
        // Abort previous request first
        ga_$pex('send', 'event', 'upload', 'Upload canceled', 'important action');
        pLoader.pLogic.orderDetails.imageUpload = "";
        pLoader.pLogic.currentUploadRequest.abort();
        delete pLoader.pLogic.currentUploadRequest;
    }
    function showUploadErrorPopup(errorMsg) {
        pLoader.pLogic.createPopup('order_error', {
            errorCode: 901,
            errorText: errorMsg,
            popupHeader: "We're sorry...".translate()
        })
    }

    ga_$pex('send', 'event', 'upload', 'Upload started', 'important action');
    if (typeof async == "undefined") {
        async = true;
    }
    pLoader.pLogic.currentUploadRequest = pixQuery.ajax({
        type: "POST",
        crossDomain: true,
        timeout: 600 * 1000,
        async: async,
        url: pLoader.pLogic.uploadServerURL + "image/upload",
        data: {
            image_data: dataURL,
            lang: pLoader.data.language,
            metadata: pLoader.appendedAjaxData
        }
    }).done(function (result) {
        if (result.success) {
            ga_$pex('send', 'event', 'upload', 'Upload complete', 'flow');
            //pLoader.pLogic.dataURLSent = dataURL;
            cb(result.key);
        } else {
            showUploadErrorPopup(result.error.description);
        }
    }).error(function (err) {
        /* Disabled due to self-aborting of AJAX
         showUploadErrorPopup("We are unable to connect to the server. Please try again later.");
         console.log(err);
         */
    });


};


pLoader.pLogic.getCORSEnabledUrl = function () {

    function IEFix(imgURL) {
        if (pLoader.isDataURL(imgURL)) {
            return imgURL;
        } else {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var url = URL.createObjectURL(this.response), img = new Image();
                img.onload = function () {
                    var tCanv = document.createElement('canvas');
                    pixQuery(tCanv).attr({
                        height: img.height,
                        width: img.width
                    });
                    var ctx = tCanv.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    var dataURL = tCanv.toDataURL('image/jpeg', 0.99);

                    pLoader.pLogic.selectedImage = dataURL;
                    URL.revokeObjectURL(url);
                    return dataURL;
                };
                img.src = url;
            };
            xhr.open('GET', imgURL, true);
            xhr.responseType = 'blob';
            xhr.send();
        }
    }

    if (pixQuery.inArray(document.location.origin, pLoader.pLogic.corsDisabledSites) != -1) {
        // Not CORS enabled, go to proxy
        var corsImg;
        if (document.location.origin == "https://www.flickr.com") {
            if (pixQuery('.Large').children('a').length > 0) {
                corsImg = document.location.protocol + pixQuery('.js-content .sizes .Large').children('a').attr('href');
                var tempImg = new Image();

                tempImg.onload = function () {
                    pLoader.pLogic.selectedImageDimensions = {
                        width: tempImg.width,
                        height: tempImg.height
                    };
                    //ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum),'hiResImage');


                };
                tempImg.src = corsImg;
            } else {
                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(1), 'Using low res image', 'warning');
                corsImg = pLoader.pLogic.rawImageObj.src;
            }
            pixQuery.get(pLoader.pLogic.proxyServerURL + '?img_url=' + encodeURIComponent(corsImg), function (d, e) {
                if (typeof d.img_url != "undefined") {
                    //ga_$pex('send', 'event', 'metadata','proxyRequestCompleted');
                    if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
                        pLoader.pLogic.selectedImage = pLoader.pLogic.shop.corsURL = IEFix(d.img_url);
                        pixQuery(pLoader.pLogic).trigger('imageFetched');
                        return pLoader.pLogic.shop.corsURL;
                    } else {
                        pLoader.pLogic.selectedImage = pLoader.pLogic.shop.corsURL = decodeURIComponent(d.img_url);
                        pixQuery(pLoader.pLogic).trigger('imageFetched');
                        return pLoader.pLogic.shop.corsURL;
                    }

                } else {
                    ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'Proxy request failure', 'warning');
                    //console.log([d,e]);
                }
            })
        }

        if (document.location.origin == "https://www.dropbox.com") {
            var item = pixQuery('.share-button.button-elm.button-primary');
            item[0].click();
            pixQuery('#share-link-modal').css('visibility', 'hidden');
            function fetchURLDpB() {
                var imgURL = encodeURIComponent(pixQuery('div.copy-link-input-container input').val());
                if (imgURL == "undefined") {
                    setTimeout(fetchURLDpB, 500);
                } else {
                    imgURL = imgURL.replace(/.$/, '1');
                    pixQuery.get(pLoader.pLogic.proxyServerURL + '?img_url=' + imgURL, function (d, e) {
                        if (typeof d.img_url != "undefined") {
                            pLoader.pLogic.selectedImage = pLoader.pLogic.shop.corsURL = d.img_url;
                            pixQuery(pLoader.pLogic).trigger('imageFetched');
                            ;
                            return d.img_url;

                        }
                    })
                }
            }

            setTimeout(fetchURLDpB, 1000);
        }

        // Default not-cors

        if (document.location.origin != "https://www.dropbox.com" && document.location.origin != "https://www.flickr.com") {
            pixQuery.get(pLoader.pLogic.proxyServerURL + '?img_url=' + encodeURIComponent(pLoader.pLogic.rawImageObj.src), function (d, e) {
                if (typeof d.img_url != "undefined") {
                    //ga_$pex('send', 'event', 'metadata','proxyRequestCompleted');
                    if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
                        pLoader.pLogic.selectedImage = pLoader.pLogic.shop.corsURL = IEFix(d.img_url);
                        pixQuery(pLoader.pLogic).trigger('imageFetched');
                        ;
                        return pLoader.pLogic.shop.corsURL;
                    } else {
                        pLoader.pLogic.selectedImage = pLoader.pLogic.shop.corsURL = decodeURIComponent(d.img_url);
                        pixQuery(pLoader.pLogic).trigger('imageFetched');
                        ;
                        return pLoader.pLogic.shop.corsURL;
                    }

                } else {
                    ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'Proxy request failure', 'warning');
                    //console.log([d,e]);
                }
            })
        }

    } else {
        /*if(document.location.origin == "https://www.dropbox.com"){
         pLoader.pLogic.selectedImage = pLoader.pLogic.shop.corsURL = pixQuery(pLoader.pLogic.rawImageObj).attr('data-original-href');
         var newImg = new Image();
         newImg.onload = function(){
         pLoader.pLogic.selectedImageDimensions = {
         height:newImg.height,
         width:newImg.width
         }
         }
         newImg.src = pLoader.pLogic.selectedImage;
         return pLoader.pLogic.shop.corsURL;
         */

        if (document.location.origin == "https://www.facebook.com") {
            // Open and close the dropdown to generate the call
            pixQuery('.fbPhotoSnowliftDropdownButton')[0].click();
            pixQuery('.fbPhotoSnowliftDropdownButton')[0].click();

            setTimeout(function () {
                pixQuery('.fbPhotoSnowliftDropdownButton')[0].click();
                var allSpans = pixQuery('.uiContextualLayerPositioner:not(.hidden_elem)').find('span');
                pixQuery('.fbPhotoSnowliftDropdownButton')[0].click();
                var hiRes = false;
                allSpans.each(function (i, el) {
                        if (pixQuery(el).html() == "Download") {
                            var baseURL = pixQuery(el).parents('a').attr('href');
                            baseURL = baseURL.replace('?dl=1', '');

                            var tempImg = new Image();

                            tempImg.onload = function () {
                                pLoader.pLogic.selectedImage = baseURL;
                                pLoader.pLogic.selectedImageDimensions = {
                                    width: tempImg.width,
                                    height: tempImg.height
                                };
                                //ga_$pex('send', 'event', 'metadata','hiResImage');
                                pixQuery(pLoader.pLogic).trigger('imageFetched');
                                ;
                                if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
                                    return IEFix(baseURL);
                                } else {
                                    return baseURL;
                                }

                            };

                            tempImg.src = baseURL;
                        }
                        // Fallback in case we could not find a proper image
                        if (i == allSpans.length - 1 && !hiRes) {
                            pLoader.pLogic.selectedImage = pLoader.pLogic.rawImageObj.src;
                            ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(1), 'Using low res image', 'warning');
                            pixQuery(pLoader.pLogic).trigger('imageFetched');
                            if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
                                return IEFix(pLoader.pLogic.selectedImage);
                            } else {
                                return pLoader.pLogic.selectedImage;
                            }

                        }
                    }
                )
            }, 400)

        } else {
            // CORS enabled!
            pLoader.pLogic.selectedImage = pLoader.pLogic.rawImageObj.src;
            //ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum),'Unknown Resolution');
            pixQuery(pLoader.pLogic).trigger('imageFetched');
            if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
                return IEFix(pLoader.pLogic.selectedImage);
            } else {
                return pLoader.pLogic.selectedImage;
            }
        }
    }
};

pLoader.pLogic.initStatistics = function () {
    if (typeof ga_$pex == "undefined")
        pLoader.initGA();
    pLoader.pLogic.statistics = {};
    var uid = pixQuery.cookie('p_uid');
    if (typeof uid == "undefined") {
        var generatedUID = pLoader.generateHash();
        pixQuery.cookie('p_uid', generatedUID, {expires: 30, path: '/'});
        pLoader.pLogic.statistics.user_id = generatedUID;
    } else {
        pLoader.pLogic.statistics.user_id = uid;
    }

    var psid = pixQuery.cookie('psid');
    if (typeof psid == "undefined") {
        var randomSessionId = pLoader.generateHash();
        pixQuery.cookie('psid', randomSessionId, {path: '/'})
        pLoader.pLogic.statistics.session_id = randomSessionId;
    } else {
        pLoader.pLogic.statistics.session_id = psid;
    }
    try {
        pLoader.pLogic.sendInternalEvent('initial_load', '0', {}, true);
    } catch (ex) {
        console.log(ex);
    }
};

pLoader.pLogic.moveUserToImage = function (clickTarget, cbFunc) {
    var $el = pixQuery(pixQuery(clickTarget).parents('.pexCTA_01').find('a.pexTeaserButton')[0]);
    var bgColor = '#00B22D';
    var animDuration = 100;

    $el.animate({
        'backgroundColor': '#009619'
    }, animDuration, cbFunc);

    setTimeout(function () {
        $el.css({
            'background-color': bgColor
        })
    }, animDuration + 2000)
};


// After an image was recognized, place the CTA button on it
pLoader.pLogic.initImageOverlay = function (imgObj, dimensions, type) {
    if (document.location.origin == "https://www.dropbox.com") {
        setTimeout(function () {
            displayButton(false);
        }, 1000)
    } else {
        if (typeof pLoader.onDemandURL != "undefined") {
            displayButton(true);
        }
        displayButton(false);
    }


    // Prepare image data
    function displayButton(runImmediately) {

        if (pixQuery('.p_IntroButtonContainer').length == 0 || document.location.origin != "https://www.dropbox.com") {

            var $imgObj = pixQuery(imgObj);
            if ($imgObj.parent().hasClass('p_ShopWrapper') && pLoader.pLogic.acceptableImagesCounter >= 1) {
                $imgObj.unwrap();
            }
            $imgObj.wrap('<div class="p_ShopWrapper"></div>');

            $imgObj.parent('.p_ShopWrapper').css({
                'height': $imgObj.height(),
                'width': $imgObj.width()
            });

            var relativeCords = pLoader.pLogic.getImageOutline(imgObj);
            var initButton = document.createElement('div');

            setStyle(initButton, {
                bottom: relativeCords.bottomDiff + 0 + "px",
                left: "10px",
                display: 'none'
            });

            if (type == "largeImage" && document.location.href.indexOf("https://www.facebook.com/photo.php") > -1) {
                // Facebook theater mode
                initButton.className = "p_IntroButtonContainer slimp_ButtonContainer p_imageButton";
            } else {
                initButton.className = "p_IntroButtonContainer  p_imageButton";
            }

            initButton.innerHTML = pLoader.pLogic.buttonHTML;
            initButton.imageObj = imgObj.src;
            initButton.rawImageObj = imgObj;
            initButton.imageDimensions = dimensions;
            var $pbutton = pixQuery(initButton);

            if (typeof pLoader.data.brandingDetails.ui_id != "undefined") {
                $pbutton.addClass(pLoader.data.brandingDetails.ui_id);
            }

            $pbutton.attr('current-image-url', imgObj.src).on('click', function (ev, supressGA) {
                ev.preventDefault();
                if (typeof pLoader.pLogic.immediateStats.source == "undefined") {
                    pLoader.pLogic.immediateStats.source = "largeImage";
                }
                if (typeof supressGA != "undefined" && supressGA == true && pLoader.pLogic.immediateStats.source == "largeImage") {
                    //console.log('GA supressed');
                } else {
                    ga_$pex('send', 'event', 'button', 'click - ' + pLoader.pLogic.immediateStats.source + ' button', 'important action');
                    pLoader.pLogic.immediateStats.source = "largeImage";
                }
                pLoader.pLogic.showStorePage(ev);
            }).on('mouseenter', function () {
                pLoader.pLogic.shop.showTeaser($pbutton, $pbutton, imgObj.src, 'largeImage');
            }).on('mouseleave', function () {
                pLoader.pLogic.shop.hideTeaser();
            }).fadeIn();


            $imgObj.parents('.p_ShopWrapper')[0].appendChild(initButton);

            if (document.location.origin == "https://www.flickr.com" && pixQuery('.low-res-photo').attr('hidden') != "hidden") {
                pixQuery('.p_ShopWrapper').find('img.main-photo').css({
                    'position': 'relative',
                    'top': 'auto',
                    'left': 'auto'
                });
                pixQuery(initButton).css({
                    'bottom': 0
                });
                pixQuery('.low-res-photo').attr('hidden', 'hidden');
                setTimeout(function () {
                    if (pixQuery('.p_IntroButton').length > 1) {
                        pixQuery('.p_IntroButton')[1].remove();
                    }
                }, 100)
            }

            if (runImmediately) {
                try {
                    $pbutton.trigger('click', [true]);
                } catch (ex) {
                    if (typeof pLoader.pLogic.immediateStats.source == "undefined") {
                        pLoader.pLogic.immediateStats.source = "largeImage";
                    }
                    pLoader.pLogic.showStorePage({
                        target: initButton
                    });
                }
            } else {
                if (typeof pixQuery.cookie('pexImmediatePage') != "undefined") {
                    pLoader.pLogic.immediateStats.source = pixQuery.cookie('pexImmediatePage');
                    $pbutton.trigger('click', [true]);

                    //pLoader.pLogic.firstTimeLogic(false);
                    pixQuery.removeCookie('pexImmediatePage', {path: '/'});
                } else {
                    pLoader.pLogic.firstTimeLogic(true);
                    ga_$pex('send', 'event', 'button', 'large image button shown', 'flow');
                    if ($pbutton.is(':visible')) {
                        ga_$pex('send', 'event', 'button', 'large image button shown', 'visible flow');
                    }

                }
                if (document.location.origin.indexOf("imgur.com") != "-1") {
                    pixQuery(initButton).css('display', 'none');
                    pixQuery(initButton).parent().on('mouseenter', function () {
                        pixQuery(initButton).fadeIn();
                    }).on('mouseleave', function () {
                        pixQuery(initButton).fadeOut();
                    })
                }
            }
        }
    }

};
/**
 * initiating the Oss
 */
pLoader.pLogic.initOSS = function () {
    // Set the flag to make sure our preview page is in OSS configuration
    var ossItems = pLoader.data.brandingDetails.marketingData.ossData;
    // Randomize a product to start with
    var currentIndex = Math.floor((Math.random() * ossItems.length));
    var ossCurrentProduct = pLoader.pLogic.findProduct(ossItems[currentIndex].PID);
    pLoader.pLogic.ossEnabled = ossItems[currentIndex];
    pLoader.pLogic.shop.selectedItem = ossCurrentProduct;
    pLoader.pLogic.shop.stepNum = 2;
    pLoader.pLogic.shop.isInOss = true;
    pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null, true, {type: "ossPreview"});
};

// On click, pull the HTML from the extension and append it to the body
pLoader.pLogic.showStorePage = function (event) {
    try {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    } catch (ex) {
    }


    function renderShop() {
        function cb(data) {
            pixQuery('.p_IntroButtonContainer').fadeOut(600);
            var nodeContent = data;
            var openStores = pixQuery('body').children('#p_Store');
            if (openStores.length > 0) {
                try {
                    openStores[0].remove();
                } catch (ex) {

                }
            }
            function bindStoreEvents() {

                if (typeof pLoader.appProxy != "undefined") {
                    pixQuery('#storeBroughtBy').css({'display': 'block'}).html('Brought by'.translate() + ' ' + pLoader.appProxy).on('click', function (e) {
                        e.preventDefault();
                    });
                }

                pixQuery('#p_Store').fadeIn(800);
                pixQuery('#p_Store').on('click', function (e) {
                    e.stopPropagation();
                });


                /**
                 * Adding the custom css only if its the first init;
                 */
                (function toggleCustomCss(){
                    /**
                     * Customize the store
                     */
                    var customCssText = '';
                    var head = document.head || document.getElementsByTagName('head')[0];

                    var customCssOverload =  pLoader.data.brandingDetails.customCss;

                    if(customCssOverload){
                        pLoader.pLogic.customCssStyle = document.createElement('style')
                        /**
                         * loop the css rules and properties from the branding json
                         */
                        pixQuery.each(customCssOverload,function(className,classRules){
                            pixQuery.each(classRules,function(cssRule,ruleValue){

                                /**
                                 * If the type is an object than the css is for an element in the given class
                                 */
                                if(typeof ruleValue === 'object') {
                                    var innerElementRules = ruleValue;
                                    var elementName = cssRule;
                                    pixQuery.each(innerElementRules,function(innerElementCssRule,innerElementCssValue){
                                        customCssText += !!innerElementCssValue ? '.pub-brand-'+ className +' '+elementName + ' { '+ innerElementCssRule + ': '+ innerElementCssValue + ' !important; } ' : '';
                                    });
                                }else{
                                    // add custom css according to the branding json (only if exists)
                                    customCssText += !!ruleValue ? '.pub-brand-'+ className + ' { '+ cssRule + ': '+ ruleValue + ' !important; } ' : '';

                                }

                            });
                        });

                        /**
                         * Add the style to the head of the page
                         */
                        pLoader.pLogic.customCssStyle.type = 'text/css';
                        if (pLoader.pLogic.customCssStyle.styleSheet){
                            pLoader.pLogic.customCssStyle.styleSheet.cssText = customCssText;
                        } else {
                            pLoader.pLogic.customCssStyle.appendChild(document.createTextNode(customCssText));
                        }

                        head.appendChild(pLoader.pLogic.customCssStyle);

                    }
                })();


                var logoElem = pixQuery('.logo-container');

                if (logoElem.length > 0 && typeof logoElem.find('img').attr('data-image-url') != "undefined") {
                    var $img = logoElem.find('img');
                    var imgUrl = $img.attr('data-image-url');
                    $img.attr('src', pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + imgUrl);
                    /**
                     * Toggle the customer logo instead of the default one
                     */
                    if(!!pLoader.data.brandingDetails.customerLogo) {
                        (function togglePublisherLogo(){
                            var customersLogosAssetsUrl = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL+'customers/';
                            // logoElem.parent('.logo-container').fadeIn();
                            var publisherlogoSrc =pLoader.data.brandingDetails.customerLogo;
                            $img.attr('src',customersLogosAssetsUrl+ publisherlogoSrc);
                        })()
                    }

                }



                // Add tagline
                pixQuery('#brand_tagline').html(pLoader.data.brandingDetails.brandTagLine);

                // Bind events to the store
                pixQuery('li#p_StoreLearnMore a').on('click', function (e) {
                    e.preventDefault();
                    ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'about us click', 'event');
                    try {
                        pLoader.pLogic.closePopup(cb)
                    } catch (e) {
                        cb();
                        console.log('catching', e);
                    }
                    function cb() {
                        pLoader.pLogic.popup = true;
                        pLoader.pLogic.createPopup('what_is_pixter');
                        // /window.open(pLoader.data.brandingDetails.brandSite+'?origin=c', 'p_WhoWeAre', 'titlebar=no,width=610, height=350');
                    }
                });
                document.getElementById('closep_Store').addEventListener('click', function (e) {
                    e.preventDefault();
                    pLoader.pLogic.shop.closeShop(e, null, 'click on close button');
                });

                // Remove disable handlers on UI's that do not have it
                var disableButton = pixQuery('#disablep_Store');
                if (disableButton.length > 0) {
                    disableButton.css('display', 'none').on('click', function (e) {
                        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'disableStore', 'event');
                        pLoader.pLogic.shop.disableShop(e);
                    });
                }

                document.getElementById('backp_Store').addEventListener('click', function (event) {
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    event.stopPropagation();
                    if (!!pLoader.pLogic.isBlockedBackupClick) {
                        return;
                    }
                    pLoader.pLogic.isBlockedBackupClick = true;
                    setTimeout(function () {
                        pLoader.pLogic.isBlockedBackupClick = false;
                    }, 500);
                    pLoader.pLogic.closePopup();

                    // Reset upload from disk images
                    if (pLoader.pLogic.shop.stepNum == 2) {
                        pLoader.pLogic.selectedImage = pLoader.pLogic.getCORSEnabledUrl();
                        delete pLoader.pLogic.shop.imageDataURL[pLoader.pLogic.shop.selectedItem.type];
                    }
                    var stepBackTo = pLoader.pLogic.shop.stepNum - 1;
                    var params = {};

                    if (stepBackTo == 3) stepBackTo--;
                    try {
                        pLoader.pLogic.supportWindow.close();
                    } catch (ex) {
                    }

                    if (pLoader.pLogic.shop.stepNum == 6) {
                        // TODO: Change this to reset order
                        if (typeof pLoader.pLogic.ossEnabled == "undefined") {
                            pLoader.pLogic.orderDetails.imageUpload = "";
                            pLoader.pLogic.shop.stepNum = 1;
                            ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'back', 'toStep_' + pLoader.pLogic.shop.stepNum, 'event');
                            pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, event);
                        } else {
                            params.type = "ossPreview";
                            params.item = pLoader.pLogic.findProduct(pLoader.pLogic.ossEnabled.PID);
                            pLoader.pLogic.shop.stepNum = 2;
                            ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'back', 'toStep_' + pLoader.pLogic.shop.stepNum, 'event');
                            pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, event, false, params);
                        }
                    } else {
                        if (stepBackTo == 0.5) {
                            stepBackTo = 1;
                            //pLoader.pLogic.shop.selectedItem = null;
                        }
                        if (stepBackTo == 2.5) {
                            stepBackTo = 2;
                        }
                        if (pLoader.pLogic.shop.stepNum == 2) {
                            stepBackTo = pLoader.pLogic.origin;
                        }
                        // If oss is enabled AND we're going back to step 1 from step 1.5 OR we're going back to step 2 and the item has express checkout
                        function returnToOSS() {
                            var result = false;
                            if (typeof pLoader.pLogic.ossEnabled != "undefined") {
                                // If we were in product selection catalog and going back to step 1
                                if (pLoader.pLogic.shop.stepNum == 1.5 && stepBackTo == 1) {
                                    result = true;
                                    pLoader.pLogic.shop.selectedItem = null;

                                }
                                // If we were in the normal preview and are going back to step 1
                                if (pLoader.pLogic.shop.stepNum == 2 && stepBackTo == 1) {
                                    result = true;
                                }
                                // If we're going back to step 2 and our checkoutstyle is express, i.e., back from shipping address
                                if (stepBackTo == 2 && (pLoader.pLogic.ossEnabled.checkoutStyle == "express" || pLoader.pLogic.ossEnabled.checkoutStyle == "skipPreview")) {
                                    result = true;
                                }
                            }
                            return result;
                        }

                        function noCatalog() {
                            if (typeof pLoader.itemSelectedBeforeStoreOpen != "undefined" && (pLoader.pLogic.shop.stepNum == 1.5 || pLoader.pLogic.shop.stepNum == 2)) {
                                return true;
                            }
                        }

                        if (returnToOSS()) {
                            params.type = "ossPreview";
                            params.item = pLoader.pLogic.findProduct(pLoader.pLogic.ossEnabled.PID);
                            stepBackTo = 2;
                        }

                        if (noCatalog()) {
                            pLoader.pLogic.shop.closeShop(null, null, 'Closing store from preview');
                        } else {
                            pLoader.pLogic.shop.stepNum = stepBackTo;
                            ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'back', 'toStep_' + pLoader.pLogic.shop.stepNum, 'event');
                            pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, event, false, params);
                        }
                    }
                });


                // If we're in OSS mode, ignore previous logic and a specific product
                if (typeof pLoader.data.brandingDetails.marketingData != "undefined" && typeof pLoader.data.brandingDetails.marketingData.ossData != "undefined" && pLoader.data.brandingDetails.marketingData.ossEnabled) {
                    pLoader.pLogic.initOSS();
                } else {
                    var direct = false;
                    pLoader.pLogic.shop.stepNum = 1;

                    // Our default is step one, but if we have a skip object...

                    if ((typeof pLoader.skipStepObject != "undefined" && typeof pLoader.skipStepObject.skipToPage != "undefined") || typeof pLoader.data.brandingDetails.skipDefault != "undefined") {
                        // Decide type
                        /*
                         skipStepObject = {
                         skipToPage:"productPage"/"userDetails"/"orderConfirmation"
                         skipType:"category"/"product",
                         product:pid -- The product to skip to
                         }
                         */
                        if (typeof pLoader.skipStepObject == "undefined") {
                            pLoader.skipStepObject = pLoader.data.brandingDetails.skipDefault;
                        }
                        if (pLoader.skipStepObject.skipToPage == 2) {
                            if (pLoader.skipStepObject.skipType == "category") {
                                // If the SDK directs us to open a category step directly, start by finding the cateogry object based on cateogry type
                                var selectedItem = pixQuery.grep(pLoader.data.categories, function (e) {
                                    return e.type == pLoader.skipStepObject.product
                                })[0];
                                if (selectedItem.children.length > 1) {
                                    // If this is a category with multiple children, open step 1.5
                                    pLoader.pLogic.shop.selectedItemParent = selectedItem;
                                    pLoader.pLogic.shop.stepNum = 1.5;
                                } else {
                                    // Else, this is a single product, find the product object
                                    selectedItem = pixQuery.grep(pLoader.data.products, function (e) {
                                        return e.pid == selectedItem.children[0];
                                    })[0];
                                    pLoader.pLogic.shop.stepNum = 2;
                                    direct = true;
                                }
                                pLoader.pLogic.shop.selectedItem = selectedItem;
                            } else {
                                pLoader.pLogic.shop.selectedItem = pixQuery.grep(pLoader.data.products, function (e) {
                                    return e.pid == pLoader.skipStepObject.product;
                                })[0];
                                pLoader.pLogic.shop.stepNum = 2;
                                direct = true;
                            }
                        }
                    }
                    pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null, direct);
                }
            }

            // Render overlay if needed
            if (typeof pLoader.overlayMode != "undefined" && pLoader.overlayMode == true) {

                pixQuery('#p_overlay').append(nodeContent);
                pLoader.pLogic.centerStore(true);
                bindStoreEvents();
                pixQuery(window).on('resize', function () {
                    pLoader.pLogic.centerStore(false);
                })
            } else {
                if (pLoader.pLogic.targetContainer == null) {
                    pixQuery('body').append(nodeContent);
                } else {
                    pixQuery(pLoader.pLogic.targetContainer).append(nodeContent).addClass('targetdStoreContainer');

                }
                bindStoreEvents();
            }
        }

        var storeHTMLFile = "store";
        if (typeof pLoader.data.brandingDetails.ui_id != "undefined") {
            storeHTMLFile = storeHTMLFile + pLoader.data.brandingDetails.ui_id;
        }
        pLoader.crossDomainAjax(pLoader.assetsServer + pLoader.data.assetsList.partialBaseURL + storeHTMLFile + '.html', function (data) {
            cb(data.translate())
        });
    }

    if (typeof event.gridFeed == "undefined" || !event.gridFeed) {
        // If this is a normal implementation, not grid/feed
        if (typeof event.target.imageObj == "undefined") {
            if (pLoader.pLogic.selectedImage != null && pLoader.pLogic.selectedImage != event.target.parentElement.imageObj) {
                pLoader.pLogic.shop.imageDataURL = {};
            }
            pLoader.pLogic.rawImageObj = event.target.parentElement.rawImageObj;
            pLoader.pLogic.selectedImage = pLoader.pLogic.getCORSEnabledUrl();
            pLoader.pLogic.selectedImageDimensions = event.target.parentElement.imageDimensions;
        } else {
            if (pLoader.pLogic.selectedImage != null && pLoader.pLogic.selectedImage != event.target.imageObj) {
                pLoader.pLogic.shop.imageDataURL = {};
            }
            pLoader.pLogic.rawImageObj = event.target.rawImageObj;
            pLoader.pLogic.selectedImage = pLoader.pLogic.getCORSEnabledUrl();
            pLoader.pLogic.selectedImageDimensions = event.target.imageDimensions;
        }
        renderShop();
    } else {
        // If grid/feed
        if (pLoader.pLogic.selectedImage != null) {
            pLoader.pLogic.shop.imageDataURL = {};
        }
        pLoader.pLogic.shop.closeShop(null, null, 'new instance opened instead of this one');
        pixQuery.cookie('pexImmediatePage', event.sourceType, {path: '/'});
        event.element.click();
    }
};

// Support function:
pLoader.pLogic.getImageOutline = function (imgObj) {
    var ourImg = imgObj;
    var ourParent = ourImg.parentElement;
    var rect = ourImg.getBoundingClientRect();
    var rect2 = ourParent.getBoundingClientRect();
    return {
        bottomDiff: rect2.bottom - rect.bottom,
        leftDiff: rect2.left - rect.left
    }
};

// Check image minimum size and width and initiate image y if true
pLoader.pLogic.processImage = function (imgObj) {
    var imgSrc = imgObj.src;
    if (imgSrc[imgSrc.length - 1] != "f") {
        var newImg = new Image();
        newImg.onload = function () {
            var realDimensions = {
                height: newImg.height,
                width: newImg.width
            };

            var largeImageDefinitions = {
                "realWidth": 0,
                "realHeight": 0,
                "displayImageWidth": 0,
                "displayImageHeight": 0
            };

            var medImageDefinitions = {
                "realWidth": 300,
                "realHeight": 300,
                "displayImageWidth": 200,
                "displayImageHeight": 200
            };

            if (realDimensions.width > largeImageDefinitions.realWidth && realDimensions.height > largeImageDefinitions.realHeight && imgObj.width > largeImageDefinitions.displayImageWidth && imgObj.height > largeImageDefinitions.displayImageHeight) {
                pLoader.pLogic.initImageOverlay(imgObj, realDimensions, 'largeImage');
            } else {
                if (realDimensions.width > medImageDefinitions.realWidth && realDimensions.height > medImageDefinitions.realHeight && imgObj.width > medImageDefinitions.displayImageWidth && imgObj.height > medImageDefinitions.displayImageHeight) {
                    pLoader.pLogic.initImageOverlay(imgObj, realDimensions, 'mediumImage');
                }
            }
        };
        newImg.src = imgSrc
    }

};


// Identify all images on page and send them to processing
pLoader.pLogic.scanImagesOnPage = function () {
    var i = 0;
    var acceptedSelectors = pLoader.pLogic.acceptedSelectors.join(',');
    var allImages = pixQuery(acceptedSelectors);
    pLoader.pLogic.acceptableImagesCounter = allImages.length;
    for (i; i < pLoader.pLogic.acceptableImagesCounter; i++) {
        if (document && document.readyState === "complete" || document.location.origin.indexOf("//imgur.com") != -1 || document.location.origin.indexOf("//dropbox.com") != -1)
            pLoader.pLogic.processImage(allImages[i]);
    }
    /*
     if (document.location.origin == "https://www.dropbox.com") {
     function scanLocalChangesToImage() {
     if (pixQuery('.p_ShopWrapper').length == 0) {
     pLoader.pLogic.shop.closeShop();
     pLoader.pLogic.shop.resetShop();
     pLoader.pLogic.scanImagesOnPage();
     } else {
     setTimeout(scanLocalChangesToImage, 1000);
     }
     }

     setTimeout(scanLocalChangesToImage, 1000);
     }
     */
};

/* Start teaser and grid/feed handling */

pLoader.pLogic.shop.hideTeaser = function () {
    pixQuery('.pexTeaser').fadeOut(function () {
        pixQuery(this).remove()
    });
};

pLoader.pLogic.shop.showTeaser = function (appendTarget, storeTarget, lowResImage, type) {

    ga_$pex('send', 'event', 'button', 'teaser on ' + type, 'important action');

    if (appendTarget.find('.pexTeaser').length >= 1 || typeof appendTarget == "undefined") {
        return false;
    }

    var activeCategories = [], currentIndex;

    for (var i = 0; i <= pLoader.data.categories.length - 1; i++) {
        if (typeof pLoader.data.categories[i].disabled != "undefined" && pLoader.data.categories == "true") {
            // Inactive category
        } else {
            activeCategories.push(pLoader.data.categories[i]);
        }
    }

    pLoader.rotateTimeout;

    function handleTeaserIndex() {
        if (typeof pixQuery(appendTarget).attr('teaser-index') != "undefined") {
            currentIndex = pixQuery(appendTarget).attr('teaser-index');
            var topIndex = activeCategories.length - 1;
            if (currentIndex++ == topIndex) {
                currentIndex = 0;
            }
        } else {
            // Find the leading category if it exists
            if (typeof pLoader.data.brandingDetails.leadingTeaser != "undefined") {
                currentIndex = activeCategories.map(function (e) {
                    return e.type
                }).indexOf('mug');
            } else {
                currentIndex = Math.floor((Math.random() * activeCategories.length));
            }
        }
        pixQuery(appendTarget).attr('teaser-index', currentIndex);
    }

    handleTeaserIndex();

    var newImage = new Image();

    function onLoadHandler(tbImage, softReplace) {
        var data = activeCategories[currentIndex];
        var cropRatio = data.cropRatio;
        var imageHeight = tbImage.height;
        var imageWidth = tbImage.width;
        var imageRatio = imageHeight / imageWidth;

        var newImageH, newImageW, newImageX, newImageY;
        var cropType = (imageRatio >= cropRatio ? "hCrop" : "vCrop");
        if (cropType == "hCrop") {
            newImageH = data.tmbWidth * imageRatio;
            newImageW = data.tmbWidth;
            newImageX = 0;
            newImageY = (data.tmbHeight - newImageH) / 2;
        } else {
            newImageH = data.tmbHeight;
            newImageW = data.tmbHeight / imageRatio;
            newImageX = (data.tmbWidth - newImageW) / 2;
            newImageY = 0;
        }
        //console.log([data.tmbWidth,newImageW]);
        pixQuery(tbImage).attr({
            height: newImageH,
            width: newImageW
        }).css({
            top: newImageY,
            left: newImageX
        });
        function addTeaserFooter(target) {
            if (typeof pLoader.data.brandingDetails.showFooterCredit != "undefined" && pLoader.data.brandingDetails.showFooterCredit) {
                target.addClass('p_by_enabled').append('<p class="pTeaser_footer">Powered by Pixtly<a class="pTeaser_footer_close" href="' + pLoader.data.brandingDetails.brandSite + '?origin=c" target="_blank">&times;</a></p>');
                pixQuery('.pexTeaser').addClass('p_by_enabled');
                target.find('.pTeaser_footer').on('click', function (e) {
                    e.stopPropagation();
                })
            }
        }

        var cb = function (thumbnailImg) {
            var productTmb = pLoader.pLogic.generateSmallThumbnail(data, thumbnailImg, 'imgObj');
            var dT;
            if (softReplace) {
                dT = "none"
            } else {
                dT = "block"
            }
            var liTemplate = '<div class="pTeaser_inner" style="display:{3}"><p>##Order photo products##</p>{0}<div class="productData"><span class="productName">{1}</span></div><div class="teaserAddedStyle {4}"></div></div>'.translate();
            var styleElementClass = "";
            if (typeof pLoader.data.brandingDetails.teaserConfig != "undefined" && typeof pLoader.data.brandingDetails.teaserConfig.styleElement != "undefined" && pixQuery.inArray(data.type, pLoader.data.brandingDetails.teaserConfig.styleElement.types) != -1) {
                styleElementClass = pLoader.data.brandingDetails.teaserConfig.styleElement.class;
            }
            liTemplate = liTemplate.pFormat(productTmb, data.shortName, pLoader.pLogic.currency + data.price, dT, styleElementClass);
            if (softReplace) {
                appendTarget.find('.pTeaser_inner').stop().fadeOut(300, function () {
                    pixQuery(this).remove();
                    var divNode = appendTarget.find('.pexTeaser');
                    pixQuery(divNode).append(liTemplate);
                    var innerDiv = pixQuery(divNode).find('.pTeaser_inner');
                    addTeaserFooter(innerDiv);
                    innerDiv.fadeIn(300);
                });

            } else {
                var divNode = document.createElement('div');
                divNode.className = "pT_" + type + " pexTeaser " + data.type;
                appendTarget.append(divNode);
                pixQuery(divNode).append(liTemplate).on('click', function (event) {
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    event.stopPropagation();
                    var animationCB = function () {
                        var data = {
                            gridFeed: true,
                            sourceType: type,
                            element: storeTarget
                        };
                        pLoader.pLogic.showStorePage(data);
                    };
                    if (type != "largeImage") {
                        pLoader.pLogic.moveUserToImage(event.target, animationCB);
                    } else {
                        animationCB();
                    }
                }).fadeIn();
                var innerDiv = pixQuery(divNode).find('.pTeaser_inner');
                addTeaserFooter(innerDiv);
            }
        };
        cb(tbImage);
        // Make sure only one timeout is running
        if (typeof pLoader.rotateTimeout != "undefined") {
            clearTimeout(pLoader.rotateTimeout);
        }
        pLoader.rotateTimeout = setTimeout(function () {
            if (appendTarget.find('.pexTeaser').length > 0) {
                handleTeaserIndex();
                onLoadHandler(tbImage, true);
            }
        }, 3000)
    }

    newImage.onload = function () {
        onLoadHandler(newImage, false)
    };
    newImage.src = lowResImage;

};

pLoader.pLogic.shop.hideGridOverlay = function (el) {
    //if(document.location.origin == "https://www.facebook.com"){
    var parentEl = pixQuery(el.parentNode);
    var gridButton = parentEl.find('.pexCTA_01');
    gridButton.stop().fadeOut(200);
    //}
};

pLoader.pLogic.shop.initGridOverlay = function (el, type) {
    var classList = "pexCTA_01 ";
    if (typeof pLoader.data.brandingDetails.ui_id != "undefined") {
        classList = classList + pLoader.data.brandingDetails.ui_id;
    }
    var gridButton = "<div class='" + classList + "' style='display:none; position: absolute;top: 5px;left: 5px;z-index:10;width:125px;height:25px'><a class='pexTeaserButton' href='#'  style='text-decoration:none !important;position:absolute;background-color: #00B22D;font-size: 14px; color: white;z-index: 5;padding: 4px 5px;border-radius: 2px;width:110px;text-align:center;left: 0;top: 0;line-height: 14px;' >##Get Prints >>##</a></div>".translate();


    if (document.location.origin == "https://www.facebook.com") {
        var parentEl = pixQuery(el.parentNode);
        if (parentEl.children('a').length > 1) {
            // Block feed albums for now
            type = "feedAlbum";
        } else {
            if (parentEl.hasClass('pexCTAEnabled')) {
                // If the button is already appended, tag it for later fade in function
                gridButton = parentEl.find('.pexCTA_01');
            } else {
                // Else, append the button

                parentEl.append(gridButton).addClass('pexCTAEnabled');
                gridButton = parentEl.find('.pexCTA_01');

                if (type == "grid") {
                    var lowResImageSrc = el.getAttribute('style').replace('background-image: url(', '').replace(');', '');
                } else {
                    var imgSrc = pixQuery(el).find('img').attr('src');
                    var lowResImageSrc = imgSrc;
                }

                pixQuery.data(gridButton, 'teaserData', [gridButton, el, lowResImageSrc, type]);
                gridButton.on('mouseenter', function () {
                    //ga_$pex('send', 'event', 'button', 'button on '+type);
                    var teaserData = pixQuery.data(gridButton, 'teaserData');
                    pLoader.pLogic.shop.showTeaser(teaserData[0], teaserData[1], teaserData[2], teaserData[3]);
                }).on('mouseleave', function () {
                    pLoader.pLogic.shop.hideTeaser();
                }).on('click', function (event) {
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    var data = {
                        gridFeed: true,
                        imageSrc: imgSrc,
                        sourceType: type,
                        element: el
                    };
                    pLoader.pLogic.showStorePage(data);
                })

            }

            // Finally, fade in the button
            if (typeof pLoader.data.brandingDetails.presence == "undefined" || pixQuery.inArray(type, pLoader.data.brandingDetails.presence) != -1) {
                ga_$pex('send', 'event', 'button', type + ' button shown', 'flow');
                pixQuery(gridButton).stop().fadeIn(200, function () {
                    if (pixQuery(gridButton).is(':visible')) {
                        ga_$pex('send', 'event', 'button', type + ' button shown', 'visible flow');
                    }
                });
                handleActiveTeaser(gridButton, lowResImageSrc, type);
            }
        }
    }
    if (document.location.origin == "https://www.flickr.com") {
        var parentEl = pixQuery(el.parentNode);
        if (parentEl.hasClass('pexCTAEnabled')) {
            // If the button is already appended, tag it for later fade in function
            gridButton = parentEl.find('.pexCTA_01');
        } else {
            // Else, append the button
            parentEl.append(gridButton).addClass('pexCTAEnabled');
            gridButton = parentEl.find('.pexCTA_01');
            // Go to the sibling which contains the lowResImage
            var lowResImageSrc = pixQuery(el).siblings('img').attr('src');
            pixQuery.data(gridButton, 'teaserData', [gridButton, el, lowResImageSrc, type]);
            gridButton.on('mouseenter', function (e) {
                var teaserData = pixQuery.data(gridButton, 'teaserData');
                pLoader.pLogic.shop.showTeaser(teaserData[0], teaserData[1], teaserData[2], teaserData[3]);
            }).on('mouseleave', function () {
                pLoader.pLogic.shop.hideTeaser();
            }).on('click', function (event) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
                var data = {
                    gridFeed: true,
                    sourceType: type,
                    imageSrc: lowResImageSrc,
                    element: el
                };
                pLoader.pLogic.showStorePage(data);
            })
        }
        // Finally, fade in the button
        if (typeof pLoader.data.brandingDetails.presence == "undefined" || pixQuery.inArray(type, pLoader.data.brandingDetails.presence) != -1) {
            ga_$pex('send', 'event', 'button', type + ' button shown', 'flow');

            pixQuery(gridButton).stop().fadeIn(200, function () {
                if (pixQuery(gridButton).is(':visible')) {
                    ga_$pex('send', 'event', 'button', type + ' button shown', 'visible flow');
                }
            });
            handleActiveTeaser(gridButton, lowResImageSrc, type);
        }

    }
    if (document.location.origin.indexOf('imgur.com') != -1) {
        var parentEl = pixQuery(el);
        if (parentEl.hasClass('pexCTAEnabled')) {
            // If the button is already appended, tag it for later fade in function
            gridButton = parentEl.find('.pexCTA_01');
        } else {
            // Else, append the button
            parentEl.append(gridButton).addClass('pexCTAEnabled');
            gridButton = parentEl.find('.pexCTA_01');
            // Go to the sibling which contains the lowResImage
            var lowResImageSrc = pixQuery(el).find('img').attr('src');
            pixQuery.data(gridButton, 'teaserData', [gridButton, el, lowResImageSrc, type]);
            gridButton.on('mouseenter', function (e) {
                var teaserData = pixQuery.data(gridButton, 'teaserData');
                pLoader.pLogic.shop.showTeaser(teaserData[0], teaserData[1], teaserData[2], teaserData[3]);
            }).on('mouseleave', function () {
                pLoader.pLogic.shop.hideTeaser();
            }).on('click', function (event) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
                var data = {
                    gridFeed: true,
                    sourceType: type,
                    imageSrc: lowResImageSrc,
                    element: el
                };
                pLoader.pLogic.showStorePage(data);
            })
        }
        // Finally, fade in the button
        if (typeof pLoader.data.brandingDetails.presence == "undefined" || pixQuery.inArray(type, pLoader.data.brandingDetails.presence) != -1) {
            ga_$pex('send', 'event', 'button', type + ' button shown', 'flow');
            pixQuery(gridButton).stop().fadeIn(200);
            if (pixQuery(gridButton).is(':visible')) {
                ga_$pex('send', 'event', 'button', type + ' button shown', 'visible flow');
            }
            handleActiveTeaser(gridButton, lowResImageSrc, type);
        }

    }
    function handleExternalFTE(gridButton, lowResImageSrc) {
        if (typeof pLoader.data.brandingDetails.feedFTE != "undefined") {
            pLoader.pLogic.showFeedFirstTimeExperience(gridButton, lowResImageSrc, type);
        }
    }

    // Handle active teaser
    function handleActiveTeaser(gridButton, lowResImageSrc, type) {
        handleExternalFTE(gridButton, lowResImageSrc, type);
        if (typeof pLoader.data.brandingDetails.activeTeaserCount != "undefined" && typeof pixQuery.data(gridButton, 'teaserData') != "undefined") {
            var cSuffix = "";
            if (typeof pLoader.data.brandingDetails.c_suffix != "undefined" && typeof pLoader.data.brandingDetails.c_suffix.activeTeaser != "undefined") {
                cSuffix = pLoader.data.brandingDetails.c_suffix.activeTeaser;
            }
            var cookieName = pLoader.data.brandingDetails.c_prefix + "uat_" + cSuffix;
            var activeTeaserCount = pixQuery.cookie(cookieName);
            if (activeTeaserCount == null) {
                activeTeaserCount = 0;
            }
            if (activeTeaserCount < pLoader.data.brandingDetails.activeTeaserCount) {
                var teaserData = pixQuery.data(gridButton, 'teaserData');
                pLoader.pLogic.shop.showTeaser(teaserData[0], teaserData[1], teaserData[2], teaserData[3]);
                ga_$pex('send', 'event', 'button', 'active teaser on ' + teaserData[3], 'important action');
                activeTeaserCount++;
                pixQuery.cookie(cookieName, activeTeaserCount, {expires: 30, path: "/"});
            }
        }
    }
};

/* Grid/Feed end */

// Get button HTML and initialize the script
pLoader.pLogic.initialCB = function (data) {
    pLoader.pLogic.buttonHTML = data.translate();
    /* Grid/Feed Start */
    if (document.location.origin == "https://www.dropbox.com") {
        try {
            pLoader.pLogic.scannedUrl = pixQuery(".content-item img")[0].src;
        } catch (ex) {
            pLoader.pLogic.scannedUrl = document.location.href;
        }
    } else {
        pLoader.pLogic.scannedUrl = document.location.href;
    }


    function scanGridImages() {

        var validSelectors = {
            grid: '.fbStarGrid a div.tagWrapper i:not(.pex_scanned)',
            feed: 'div.userContentWrapper a div img'
        };
        var gridElements = pixQuery(validSelectors.grid);
        var feedElements = pixQuery(validSelectors.feed);
        var els, type;
        if (gridElements.length > 0) {
            els = gridElements;
            type = "grid";
        } else {
            if (feedElements.length > 0) {
                els = feedElements;
                type = "feed";
            } else {
                els = null;
                type = "none";
            }
        }
        if (type != "none") {
            els.each(function (i, el) {
                switch (document.location.origin) {
                    case "https://www.facebook.com":
                    {
                        if (type == "grid") {
                            var $el = pixQuery(el.parentNode);
                        } else {
                            var el = el.parentNode.parentNode;
                            var $el = pixQuery(el);
                        }
                        if (!$el.hasClass('pex_scanned')) {
                            $el.on('mouseenter', function () {
                                if (pLoader) {
                                    if (type == "grid") {
                                        pLoader.pLogic.shop.initGridOverlay(el, type);
                                    } else {
                                        if ($el[0].tagName == "A" && ($el.attr('href').indexOf(document.location.origin) != -1 || $el.attr('href')[0] == "/")) {
                                            pLoader.pLogic.shop.initGridOverlay(el, type);
                                        }
                                    }
                                }
                            }).addClass('pex_scanned');
                            $el.parent().on('mouseleave', function () {
                                if (pLoader) {
                                    pLoader.pLogic.shop.hideGridOverlay(el);
                                }
                            })
                        }
                        break;
                    }
                    case "https://www.flickr.com":
                    {
                        var $el = pixQuery(el);
                        if (!$el.hasClass('pex_scanned')) {
                            $el.on('mouseenter', function () {
                                if (pLoader) {
                                    pLoader.pLogic.shop.initGridOverlay(el, type);
                                }
                            }).addClass('pex_scanned');
                            $el.parent().on('mouseleave', function () {
                                if (pLoader) {
                                    pLoader.pLogic.shop.hideGridOverlay(el);
                                }
                            })
                        }
                        break;
                    }
                    /*
                     case "http://imgur.com":{
                     var $el = pixQuery(el);
                     if (!$el.hasClass('pex_scanned')) {
                     $el.on('mouseenter', function () {
                     if (pLoader) {
                     pLoader.pLogic.shop.initGridOverlay(el, type);
                     }
                     }).addClass('pex_scanned');
                     $el.parent().on('mouseleave', function () {
                     if (pLoader) {
                     pLoader.pLogic.shop.hideGridOverlay(el);
                     }
                     })
                     }
                     break;
                     }*/
                    default:
                    {

                    }
                }
            })
        }

        setTimeout(scanGridImages, 4000);
    }

    setTimeout(scanGridImages, 5000);
    /* Grid/Feed END */
    function scanImagesBool() {
        var comparisonBase = document.location.href;
        /*if(document.location.origin == "https://www.dropbox.com"){
         try{
         comparisonBase = pixQuery(".content-item img")[0].src;
         }catch(ex){
         comparisonBase = document.location.href;
         }
         }*/
        if (comparisonBase != pLoader.pLogic.scannedUrl) {
            pixQuery('#p_Store,.p_IntroButtonContainer').remove();
            pixQuery('.p_ShopWrapper img').unwrap();

            pLoader.pLogic.shop.resetShop(true);
            pLoader.pLogic.scannedUrl = comparisonBase;
            setTimeout(pLoader.pLogic.scanImagesOnPage, 1000);
            ;
            setTimeout(scanImagesBool, 2000);
        } else {
            setTimeout(scanImagesBool, 1000);
        }
    }

    setTimeout(function () {
        pLoader.pLogic.scanImagesOnPage();
        setTimeout(scanImagesBool, 1000);
    }, 2000);

};


/* Shop functions */
pLoader.pLogic.shop.closeShop = function (ev, cb, closeReason) {
    if (ev) {
        ev.stopPropagation();
        ev.preventDefault();
    }
    /**
     * Close the store
     */
    function closeStore() {
        pixQuery(window).off('scroll.p_');
        var currentStore = pixQuery('#p_Store');
        //reset the orientation global variable
        if(pLoader.pLogic.rotatedOrientation){
            pLoader.pLogic.rotatedOrientation = false;
        }
        // reset the isInited variable
        if(pLoader.pLogic.shop.isInited){
            pLoader.pLogic.shop.isInited = false;
        }
        /**
         * remove any existing custom css if it exists
         */
        if(!!pLoader.pLogic.customCssStyle){
            pixQuery(pLoader.pLogic.customCssStyle).remove();
            pLoader.pLogic.customCssStyle = null;
        }
        if (currentStore.length > 0) {
            currentStore.fadeOut(600, function () {
                currentStore.remove();
                pixQuery('.p_IntroButtonContainer').fadeIn(600);
                if (typeof pLoader.eventListener != "undefined" && typeof pLoader.eventListener.onClose != "undefined") {
                    pLoader.eventListener.onClose();
                }
                if (typeof cb == "function") {
                    cb();
                }

            });
            ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'closeStore ' + closeReason, 'event');
            //pLoader.pLogic.shop.resetOrder();
            pLoader.pLogic.shop.resetShop(false);
            try {
                pLoader.pLogic.supportWindow.close();
            } catch (ex) {
            }
            pixQuery('#p_overlay').remove();
        }
    }

    if (closeReason == "click on close button" && pLoader.pLogic.showExitSurvey && typeof pLoader.data.brandingDetails.showSurvey != "undefined" && pLoader.data.brandingDetails.showSurvey) {
        pLoader.pLogic.showExitSurveyLogic(closeStore);
    } else {
        closeStore();
    }

};

pLoader.pLogic.showExitSurveyLogic = function (cb) {
    var cookieName = pLoader.data.brandingDetails.c_prefix + '_eSurvey';
    var exitSurveyCookie = pixQuery.cookie(cookieName);
    if (pixQuery.cookie(exitSurveyCookie)) {
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'Exit survey shown', 'event');
        pLoader.pLogic.createPopup('exit_survey', {
            'userAnswered': function (answer) {
                pLoader.pLogic.sendInternalEvent('survey_answer', pLoader.pLogic.shop.stepNum, {'answer': answer}, false);
            },
            'closeStoreCB': cb
        });
        pixQuery.cookie(cookieName, 'true', {expires: 364, path: '/'});
    } else {
        cb();
    }
};

pLoader.pLogic.shop.resetDPIFlag = function () {
    pixQuery(pLoader.pLogic.productsJson).each(function (i, el) {
        el.dpiFlag = false;
    })
};

pLoader.pLogic.replaceSpecialOfferData = function (newJSON) {
    pLoader.data.brandingDetails.originalSpecialOffer = pLoader.data.brandingDetails.specialOffer;
    pLoader.data.brandingDetails.specialOffer = newJSON;
};
pLoader.pLogic.restoreSpecialOfferData = function () {
    if (typeof pLoader.data.brandingDetails.originalSpecialOffer != "undefined") {
        pLoader.data.brandingDetails.specialOffer = pLoader.data.brandingDetails.originalSpecialOffer;
        delete pLoader.data.brandingDetails.originalSpecialOffer;
    }
};

pLoader.pLogic.shop.resetShareParams = function () {
    delete pLoader.pLogic.shareImageURL;
    delete pLoader.pLogic.immediateStats.sharePostId;
    pLoader.pLogic.restoreSpecialOfferData();
};

pLoader.pLogic.shop.resetOrder = function () {
    pLoader.pLogic.orderDetails = {};
    // Only retain the source on order reset.
    if (typeof pLoader.pLogic.immediateStats.source != "undefined") {
        pLoader.pLogic.immediateStats = {source: pLoader.pLogic.immediateStats.source}
    } else {
        pLoader.pLogic.immediateStats = {source: "largeImage"};
    }
    pLoader.pLogic.orderDetails.imageUpload = "";
    pLoader.pLogic.shop.selectedItem = null;
    pLoader.pLogic.rawImageObj = null;
    pLoader.pLogic.shop.insecureImg = false;
    pLoader.pLogic.shop.selectedItemParent = null;
    pLoader.pLogic.shop.resetDPIFlag();
    pLoader.pLogic.shop.resetShareParams();
    pLoader.pLogic.completedOrderId = null;
    delete pLoader.pLogic.orderDetails.couponPrices;
};

pLoader.pLogic.shop.resetShop = function (removeButton) {
    pLoader.pLogic.shop.resetOrder();
    pLoader.pLogic.immediateStats = {};
    pLoader.pLogic.shop.imageDataURL = {};
    pLoader.pLogic.selectedImage = null;
    pixQuery('#pMegaTeaserContainer').remove();
    pLoader.pLogic.hideFirstTimeExperience();

    pLoader.pLogic.selectedImageDimensions = null;
    pLoader.pLogic.shop.corsURL = null;
    if (removeButton) {
        pixQuery('.p_ShopWrapper').find('img').unwrap();
        pixQuery('.p_IntroButtonContainer').remove();
    }
    pixQuery(window).off('scroll.p_');
    pixQuery(pLoader.pLogic).unbind();
    delete pLoader.skipStepObject;
};

pLoader.pLogic.shop.disableShop = function (event) {
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
    event.stopPropagation();
    pLoader.pLogic.createPopup("disableShop");

};

pLoader.pLogic.shop.updateHeader = function (txt) {
    document.querySelector('#p_StoreHeader #headerText').innerHTML = txt.translate();
};

pLoader.pLogic.shop.getStepHTML = function (stepNum, renderContainer, cb, params) {
    pLoader.crossDomainAjax(pLoader.assetsServer + pLoader.data.assetsList.partialBaseURL + 'step' + stepNum + '.html', function (data) {
        renderContainer.innerHTML = data.translate();
        cb(params);
    })
};

pLoader.pLogic.shop.turnAbsolute = function () {
    var storeContainer = pixQuery('#p_Store');
    if (storeContainer.css('position') != 'absolute') {
        storeContainer.attr({
            'prev_top': storeContainer.css('top'),
            'prev_bottom': storeContainer.css('bottom')
        });
        var top, bottom;
        if (typeof pLoader.overlayMode != "undefined" && pLoader.overlayMode == true) {
            storeContainer.css({
                'position': 'absolute'
            })
        } else {
            var storeOffset = storeContainer.offset();
            storeContainer.css({
                'position': 'absolute',
                'top': storeOffset.top + "px",
                'bottom': 'auto'
            })
        }

    }
};

pLoader.pLogic.shop.turnFixed = function () {
    var storeContainer = pixQuery('#p_Store');
    if (storeContainer.css('position') != 'fixed') {
        storeContainer.css({
            'position': 'fixed',
            'top': storeContainer.attr('prev_top'),
            'bottom': storeContainer.attr('prev_bottom')
        });
        storeContainer.removeAttr('prev_top');
        storeContainer.removeAttr('prev_bottom');
    }
};

pLoader.pLogic.shop.initStep = function (stepNum, e, direct, params) {
    pLoader.pLogic.shop.canvas = document.getElementById('p_ShopCanvas');
    var currentStep = parseFloat(pixQuery('#p_Store').attr('class').split(' ')[0].replace('pStore_step_', '').replace('_', '.'));
    if (stepNum == 2) {
        if (currentStep < 2)
            pLoader.pLogic.origin = currentStep;
    }

    if (stepNum == 3 || stepNum == 3.5) {
        //pLoader.pLogic.shop.turnAbsolute();
    } else {
        //pLoader.pLogic.shop.turnFixed();
    }

    pixQuery(window).off('scroll.p_');
    var actionValue;
    if (stepNum == 3) {
        actionValue = 'important action'
    } else {
        actionValue = 'flow'
    }

    if (stepNum != 2) {
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum) + ' impression', actionValue);
        var analyticsPageURL = 'pixter/' + pLoader.pLogic.convertStepsToNames(stepNum).replace(' ', '_').toLowerCase() + '/';
        try {
            analyticsPageURL += document.location.search;
        } catch (ex) {
        }
        ;
        ga_$pex('send', {
            'hitType': 'pageview',
            'page': analyticsPageURL,
            'title': 'Pixter | ' + pLoader.pLogic.convertStepsToNames(stepNum)
        });
        pLoader.fireAnalyticsOnVisible([pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum) + '  impression', 'visible flow']);
    }


    // Add the step number to the class string
    var classList = ('pStore_step_' + stepNum).replace('.', '_');

    // Add branding class
    if (typeof pLoader.data.brandingDetails.ui_id != "undefined") {
        classList = classList + " " + pLoader.data.brandingDetails.ui_id;
    } else {
        classList = classList + " _pg_base";
    }

    // Add active user messaging
    if (pixQuery('#p_Store').hasClass('activeMessaging')) {
        classList = classList + " activeMessaging";
    }

    classList = classList + " os_" + pLoader.pLogic.getOS();

    pixQuery(document).off('keydown.p_oss');
    pixQuery(window).off('scroll');
    /**
     * done in setTimeout so it will be done after the shop canvas fadeOut (if any) ,
     * so that the user cant see the css changes in catalog view (didn't happen in oss)
     * in the first time set the class right away, otherwise set it after 300 ms (so it will wait for the fadeOut to finish)
     */
    var setClassTimeOut;

    if (pLoader.pLogic.shop.isInited && !pLoader.data.brandingDetails.marketingData.ossEnabled) {
        setClassTimeOut = 300;
    } else {
        setClassTimeOut = 0;
        pLoader.pLogic.shop.isInited = true;
    }
    setTimeout(function () {
        pixQuery('#p_Store').attr('class', classList);
    }, setClassTimeOut);

    pixQuery(pLoader.pLogic).trigger('stepChange');


    //Virtual pages
    //ga_$pex('send', { 'hitType': 'pageview', 'page': 'pixter/'+pLoader.pLogic.convertStepsToNames(stepNum)+'/', 'title':'Pixter | '+pLoader.pLogic.convertStepsToNames(stepNum)});



    switch (stepNum) {
        case 1:
        {
            var isVisited = false;
            var fadeOutTime = 0;
            pixQuery('#backp_Store').css('display', 'none');
            if (pLoader.pLogic.shop.selectedItem) {
                isVisited = true;
                fadeOutTime = 300;
            }
            pLoader.pLogic.shop.selectedItem = null;
            pLoader.pLogic.shop.selectedItemParent = null;
            pixQuery('#userMessaging').removeClass('bigUM');
            pixQuery(pLoader.pLogic.shop.canvas).fadeOut(fadeOutTime, function () {
                pLoader.pLogic.shop.getStepHTML(stepNum, pLoader.pLogic.shop.canvas, pLoader.pLogic.shop.initStepOne, isVisited);
            });
            break;
        }
        case 1.5:
        {
            pLoader.pLogic.showExitSurvey = true;
            if (pLoader.pLogic.shop.selectedItemParent == null) {
                pLoader.pLogic.shop.selectedItemParent = pLoader.pLogic.shop.selectedItem;
            }
            if (pLoader.pLogic.shop.selectedItem == null) {
                pLoader.pLogic.shop.selectedItem = pixQuery(pixQuery(e.target).parents('.p_Product')[0]).data('data-product');
            } else {
                pLoader.pLogic.shop.selectedItem = pLoader.pLogic.shop.selectedItemParent
            }
            clearTimeout(pLoader.pLogic.catalogTimeout);
            pLoader.pLogic.hideFirstTimeExperience();
            pLoader.pLogic.shop.getStepHTML(1, pLoader.pLogic.shop.canvas, pLoader.pLogic.shop.showChildProducts);
            break;
        }
        case 2:
        {


            pLoader.pLogic.hideFirstTimeExperience();
            if (typeof direct != "undefined" && direct) {
                pixQuery('#p_Store').height('465px');
                if (typeof pLoader.overlayMode != "undefined" && pLoader.overlayMode == true) {
                    switch (pLoader.data.brandingDetails.ui_id) {
                        case "_pg2_m1":
                        {
                            pLoader.pLogic.centerStore(true, true, 560);
                            break;
                        }
                        case "_sld":
                        {
                            pLoader.pLogic.centerStore(true, true, 400);
                            break;
                        }
                        default:
                        {
                            pLoader.pLogic.centerStore(true, true);
                            break;
                        }

                    }
                }
            }

            pixQuery(pLoader.pLogic.shop.canvas).fadeOut(300, function () {
                pixQuery('#p_Store').removeClass('oss_enabled');
                pixQuery('#backp_Store').css('display', 'block');
                if (typeof params == "undefined" || params.type != "ossPreview") {
                    pLoader.pLogic.shop.updateHeader('Preview Your Product');
                    pLoader.pLogic.showExitSurvey = true;
                } else {
                    pLoader.pLogic.shop.updateHeader('Choose Your Photo Product');
                    pixQuery('#userMessaging').html('');
                }
                if (typeof pLoader.pLogic.shop.selectedItem == "undefined" || pLoader.pLogic.shop.selectedItem == null || pLoader.pLogic.shop.selectedItem == "") {
                    pLoader.pLogic.shop.selectedItem = pixQuery(pixQuery(e.target).parents('.p_Product')[0]).data('data-product');
                } else {

                }
                pLoader.pLogic.shop.previewPrint(e, params);
            });
            break;
        }
        case 3:
        {
            pLoader.pLogic.showExitSurvey = true;
            pixQuery(pLoader.pLogic.shop.canvas).fadeOut(300, function () {
                //pLoader.pLogic.disableUserMessaging();
                pLoader.pLogic.shop.updateHeader('Edit Your Image');
                pLoader.pLogic.shop.getStepHTML(stepNum, pLoader.pLogic.shop.canvas, pLoader.pLogic.shop.initCropTool, params);
                //pLoader.pLogic.cropTool.init(rawImage,cropContainer,cropRatio,cb);
            });
            break;
        }
        case 3.5:
        {
            pLoader.pLogic.disableUserMessaging();
            pixQuery(pLoader.pLogic.shop.canvas).fadeOut(300, function () {
                //pLoader.pLogic.disableUserMessaging();
                pLoader.pLogic.shop.getStepHTML(stepNum, pLoader.pLogic.shop.canvas, pLoader.pLogic.shop.populateRSP);
            });
            break;
        }
        case 4:
        {
            pixQuery(pLoader.pLogic.shop.canvas).fadeOut(300, function () {
                pLoader.pLogic.shop.updateHeader('Order Details');
                pLoader.pLogic.shop.getStepHTML(stepNum, pLoader.pLogic.shop.canvas, pLoader.pLogic.shop.renderPersonalDetails);
            });
            break;
        }
        case 5:
        {
            pixQuery(pLoader.pLogic.shop.canvas).fadeOut(300, function () {
                pLoader.pLogic.shop.updateHeader('Checkout Information');
                pLoader.pLogic.shop.getStepHTML(stepNum, pLoader.pLogic.shop.canvas, pLoader.pLogic.shop.renderOrderConfirmation);
            });
            break;
        }
        case 6:
        {
            pLoader.pLogic.showExitSurvey = false;
            try {
                pLoader.pLogic.supportWindow.close()
            } catch (ex) {

            }
            pLoader.pLogic.disableUserMessaging();
            pixQuery(pLoader.pLogic.shop.canvas).fadeOut(300, function () {
                pLoader.pLogic.shop.updateHeader('Thank you for your order!');
                pLoader.pLogic.shop.getStepHTML(stepNum, pLoader.pLogic.shop.canvas, pLoader.pLogic.shop.handleThankYouPage);
            });
            break;
        }
    }
};

/**
 * initializing the Catalog step (Step 1)
 * @param isVisited {boolean} - indicate that the user came to the catalog step using the back button
 *
 * if isVisited is true than the products render with 0 timeout and the shop canvas is faded into the dom
 */
pLoader.pLogic.shop.initStepOne = function (isVisited) {
    //console.log('initStepOne');
    pLoader.fireAnalyticsOnVisible(['catalog', 'impression', 'visible flow']);
    var analyticsPageURL = 'pixter/' + pLoader.pLogic.convertStepsToNames(1).replace(' ', '_').toLowerCase() + '/';
    try {
        analyticsPageURL += document.location.search;
    } catch (ex) {
    }
    ga_$pex('send', {
        'hitType': 'pageview',
        'page': analyticsPageURL,
        'title': 'Pixter | ' + pLoader.pLogic.convertStepsToNames(1)
    });

    if (typeof pLoader.data.brandingDetails.specialOffer != "undefined") {
        var startDate = new Date(pLoader.data.brandingDetails.specialOffer.startDate).getTime();
        var endDate = new Date(pLoader.data.brandingDetails.specialOffer.endDate).getTime();
        var currentDate = new Date().getTime();
        if (startDate < currentDate && currentDate < endDate) {
            pLoader.pLogic.specialOfferEnabled = true;
            pLoader.pLogic.enableUserMessaging(pLoader.data.brandingDetails.specialOffer.catalog, 300);
        }
    }

    /* Special offer end */

    pLoader.pLogic.immediateStats.dpiWarning = false;

    // Remove cropped / pre-rendedered thumbnails from the dataURL array
    if (pLoader.pLogic.shop.selectedItem != null) {
        delete pLoader.pLogic.shop.imageDataURL[pLoader.pLogic.shop.selectedItem.type]
    }


    var renderCategoryThumbnails = function () {
        var i = 0;
        var l = pLoader.data.categories.length;
        pixQuery('#productList', '#p_Store').addClass('grid_' + l);
        pLoader.pLogic.shop.updateHeader('Click a Product To Get Started');

        var renderLoop = function () {
            pLoader.pLogic.catalogTimeout = setTimeout(function () {
                pLoader.pLogic.shop.renderProduct(pLoader.data.categories.filter(function (category) {
                    return category.index === i;
                })[0], i, cb)
                function cb() {
                    if (i < l) {
                        i++;
                        if (i != l) renderLoop(pLoader.pLogic.timer);
                    }
                    if (i == (l - 1)) {
                        if (isVisited) {
                            pixQuery(pLoader.pLogic.shop.canvas).fadeIn(200);
                        }
                    }

                }
            }, pLoader.pLogic.timer)
        };

        pLoader.pLogic.timer = 500;

        if (isVisited) {
            pLoader.pLogic.timer = 0;
        } else {
            pixQuery(pLoader.pLogic.shop.canvas).fadeIn(0);
        }

        renderLoop();
    };


    //if(pixQuery('#p_Store').height() > 230 || pixQuery('#p_Store').length == 0){
    //    //pixQuery('#p_ShopCanvas').fadeOut();
    //    pixQuery('#p_Store').animate({
    //        "height": "220px",
    //        "top":pLoader.pLogic.originalTop
    //    },500,renderCategoryThumbnails).css('position','fixed');
    //}else{
    renderCategoryThumbnails();
    //}
    pLoader.pLogic.sendInternalEvent('catalog_impression', '1', {}, false);


};


/* Out of service - 23/12


 pLoader.pLogic.generateThumbnailDataForAllProds = function(imgObj,cb){
 var counter = 0;
 var counterEnd = pLoader.pLogic.productsJson.length;

 function getDataURLForProduct(data){
 var baseImage = new Image();
 baseImage.setAttribute('crossOrigin','anonymous');
 baseImage.onload = function(){
 var cropRatio = data.cropRatio;
 var imageHeight = baseImage.height;
 var imageWidth = baseImage.width;
 var canvasH,canvasW,cropX,cropY;
 var cropType = (imageHeight / imageWidth >= cropRatio ? "hCrop" : "vCrop");

 if(cropType == "hCrop"){
 canvasH = imageWidth * cropRatio;
 canvasW = imageWidth;
 cropX = 0;
 cropY = (imageHeight - canvasH) / 2
 }else{
 canvasH = imageHeight;
 canvasW = imageHeight / cropRatio;
 cropX = (imageWidth - canvasW) / 2;
 cropY = 0;
 }

 var tempCanvas = pixQuery('body').append('<canvas id="pixTCanv" style="display:none" class="tempCanvas"></canvas>').find('#pixTCanv');
 tempCanvas.attr({
 height:canvasH,
 width:canvasW
 })
 var ctx = tempCanvas[0].getContext('2d');
 ctx.drawImage(baseImage, cropX, cropY, canvasW, canvasH, 0, 0, canvasW, canvasH);
 var dataURL = tempCanvas[0].toDataURL('image/jpeg', 0.99);
 pLoader.pLogic.shop.imageDataURL[data.type] = dataURL;
 pLoader.pLogic.shop.selectedImage = dataURL;
 URL.revokeObjectURL(dataURL);
 counter++;
 try{
 tempCanvas.remove();
 }catch(ex){}
 }
 baseImage.src = imgObj;
 }

 function getProductsLoop(){
 function checkEndResult(){
 if(counter == counterEnd){
 cb();
 }else{
 setTimeout(checkEndResult,100);
 }
 }
 for(var i = 0;i < counterEnd;i++){
 var data = pLoader.pLogic.productsJson[i];
 if(typeof pLoader.pLogic.shop.imageDataURL[data.type] == "undefined"){
 getDataURLForProduct(data);
 }else{
 counter++;
 }
 }
 checkEndResult();
 }
 getProductsLoop();
 }

 */

pLoader.pLogic.generateThumbnailDataURL = function (data, srcURL, cb) {
    var baseImage = new Image();
    if (!pLoader.isDataURL(srcURL))  baseImage.setAttribute('crossOrigin', 'anonymous');
    baseImage.onload = function () {
        var cropRatio = data.cropRatio;
        var imageHeight = baseImage.height;
        var imageWidth = baseImage.width;
        var canvasH, canvasW, cropX, cropY;
        var cropType = (imageHeight / imageWidth >= cropRatio ? "hCrop" : "vCrop");

        if (cropType == "hCrop") {
            canvasH = imageWidth * cropRatio;
            canvasW = imageWidth;
            cropX = 0;
            cropY = (imageHeight - canvasH) / 2
        } else {
            canvasH = imageHeight;
            canvasW = imageHeight / cropRatio;
            cropX = (imageWidth - canvasW) / 2;
            cropY = 0;
        }

        pixQuery('#p_Store').append('<canvas id="p_TempCanvas" style="display:none" class="tempCanvas"></canvas>');
        var tempCanvas = pixQuery('#p_Store #p_TempCanvas');
        tempCanvas.attr({
            height: canvasH,
            width: canvasW
        });
        var ctx = tempCanvas[0].getContext('2d');
        ctx.drawImage(baseImage, cropX, cropY, canvasW, canvasH, 0, 0, canvasW, canvasH);
        var dataURL = tempCanvas[0].toDataURL('image/jpeg', 0.99);
        pLoader.pLogic.shop.imageDataURL[data.type] = dataURL;
        try {
            tempCanvas.remove();
        } catch (ex) {
        }
        cb(dataURL);
        URL.revokeObjectURL(dataURL);
    };
    /*
     baseImage.onerror = function(e){
     pLoader.pLogic.shop.insecureImg = true;
     cb(e.path[0].src);
     }
     */
    baseImage.src = srcURL;

};

pLoader.pLogic.generateSmallThumbnail = function (data, imgObj, type) {
    var imgUrl;
    var backgroundSize = 'contain';
    if (typeof data.previewImage == "undefined") {
        imgUrl = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + data.type + "Template.png";
    } else {
        imgUrl = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + data.previewImage;
    }
    if (typeof pLoader.pLogic.shop.imageDataURL[data.type] != "undefined" && type != "imgObj") {
        var htmlTemplate = '<div class="productTemplate product_{1}"><div style="overflow:hidden;height:100%;width:100%;"><div style="background:url({0}) no-repeat center center; background-size:{7}" class="productCoverImage"></div><img src="{4}" width="{2}" height="{3}" style="left:{5}px;top:{6}px" class="productCroppedImg"/></div></div>';
        return htmlTemplate.pFormat(imgUrl, data.type, data.tmbWidth, data.tmbHeight, imgObj, (120 - data.tmbWidth) / 2, (120 - data.tmbHeight) / 2, backgroundSize);
    } else {
        backgroundSize = (data.type == 'mug' || data.type == 'tshirt') ? 'cover' : backgroundSize;
        var htmlTemplate = '<div class="productTemplate product_{1}"><div style="background:url({0}) no-repeat center center; background-size:{5}" class="productCoverImage"></div><div class="thumbnailMask" style="height:{3}px;width:{2}px;">{4}</div></div>';
        return htmlTemplate.pFormat(imgUrl, data.type, data.tmbWidth, data.tmbHeight, imgObj.outerHTML, backgroundSize);
    }

};


pLoader.pLogic.generateThumbnailImage = function (data, cb) {
    var newImage = new Image();
    var originalImage = pLoader.pLogic.rawImageObj;
    newImage.onload = function () {
        var cropRatio = data.cropRatio;
        var imageHeight = originalImage.height;
        var imageWidth = originalImage.width;
        var imageRatio = imageHeight / imageWidth;

        var newImageH, newImageW, newImageX, newImageY;
        var cropType = (imageRatio >= cropRatio ? "hCrop" : "vCrop");
        if (cropType == "hCrop") {
            newImageH = data.tmbWidth * imageRatio;
            newImageW = data.tmbWidth;
            newImageX = 0;
            newImageY = (data.tmbHeight - newImageH) / 2;
        } else {
            newImageH = data.tmbHeight;
            newImageW = data.tmbHeight / imageRatio;
            newImageX = (data.tmbWidth - newImageW) / 2;
            newImageY = 0;
        }

        pixQuery(newImage).attr({
            height: newImageH,
            width: newImageW
        }).css({
            top: newImageY,
            left: newImageX
        });
        cb(newImage);
        //pLoader.pLogic.shop.imageDataURL[data.type] = newImage;
    };

    newImage.src = originalImage.src;
};

pLoader.pLogic.checkSOForProduct = function (pid) {

    if (typeof pLoader.data.brandingDetails.specialOffer != "undefined" && typeof pLoader.data.brandingDetails.specialOffer.selfInitiate != "undefined" && typeof pLoader.data.brandingDetails.specialOffer.selfInitiate['product_' + pid] != "undefined") {
        return pLoader.data.brandingDetails.specialOffer.selfInitiate['product_' + pid];
    } else {
        return false;
    }
}

/**
 * @param data {object. <category,product>} the Product to render.
 * @param i {int} the index of the product currently rendering
 */
pLoader.pLogic.shop.renderProduct = function (data, i, cbFunction) {
    var cb = function (thumbnailImg) {
        var productTmb = pLoader.pLogic.generateSmallThumbnail(data, thumbnailImg, 'imgObj');
        var liTemplate = '{0}<div class="productData"><span class="productName pub-brand-store-text">{1}</span><span class="productPrice">{2}</span></div>' +
            '<a href="#" class="productBuyNow p_Button pub-brand-buttons thinp_Button">##Next##</a>'.translate();
        var productPrice;
        if (typeof data.children != "undefined" && data.children.length > 0) {
            productPrice = pLoader.pLogic.currency + pLoader.data.pricing.categories[data.type].price
        } else {
            productPrice = pLoader.pLogic.currency + pLoader.data.pricing.products[data.pid].price
        }
        var pid;
        if (typeof data.pid == "undefined" && (data.children.length == 1 || !!data.isRenderAsOne)) {

            pid = data.children[0];
        } else {
            pid = data.pid;
        }
        var productSOObj = pLoader.pLogic.checkSOForProduct(pid);
        //Commented out in order for the price in Branding json not to override the price in pricing jsons.
        /*
         if (productSOObj) {
         productPrice = productSOObj.newPrice;
         }
         */


        liTemplate = liTemplate.pFormat(productTmb, data.shortName.translate(), productPrice, i);
        var liNode = document.createElement('li');
        liNode.className = "p_Product productIndex_" + i;

        pixQuery(liNode).data('data-product', JSON.stringify(data));
        pLoader.pLogic.shop.canvas.children[0].appendChild(liNode);


        if (pLoader.pLogic.timer != 0) {
            if (pLoader.pLogic.timer == -1) {
                pixQuery(liNode).css('display', 'none').append(liTemplate);
            } else {
                pixQuery(liNode).css('display', 'none').append(liTemplate).fadeIn(pLoader.pLogic.timer);
            }
        } else {
            pixQuery(liNode).append(liTemplate);
        }
        if (typeof productSOObj.styleClass != "undefined") {
            pixQuery(liNode).addClass(productSOObj.styleClass).append('<div class="stylingAddedElement"></div>');

        }

        pixQuery(pLoader.pLogic).trigger('childProductReady', i);
        /**
         * Handle Catalog Item Click event
         */
        pixQuery(liNode).on('click', function (e) {
            e.preventDefault();
            var target = pixQuery(e.target);
            var clickTarget = "clickOnProductButton";

            if (e.target.tagName == "DIV") {
                target = target.parent();
                clickTarget = "clickOnProductImage";
            }

            var productName = data.shortName;
            ga_$pex('send', 'event', 'Catalog', clickTarget + " - " + productName, 'important action');

            //pLoader.pLogic.shop.resetOrder();

            if (typeof data.children == "undefined") {
                pLoader.pLogic.shop.selectedItem = data;
                pLoader.pLogic.shop.stepNum = 2;
            } else {
                if (data.children.length > 1 && !data.isRenderAsOne) {
                    pLoader.pLogic.shop.selectedItemParent = data;
                    pLoader.pLogic.shop.stepNum = 1.5;
                } else {
                    var selectedItem = data.children[0];
                    if (typeof data.defaultDropDownItem != "undefined" && data.isRenderAsOne) {
                        selectedItem = data.defaultDropDownItem
                    }
                    pLoader.pLogic.shop.selectedItem = pixQuery.grep(pLoader.pLogic.productsJson, function (e) {
                        return e.pid == selectedItem
                    })[0];
                    pLoader.pLogic.shop.stepNum = 2;
                }
            }

            pixQuery(pLoader.pLogic.shop.canvas).fadeOut(200, function () {
                pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, e)
            })
        });
        /**
         * call the callback function
         */
        if (typeof cbFunction === 'function') {
            cbFunction();
        }

    };
    if ((pLoader.pLogic.shop.stepNum == 1 && (typeof data.disabled == "undefined" || data.disabled == "false")) || pLoader.pLogic.shop.stepNum == 1.5) {
        pLoader.pLogic.generateThumbnailImage(data, cb);
    }
};

pLoader.pLogic.shop.showChildProducts = function () {
    var productData;
    pixQuery(pLoader.pLogic.shop.canvas).fadeIn(200);
    if (pixQuery.isPlainObject(pLoader.pLogic.shop.selectedItem) == false) {
        productData = JSON.parse(pLoader.pLogic.shop.selectedItem);
    } else {
        productData = pLoader.pLogic.shop.selectedItem;
    }

    var categoryChildren = pLoader.pLogic.shop.selectedItemParent.children;
    var specialOfferFlag = false;
    if (pLoader.pLogic.specialOfferEnabled) {
        for (var i = 0; i <= categoryChildren.length - 1; i++) {
            if ('product_' + categoryChildren[i] in pLoader.data.brandingDetails.specialOffer && pLoader.data.brandingDetails.specialOffer['product_' + categoryChildren[i]] != "") {
                pLoader.pLogic.enableUserMessaging(pLoader.data.brandingDetails.specialOffer['product_' + categoryChildren[i]], 200);
                specialOfferFlag = true;
            }
            if (i == categoryChildren.length - 1 && !specialOfferFlag) {
                if (typeof pLoader.pLogic.shop.selectedItemParent.categoryText != "undefined" && pLoader.pLogic.shop.selectedItemParent.categoryText != "") {
                    pLoader.pLogic.enableUserMessaging(pLoader.pLogic.shop.selectedItemParent.categoryText.translate(), 200);
                } else {
                    pLoader.pLogic.disableUserMessaging();
                }
            }
        }
    } else {
        if (typeof pLoader.pLogic.shop.selectedItemParent.categoryText != "undefined" && pLoader.pLogic.shop.selectedItemParent.categoryText != "") {
            pLoader.pLogic.enableUserMessaging(pLoader.pLogic.shop.selectedItemParent.categoryText, 200);
        }
    }

    /*
     if(typeof pLoader.data.brandingDetails.specialOffer['product_'+productId] == "undefined" || pLoader.data.brandingDetails.specialOffer['product_'+productId] == ""){
     pLoader.pLogic.disableUserMessaging();
     }else{
     pLoader.pLogic.enableUserMessaging(pLoader.data.brandingDetails.specialOffer['product_'+productId],200);
     }
     */


    var childrenDataArray = [], tempPlaceholder;
    for (var i = 0; i < productData.children.length; i++) {
        tempPlaceholder = pixQuery.grep(pLoader.data.products, function (e) {
            return e.pid == productData.children[i];
        });
        if (tempPlaceholder.length == 0) {
            tempPlaceholder = pixQuery.grep(pLoader.data.categories, function (e) {
                return e.id == productData.children[i];
            });
        }
        childrenDataArray.push(tempPlaceholder[0]);
    }
    pLoader.pLogic.shop.updateHeader('Choose a'.translate() + ' ' + pLoader.pLogic.shop.selectedItemParent.shortName);
    pixQuery("#productList").addClass('grid_' + childrenDataArray.length);
    function renderChildrenProducts() {
        var numOfChildren = childrenDataArray.length;
        pLoader.pLogic.timer = -1;
        var initializedOnStep = pLoader.pLogic.shop.stepNum;
        pixQuery(pLoader.pLogic).on('childProductReady', function (e, x) {
            if (x == numOfChildren - 1) {
                pixQuery('.pStore_step_1_5 #productList li').fadeIn(500);
                pixQuery('#backp_Store').css('display', 'block');
                pixQuery(pLoader.pLogic).off('childProductReady');
            } else {
                x++;
                if (pLoader.pLogic.shop.stepNum == initializedOnStep) {
                    pLoader.pLogic.shop.renderProduct(childrenDataArray[x], x);
                }
            }
        });
        var x = 0;
        pLoader.pLogic.shop.renderProduct(childrenDataArray[x], x);

    }

    if (childrenDataArray.length > 4) {
        pixQuery('#userMessaging').addClass('bigUM');
        /**
         * commented on 17/4/16
         * canceled store jump when not 465 on subCategory
         * always call renderChildrenProducts
         */
        renderChildrenProducts();
        /*if(pixQuery('#p_Store').height() != 465) {
         var top;
         if(typeof pLoader.overlayMode != "undefined" && pLoader.overlayMode == true){
         top = (parseInt(pixQuery('#p_overlay').css('height')) - 580)/2 + "px";
         }else{
         top =  pLoader.pLogic.originalTop - 235 + "px";
         }
         pixQuery('#p_Store').animate({
         "height": "465px",
         "top":top
         }, 500, renderChildrenProducts)
         }else{
         renderChildrenProducts();
         }*/
    } else {
        pixQuery('#userMessaging').removeClass('bigUM');
        if (pixQuery('#p_Store').height() > 230 || pixQuery('#p_Store').length == 0) {
            //pixQuery('#p_ShopCanvas').fadeOut();
            pixQuery('#p_Store').animate({
                "height": "220px",
                "top": pLoader.pLogic.originalTop
            }, 500, renderChildrenProducts)
        } else {
            renderChildrenProducts();
        }
    }

};


pLoader.pLogic.regularCheckout = function (dataJson, skipDPICheck) {

    function DPIsuccess() {
        pLoader.pLogic.shop.stepNum = 4;
        pLoader.pLogic.sendDataURL(pLoader.pLogic.shop.imageDataURL[dataJson.type], function (imageLocation) {
            pLoader.pLogic.orderDetails.imageUpload = imageLocation;
            pixQuery(pLoader.pLogic).trigger('imageUploadComplete');
        });

        pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);

    }

    function cb(dpiCheckResult) {
        if (dpiCheckResult) {
            DPIsuccess();
        } else {
            pLoader.pLogic.createPopup('dpiWarning_preview', {"checkoutType": "regular"});
        }
    }

    var dpiFlagForProduct = pixQuery.grep(pLoader.pLogic.productsJson, function (e) {
        return e.pid == pLoader.pLogic.shop.selectedItem.pid
    })[0].dpiFlag;
    if ((typeof dpiFlagForProduct == "undefined" || dpiFlagForProduct == false) && (typeof skipDPICheck == "undefined" || !skipDPICheck)) {
        pLoader.pLogic.calculateDPI(dataJson, cb);
    } else {
        DPIsuccess();
    }
};


pLoader.pLogic.renderExpressPreview = function (dataJson, dataURL) {
    var brandTOC;
    if (typeof pLoader.data.brandingDetails.brandTOC != "undefined" && pLoader.data.brandingDetails.brandTOC != "") {
        brandTOC = pLoader.data.brandingDetails.brandTOC;
    } else {
        brandTOC = pLoader.data.brandingDetails.brandSite;
    }
    var expressCheckoutHtml = '<div id="expressCheckoutContainer"><a href="#" id="p_expressCheckout"></a><a id="p_regularCheckout" href="#" style="text-decoration: none; margin-top: 0px;"><span style="padding: 0px 7px; text-decoration: underline; cursor: pointer;">##Prefer Credit Card?##</span> <span style="padding: 0 7px;    text-decoration: underline; cursor: pointer;">##Have a coupon?##</span></a></div>'.translate();
    pixQuery(expressCheckoutHtml).appendTo('.previewRightPanel');
    pixQuery(TOCCheckbox).appendTo('.previewLeftPanel');
    var expressTOC = pixQuery('#expressCheckoutTOC');
    expressTOC.tooltipster({
        content: pixQuery('<span>##Please click on the checkbox below<br/> to accept the terms and continue##</span>'.translate()),
        trigger: "custom",
        position: "top-left",
        theme: 'tooltipster-pstore'
    });

    var cookieName = pLoader.data.brandingDetails.c_prefix + "ud";
    var userDetailsCookie = pixQuery.cookie(cookieName);
    if (userDetailsCookie) {
        var userDetails = JSON.parse(userDetailsCookie);
        if (userDetails.TOC == "on") {
            document.querySelector('#expressCheckoutTOC input').checked = true;
        }
    }

    if (typeof pLoader.pLogic.ossEnabled != "undefined") {
        pixQuery('#expressCheckoutTOC').hide();
    }

    function confirmTOCClick() {
        if (!document.querySelector('#expressCheckoutTOC input').checked) {
            expressTOC.tooltipster('show');
            window.t = setTimeout(function () {
                expressTOC.tooltipster('hide');
            }, 5000);
            return false;
        } else {
            var cookieName = pLoader.data.brandingDetails.c_prefix + "ud";
            var userDetailsCookie = pixQuery.cookie(cookieName);
            var userDetails;
            if (userDetailsCookie) {
                userDetails = JSON.parse(userDetailsCookie);
            } else {
                userDetails = {};
            }
            pixQuery.cookie(cookieName, JSON.stringify(userDetails), {expires: 364, path: '/'});

            return true;
        }
    }

    function storeDPICheck(val) {
        pLoader.pLogic.TempDPICheck = val
    }

    pLoader.pLogic.calculateDPI(pLoader.pLogic.shop.selectedItem, storeDPICheck, dataURL);

    pixQuery('#p_expressCheckout').on('click', function (e) {
        e.preventDefault();
        if (confirmTOCClick()) {
            pLoader.pLogic.sendInternalEvent('click_on_express_checkout_in_express_preview_page', '2', {}, false);
            ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'click on express checkout in express preview page', 'event');
            if (pLoader.pLogic.TempDPICheck) {
                pLoader.pLogic.configSupportWindow('Uploading your image...'.translate(), null, '(Please note: Your shipping address will be obtained during checkout)'.translate());
                pLoader.pLogic.initExternalCheckout(dataJson, "paypal");
            } else {
                pLoader.pLogic.createPopup('dpiWarning_preview', {"checkoutType": "express"});
            }


        }
    });
    pixQuery('#p_regularCheckout').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (confirmTOCClick()) {
            pLoader.pLogic.sendInternalEvent('click_on_regular_checkout_in_express_preview_page', '2', {}, false);
            ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'click on regular checkout in express preview page', 'event');

            // pLoader.pLogic.initExternalCheckout(dataJson,"cc");

            pLoader.pLogic.regularCheckout(dataJson);
        }
    })
};

pLoader.pLogic.renderOSSPreview = function (dataJson, slideHTML, dataURL) {
    // Show loader until we're ready
    pLoader.pLogic.showPageLoader();
    pLoader.pLogic.shop.resetShareParams();
    ga_$pex('send', 'event', 'one stop shop', 'initial impression', 'flow');
    pLoader.fireAnalyticsOnVisible(['one stop shop', 'impression', 'visible flow']);
    var analyticsPageURL = 'pixter/oss/';
    try {
        analyticsPageURL += document.location.search;
    } catch (ex) {
    }
    ;
    ga_$pex('send', {'hitType': 'pageview', 'page': analyticsPageURL, 'title': 'Pixter | OSS'});

    var bannersPath = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + 'banners/';

    // Prepare canvas
    var storeCanvas = pixQuery('#p_ShopCanvas');
    var containerHTML = "<div id='oss_canvas'><div id='oss_slide_arrows'><a href='#' id='oss_slide_arrow_left'><img src='{0}'/></a><a href='#' id='oss_slide_arrow_right'><img src='{1}'/></a></div></div>";
    containerHTML = containerHTML.pFormat(pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + 'arrow_left.png', pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + 'arrow_right.png');
    pixQuery("#p_ShopCanvas").html(containerHTML).addClass("os_" + pLoader.pLogic.getOS());
    var ossContainer = pixQuery("#oss_canvas");
    ossContainer.on('productChange', function (e, productObj) {
        // Our first slide
        if (typeof ossContainer.attr('data-product-id') == "undefined") {
            renderSlide(productObj, true)
        } else {
            renderSlide(productObj, false)
        }
    });

    function validateCheckbox() {
        var checkbox = pixQuery('.p_OSS_TOC input')[0];
        if (typeof checkbox == "undefined" || checkbox.checked) {
            var cookieName = pLoader.data.brandingDetails.c_prefix + "ud";
            var userDetailsCookie = pixQuery.cookie(cookieName);
            var userDetails;
            if (userDetailsCookie) {
                userDetails = JSON.parse(userDetailsCookie);
            } else {
                userDetails = {};
            }
            pixQuery.cookie(cookieName, JSON.stringify(userDetails), {expires: 364, path: '/'});
            return true;
        } else {
            return false;
        }
    }

    function checkBoxHandler($slide) {
        // Re-check the checkbox if it was checked before
        var cookieName = pLoader.data.brandingDetails.c_prefix + "ud";
        var userDetailsCookie = pixQuery.cookie(cookieName);
        if (userDetailsCookie && JSON.parse(userDetailsCookie).TOC == "on") {
            $slide.find('.p_OSS_TOC input').each(function (i, el) {
                el.checked = true;
            })
        }
    }

    function showTooltip() {
        var $TOC = pixQuery('.p_OSS_TOC');
        if (!$TOC.hasClass('tooltipstered')) {
            pixQuery('.p_OSS_TOC').tooltipster({
                content: pixQuery('<span>##Please click on the checkbox below<br/> to accept the terms and continue##</span>'.translate()),
                trigger: "custom",
                position: "top-left",
                theme: 'tooltipster-pstore'
            });
        }
        $TOC.tooltipster('show');
        setTimeout(function () {
            $TOC.tooltipster('hide');
        }, 3000)
    }

    // Arrows events
    pixQuery('#oss_slide_arrow_left').on('click', function (e) {
        e.preventDefault();
        slideLeft();

    });
    pixQuery('#oss_slide_arrow_right').on('click', function (e) {
        e.preventDefault();
        slideRight();
    });

    pixQuery(document).on('keydown.p_oss', function (e) {
        if (e.keyCode == 37) {
            slideLeft();
            return false;
        }
        if (e.keyCode == 39) {
            slideRight();
            return false;
        }
    });

    function slideLeft() {
        // Get current Index
        var currentIndex = parseInt(ossContainer.attr('data-product-id'));
        // check if going left from the current index will reset the array
        if (currentIndex - 1 < 0) {
            currentIndex = pLoader.data.brandingDetails.marketingData.ossData.length - 1;
        } else {
            currentIndex--;
        }
        var productToReplaceTo = pLoader.data.brandingDetails.marketingData.ossData[currentIndex];
        ossContainer.trigger('productChange', productToReplaceTo);
    }

    function slideRight() {
        // Get current Index
        var currentIndex = parseInt(ossContainer.attr('data-product-id'));
        // check if going left from the current index will reset the array
        if (currentIndex + 1 > pLoader.data.brandingDetails.marketingData.ossData.length - 1) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        var productToReplaceTo = pLoader.data.brandingDetails.marketingData.ossData[currentIndex];
        ossContainer.trigger('productChange', productToReplaceTo);
    }

    function cropImageForOSS(productObj, dataURL, cb) {
        var productManifest = pixQuery.grep(pLoader.data.products, function (e) {
            return e.pid == productObj.PID
        })[0];
        var cropRatio = productManifest.cropRatio;
        var dataObj = {
            "cropRatio": productManifest.cropRatio,
            "tmbWidth": productObj.tmbWidth * 1.05,
            "tmbHeight": productObj.tmbHeight * 1.05,
            "type": productManifest.type
        };

        function renderResponse(imgData) {
            var htmlTemplate = '<img src="{2}" width="{0}" height="{1}" style="position:relative;left:{3}px;top:{4}px;"/></div></div>';
            var resp = htmlTemplate.pFormat(dataObj.tmbWidth, dataObj.tmbHeight, imgData, (productObj.tmbWidth - dataObj.tmbWidth) / 2, (productObj.tmbHeight - dataObj.tmbHeight) / 2);
            cb(resp);
        }

        if (typeof pLoader.pLogic.shop.imageDataURL[productManifest.type] == "undefined") {
            pLoader.pLogic.generateThumbnailDataURL(dataObj, dataURL, function (img) {
                renderResponse(img);
            })
        } else {
            renderResponse(pLoader.pLogic.shop.imageDataURL[productManifest.type]);
        }
    }

    function ossSucessfulConversion() {
        var productName = pLoader.pLogic.findProductCategory(pLoader.pLogic.shop.selectedItem.pid).shortName;
        ga_$pex('send', 'event', 'one stop shop', 'succesful conversion - ' + productName, 'important action');
    }

    function renderSlide(productObj, first) {
        ossContainer.attr('data-product-id', productObj.index);
        pLoader.pLogic.shop.selectedItem = pixQuery.grep(pLoader.data.products, function (e) {
            return e.pid == productObj.PID
        })[0];
        function storeDPICheck(val) {
            pLoader.pLogic.ossDPICheck = val
        }

        var imgForDPICheck = dataURL;

        if (typeof pLoader.pLogic.shop.imageDataURL[pLoader.pLogic.shop.selectedItem.type] != "undefined") {
            imgForDPICheck = pLoader.pLogic.shop.imageDataURL[pLoader.pLogic.shop.selectedItem.type];
        }

        pLoader.pLogic.calculateDPI(pLoader.pLogic.shop.selectedItem, storeDPICheck, imgForDPICheck);
        // TODO: document. The reason we
        pLoader.pLogic.ossEnabled = productObj;
        ga_$pex('send', 'event', 'one stop shop', 'slide impression', 'important action');

        var type;
        if (typeof productObj.checkoutStyle != "undefined") {
            type = productObj.checkoutStyle;
        } else {
            type = "express"
        }


        var croppedImage = cropImageForOSS(productObj, dataURL, function (tb) {
            if (typeof pLoader.data.brandingDetails.marketingData.ossMessage == "undefined") {
                pLoader.data.brandingDetails.marketingData.ossMessage = ""
            }
            var productCurrency = pLoader.pLogic.currency ;
            var productDiscountPercentage;
            if(!!pLoader.data.brandingDetails.specialOffer && !!pLoader.data.brandingDetails.specialOffer.selfInitiate && !!pLoader.data.brandingDetails.specialOffer.selfInitiate['product_'+productObj.PID]){
                productDiscountPercentage = parseInt(pLoader.data.brandingDetails.specialOffer.selfInitiate['product_'+productObj.PID].couponDiscountPercentage) ;
            }
            var productPrice = productDiscountPercentage? (roundTwoDecimelNumbers(parseFloat(pLoader.data.pricing.products[productObj.PID].price) * (100-productDiscountPercentage)/100)).toString() :  pLoader.data.pricing.products[productObj.PID].price ;
            
            function roundTwoDecimelNumbers(number){
                return Math.floor(number * 100) /100;
            }
            productObj.h2Variables = {
                currency: productCurrency,
                price:productPrice 
            };

            var currentSlideHTML = slideHTML.pFormat(bannersPath + productObj.productImage,
                productObj.tmbWidth, productObj.tmbHeight, productObj.portholeStyle, 
                productObj.h2.translate().replaceKeys(productObj.h2Variables), productObj.p.translate(), productObj.PID, productObj.titleStyle,
                productObj.pStyle, pLoader.data.brandingDetails.brandTOC,
                pLoader.data.brandingDetails.marketingData.ossMessage);
            var $slide = pixQuery(currentSlideHTML);
            $slide.find('.p_OSS_porthole').append(tb);
            $slide.addClass('oss_type_' + productObj.PID);
            if (first) {
                pLoader.pLogic.hidePageLoader(300);
                $slide.appendTo(ossContainer);
                storeCanvas.fadeIn(300, function () {
                    checkBoxHandler($slide);
                });
            } else {
                storeCanvas.fadeOut(300, function () {
                    ossContainer.find('.p_OSS_slide').remove();
                    ossContainer.append($slide);
                    storeCanvas.fadeIn(300, function () {
                        checkBoxHandler($slide);
                    });
                })
            }

            function resetIsInOss() {
                /**
                 * indicate that we are no longer in oss step
                 */
                pLoader.pLogic.shop.isInOss = false;
            }

            // Bind slide specific events
            if (type == "express") {
                $slide.find('.p_OSS_bottom_productSelection').remove();
                $slide.find('.p_OSS_bottom_express').show();
                $slide.find('.p_OSS_edit').on('click', function (e) {
                    e.preventDefault();
                    pLoader.pLogic.shop.stepNum = 3;
                    storeCanvas.fadeOut(500, function () {
                        resetIsInOss();
                        pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, e, null, {type: "ossPreview"});
                    })

                });

                $slide.find('.p_OSS_expressButton').on('click', function (e) {
                    e.preventDefault();
                    if (validateCheckbox()) {

                        ga_$pex('send', 'event', 'one stop shop', 'paypal checkout', 'important action');
                        if (pLoader.pLogic.ossDPICheck) {
                            resetIsInOss();
                            ossSucessfulConversion();
                            pLoader.pLogic.configSupportWindow('Uploading your image...'.translate(), null, '(Please note: Your shipping address will be obtained during checkout)'.translate());
                            pLoader.pLogic.initExternalCheckout(pLoader.pLogic.shop.selectedItem, "paypal");
                        } else {
                            pLoader.pLogic.createPopup('dpiWarning_preview', {"checkoutType": "express"});
                        }
                    } else {
                        showTooltip();
                    }
                });
                $slide.find('.p_OSS_regularButton').on('click', function (e) {
                    e.preventDefault();

                    if (validateCheckbox()) {
                        ga_$pex('send', 'event', 'one stop shop', 'credit card checkout', 'important action');
                        if (typeof pLoader.pLogic.shop.selectedItem.dpiFlag == "undefined" || pLoader.pLogic.shop.selectedItem.dpiFlag == false) {
                            function cb_regular(dpiCheckResult) {
                                if (dpiCheckResult) {
                                    storeCanvas.fadeOut(500, function () {
                                        resetIsInOss();
                                        ossSucessfulConversion();
                                        pLoader.pLogic.regularCheckout(pLoader.pLogic.shop.selectedItem, true);
                                    })
                                } else {
                                    pLoader.pLogic.createPopup('dpiWarning_preview', {"checkoutType": "regular"});
                                }
                            }

                            pLoader.pLogic.calculateDPI(pLoader.pLogic.shop.selectedItem, cb_regular);
                        } else {
                            storeCanvas.fadeOut(500, function () {
                                ossSucessfulConversion();
                                pLoader.pLogic.regularCheckout(pLoader.pLogic.shop.selectedItem, true);
                            })
                        }
                    } else {
                        showTooltip();
                    }
                })
            }
            if (type == "chooseProduct") {
                $slide.find('.p_OSS_bottom_express').remove();
                $slide.find('.p_OSS_bottom_productSelection').show();
                function chooseProductCB() {
                    var data = pLoader.pLogic.findProductCategory(productObj.PID);
                    ossSucessfulConversion();
                    pLoader.pLogic.shop.selectedItemParent = data;
                    resetIsInOss();
                    pLoader.pLogic.shop.stepNum = 1.5;
                    storeCanvas.fadeOut(500, function () {
                        pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
                    })
                }

                $slide.find('.p_OSS_bottom_productSelection_btn').html(productObj.buttonText.translate()).on('click', function (e) {
                    e.preventDefault();
                    if (validateCheckbox()) {
                        ga_$pex('send', 'event', 'one stop shop', 'continue to choose a product', 'important action');
                        chooseProductCB();
                    } else {
                        showTooltip();
                    }
                })

            }
            if (type == "preview") {
                $slide.find('.p_OSS_bottom_express').remove();
                $slide.find('.p_OSS_bottom_productSelection').show();
                function previewCB() {
                    //var data = pLoader.pLogic.findProductCategory(productObj.PID)
                    //pLoader.pLogic.shop.selectedItemParent = data;
                    pLoader.pLogic.shop.stepNum = 2;
                    pLoader.pLogic.origin = 1;
                    resetIsInOss();
                    storeCanvas.fadeOut(500, function () {
                        ossSucessfulConversion();
                        pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
                    })
                }

                $slide.find('.p_OSS_bottom_productSelection_btn').html(productObj.buttonText.translate()).on('click', function (e) {
                    e.preventDefault();
                    if (validateCheckbox()) {
                        ga_$pex('send', 'event', 'one stop shop', 'continue to product preview', 'important action');
                        previewCB();
                    } else {
                        showTooltip();
                    }
                })

            }
            if (type == "skipPreview") {
                function skipPreviewCB(e) {
                    e.preventDefault();
                    if (validateCheckbox()) {
                        ga_$pex('send', 'event', 'one stop shop', 'credit card checkout', 'important action');
                        if (typeof pLoader.pLogic.shop.selectedItem.dpiFlag == "undefined" || pLoader.pLogic.shop.selectedItem.dpiFlag == false) {
                            function cb_regular(dpiCheckResult) {
                                if (dpiCheckResult) {
                                    resetIsInOss();
                                    storeCanvas.fadeOut(500, function () {
                                        ossSucessfulConversion();
                                        pLoader.pLogic.regularCheckout(pLoader.pLogic.shop.selectedItem, true);
                                    })
                                } else {
                                    pLoader.pLogic.createPopup('dpiWarning_preview', {"checkoutType": "regular"});
                                }
                            }

                            pLoader.pLogic.calculateDPI(pLoader.pLogic.shop.selectedItem, cb_regular);
                        } else {
                            storeCanvas.fadeOut(500, function () {
                                ossSucessfulConversion();
                                pLoader.pLogic.regularCheckout(pLoader.pLogic.shop.selectedItem, true);
                            })
                        }
                    } else {
                        showTooltip();
                    }
                }

                $slide.find('.p_OSS_bottom_express').remove();
                $slide.find('.p_OSS_bottom_productSelection').show().addClass('skipPreview');
                $slide.find('.p_OSS_edit').show().on('click', function (e) {
                    e.preventDefault();
                    pLoader.pLogic.shop.stepNum = 3;
                    storeCanvas.fadeOut(500, function () {
                        pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, e, null, {type: "ossPreview"});
                    })

                });
                $slide.find('.p_OSS_bottom_productSelection_btn').html(productObj.buttonText.translate()).on('click', skipPreviewCB);
            }
        });
    }

    // Fire our first slide
    ossContainer.trigger('productChange', pLoader.pLogic.ossEnabled);


};

pLoader.pLogic.checkUserMessageInInternalPages = function () {
    if (typeof pLoader.pLogic.specialOfferEnabled == "undefined") {
        if (typeof pLoader.data.brandingDetails.specialOffer != "undefined") {
            var startDate = new Date(pLoader.data.brandingDetails.specialOffer.startDate).getTime();
            var endDate = new Date(pLoader.data.brandingDetails.specialOffer.endDate).getTime();
            var currentDate = new Date().getTime();
            if (startDate < currentDate && currentDate < endDate) {
                pLoader.pLogic.specialOfferEnabled = true;
            }
        }
    }
    if (pLoader.pLogic.specialOfferEnabled) {
        var productId = pLoader.pLogic.shop.selectedItem.pid;
        if (typeof pLoader.data.brandingDetails.specialOffer['product_' + productId] == "undefined" || pLoader.data.brandingDetails.specialOffer['product_' + productId] == "") {
            if (typeof pLoader.pLogic.shop.selectedItemParent.categoryText != "undefined" && pLoader.pLogic.shop.selectedItemParent.categoryText != "") {
                pLoader.pLogic.enableUserMessaging(pLoader.pLogic.shop.selectedItemParent.categoryText, 200);
            } else {
                pLoader.pLogic.disableUserMessaging();
            }
        } else {
            pLoader.pLogic.enableUserMessaging(pLoader.data.brandingDetails.specialOffer['product_' + productId], 200);
        }
    } else {
        if (pLoader.pLogic.shop.selectedItemParent != null && typeof pLoader.pLogic.shop.selectedItemParent != "undefined" && typeof pLoader.pLogic.shop.selectedItemParent.categoryText != "undefined" && pLoader.pLogic.shop.selectedItemParent.categoryText != "") {
            pLoader.pLogic.enableUserMessaging(pLoader.pLogic.shop.selectedItemParent.categoryText, 200);
        }
    }
};

pLoader.pLogic.shop.previewPrint = function (e, params) {

    if (e) e.preventDefault();
    if (typeof pLoader.pLogic.shop.selectedItem == "undefined" || pLoader.pLogic.shop.selectedItem == null) {
        pLoader.pLogic.shop.selectedItem = params.item;
    }
    var dataJson = pLoader.pLogic.shop.selectedItem;


    var productPrice = pLoader.pLogic.currency + pLoader.data.pricing.products[dataJson.pid].price;
    var productCategory = pLoader.pLogic.findProductCategory(dataJson.pid);


    function renderPreviewPrint(html, dataURL, previewType) {


        // Basic preview setup
        function regularPreview() {
            pLoader.pLogic.checkUserMessageInInternalPages( );
            function renderBulletArray(barray, target) {
                var liFormat = "<li class='pub-brand-store-text'><span>{0}</span></li>";
                pixQuery.each(barray, function (i, el) {
                    pixQuery(target).append(liFormat.pFormat(el.translate()));
                })
            }

            var imgUrl;
            if (typeof dataJson.previewImage == "undefined") {
                imgUrl = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + dataJson.type + "Template.png";
            } else {
                imgUrl = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + dataJson.previewImage;
            }


            var productSOObj = pLoader.pLogic.checkSOForProduct(dataJson.pid);
            //Commented out in order for the price in Branding json not to override the price in pricing jsons.
            /*
             if (productSOObj) {
             productPrice = productSOObj.newPrice;
             }
             */
            var renderingHTML = html.pFormat(dataURL, productPrice, dataJson.marketingName.translate(), imgUrl, dataJson.type);
            pixQuery("#p_ShopCanvas").html(renderingHTML.translate()).delay(200).fadeIn();

            pLoader.pLogic.createShareButton();

            renderBulletArray(dataJson.bulletList, '.previewBulletList');

            pixQuery(".editButtonContainer").on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                pLoader.pLogic.shop.stepNum = 3;
                pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, e);
            });

            if (typeof pLoader.pLogic.shop.insecureImg != "undefined" && pLoader.pLogic.shop.insecureImg) {
                pLoader.pLogic.createPopup('lean_preview', {
                    errorCode: 105,
                    errorText: "We can not obtain the image due to low resolution or security reasons, please upload your own image using the button below.".translate(),
                    popupHeader: "We're Sorry...".translate()
                })
            }

            if (!!pLoader.pLogic.findProductCategory(pLoader.pLogic.shop.selectedItem.pid).isRenderAsOne) {
                //This is for the tshirts, for now.
                var category = pLoader.pLogic.findProductCategory(pLoader.pLogic.shop.selectedItem.pid);

                /**
                 *   Renderer the dropdown on the preview screen
                 *   @param {boolean} rendererHiddedChildren- set to true in order to renderer the hiddenChildren array
                 *   @return undefined
                 */

                function rendererDropDown(rendererHiddedChildren) {
                    var items = category.children;
                    if (rendererHiddedChildren) {
                        items = category.hiddenChildren;
                    }
                    var itemTemplate = '<option value="{0}">{1}</option>';
                    var $select = pixQuery('<select>').addClass('preview-single-select');
                    for (var i = 0; i < items.length; i++) {
                        var curItemId = items[i];
                        var productObj = pixQuery.grep(pLoader.pLogic.productsJson, function (e) {
                            return e.pid == curItemId;
                        })[0];
                        var $item = pixQuery(itemTemplate.pFormat(items[i], productObj.shortName.translate()));
                        if (productObj.pid == pLoader.pLogic.shop.selectedItem.pid) {
                            $item.attr('selected', 'selected');
                        }
                        $select.append($item);
                    }
                    $select.on('change', function () {
                        pLoader.pLogic.switchProduct($select.val());
                    });
                    var descriptionText = "Select size:";
                    //dynamic text before select
                    if (category.dropdownText) {
                        descriptionText = category.dropdownText;
                    }
                    pixQuery('div.callToActionDiv').prepend($select).prepend('<p class="single-select-text">' + descriptionText.translate() + '</p>');
                }

                //Renderer dropDown select with default paraneters (Category.children)
                if (typeof pLoader.pLogic.rotatedOrientation == 'undefined') {
                    pLoader.pLogic.rotatedOrientation = false;
                }
                rendererDropDown(pLoader.pLogic.rotatedOrientation);

            }
            if (typeof dataJson.rotate != "undefined" && dataJson.rotate.length > 1) {
                function rendererEditOrientation() {
                    var rotateObjectTemplate = "<a href='#' title=\"{4}\" class='{2}' style='display:block;height:{0}px;width:{1}px;position:relative;top:{3}'></a>";
                    var currentPID = pLoader.pLogic.shop.selectedItem.pid;
                    var basePixelSize = 10;

                    function rotateProduct(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!pixQuery(e.target).hasClass('currentObj')) {
                            pLoader.pLogic.rotatedOrientation = !pLoader.pLogic.rotatedOrientation;
                            pLoader.pLogic.switchProduct(e.data[0]);
                        }
                    }

                    var rotateToPID;

                    pixQuery(dataJson.rotate).each(function (i, el) {
                        var productObj = pixQuery.grep(pLoader.pLogic.productsJson, function (e) {
                            return e.pid == el
                        })[0];
                        var classList = "rotateObj ";
                        var top = 0;
                        var iconH, iconW, outputHtml, title;
                        if (productObj.pid == currentPID) {
                            classList += "currentObj";
                            title = "";
                        } else {
                            rotateToPID = productObj.pid;
                            if (productObj.cropRatio > 1) {
                                title = "Preview this product in Portrait"
                            } else {
                                title = "Preview this product in Landscape"
                            }
                            title = title.translate();
                        }
                        if (productObj.cropRatio > 1) {
                            // The product is horizontal
                            iconH = basePixelSize.toFixed(0);
                            iconW = (basePixelSize / productObj.cropRatio).toFixed(0);
                        } else {
                            iconW = basePixelSize.toFixed(0);
                            iconH = (basePixelSize * productObj.cropRatio).toFixed(0);
                            top = (basePixelSize - iconH) / 2 + "px";
                        }
                        outputHtml = rotateObjectTemplate.pFormat(iconH, iconW, classList, top, title);
                        pixQuery(outputHtml).appendTo('#previewRotateContainer').one('click', [rotateToPID], rotateProduct);
                    });
                    var rotateIcon = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + "rotateProduct.png";
                    pixQuery('<img src="' + rotateIcon + '" id="rotateIcon"/>').appendTo("#previewRotateContainer").one('click', [rotateToPID], rotateProduct);
                }

                rendererEditOrientation();
            }

            pixQuery(".previewNextButton").on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'click on regular checkout in preview page', 'event');
                pLoader.pLogic.regularCheckout(dataJson);
            });

            ga_$pex('send', 'event', pLoader.pLogic.previewType, pLoader.pLogic.previewType + ' impression', 'flow');
            var analyticsPageURL = 'pixter/' + pLoader.pLogic.previewType.replace(' ', '_').toLowerCase() + '/';
            try {
                analyticsPageURL += document.location.search;
            } catch (ex) {
            }
            ;
            ga_$pex('send', {
                'hitType': 'pageview',
                'page': analyticsPageURL,
                'title': 'Pixter | ' + pLoader.pLogic.previewType
            });
            pLoader.fireAnalyticsOnVisible([pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum) + ' impression', 'visible flow']);

        }

        if (previewType == "regular") {
            pLoader.pLogic.previewType = "regular preview";
            pLoader.pLogic.sendInternalEvent('regular_preview_impression', '2', {}, false);
            regularPreview();

        }
        if (previewType == "express") {
            pLoader.pLogic.previewType = "express preview";
            pLoader.pLogic.sendInternalEvent('express_preview_impression', '2', {}, false);
            regularPreview();
            pLoader.pLogic.renderExpressPreview(dataJson, dataURL);
        }
        if (previewType == "ossPreview") {
            pLoader.pLogic.previewType = "one stop shop";
            pLoader.pLogic.sendInternalEvent('oss_impression', '2', {}, false);
            pLoader.pLogic.renderOSSPreview(dataJson, html, pLoader.pLogic.selectedImage);
        }


    }

    function postAnimationCB() {
        var fileName, previewType;
        var productCategory = pLoader.pLogic.findProductCategory(dataJson.pid);
        if (typeof productCategory.expressCheckout != "undefined" && productCategory.expressCheckout) {
            fileName = "step2express";
            previewType = "express";
        } else {
            fileName = "step2";
            previewType = "regular";
        }
        if (typeof params != "undefined" && typeof params.type != "undefined" && params.type == "ossPreview") {
            pixQuery('#p_Store').addClass('oss_enabled');
            pixQuery('#userMessaging').removeClass('bigUM');
            fileName = "step2oss";
            previewType = "ossPreview";
        }
        pLoader.crossDomainAjax(pLoader.assetsServer + pLoader.data.assetsList.partialBaseURL + fileName + '.html', function (resp) {
            // If we already generated the thumbnail or obtained it from the croptool, don't reinit the process
            if (typeof pLoader.pLogic.shop.imageDataURL[pLoader.pLogic.shop.selectedItem.type] == "undefined") {
                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'thumbnailWasNotReady', 'event');
                pLoader.pLogic.showPageLoader();
                function finalizePreviewTB() {
                    pLoader.pLogic.generateThumbnailDataURL(pLoader.pLogic.shop.selectedItem, pLoader.pLogic.selectedImage, function (dataURL) {
                        var timer = 300;
                        pLoader.pLogic.hidePageLoader(timer);
                        setTimeout(function () {
                            renderPreviewPrint(resp, dataURL, previewType);
                        }, timer * 2)
                    });
                }

                if (previewType != "ossPreview") {
                    finalizePreviewTB();
                } else {
                    if (typeof pLoader.pLogic.selectedImage == "undefined") {
                        pixQuery(pLoader.pLogic).on('imageFetched', finalizePreviewTB);
                    } else {
                        finalizePreviewTB();
                    }
                }
            } else {
                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'thumbnailWasReady', 'event');
                renderPreviewPrint(resp, pLoader.pLogic.shop.imageDataURL[pLoader.pLogic.shop.selectedItem.type], previewType);
            }
        })
    }

    /**
     * **legacy**
     * makes the store slide upward if not exactly 465px
     * commented on 14/4/2016
     */
    postAnimationCB();
    /*if(pixQuery('#p_Store').height() != 465){
     var top;
     var height = 465;
     if(typeof pLoader.overlayMode != "undefined" && pLoader.overlayMode == true){
     top = (parseInt(pixQuery('#p_overlay').css('height')) - 580)/2 + "px";
     }else{
     top =  pLoader.pLogic.originalTop - 235 + "px";
     }
     pixQuery('#p_Store').animate({
     "height":height+"px",
     "top":top
     },500,postAnimationCB)
     }else{
     postAnimationCB();
     }*/
};


pLoader.pLogic.shop.initCropTool = function (params) {
    function calculateTop() {
        if (typeof pLoader.overlayMode != "undefined" && pLoader.overlayMode == true) {
            return (parseInt(pixQuery('#p_overlay').css('height')) - 580) / 2 + "px";
        } else {
            return pLoader.pLogic.originalTop - 235 + "px";
        }
    }

    var currentStorePos = pixQuery('#p_Store').offset();

    //pLoader.pLogic.shop.turnAbsolute();

    var dataJson = pLoader.pLogic.shop.selectedItem;
    var cb = function (d) {
        pLoader.pLogic.immediateStats.cropComplete = true;
        pLoader.pLogic.shop.imageDataURL[dataJson.type] = d;
        delete pLoader.pLogic.shareImageURL;
        pLoader.pLogic.shop.stepNum = 2;
        pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null, false, params);

    };
    var img = new Image();
    img.src = pLoader.pLogic.selectedImage;
    pLoader.pLogic.cropTool.init(img, pixQuery('#cropImageContainer'), dataJson, cb, params);
    pixQuery(pLoader.pLogic.shop.canvas).fadeIn(500);
};

pLoader.pLogic.shop.populateRSP = function () {

    // Sample the screen's DPI
    pixQuery('#p_Store').append("<div id='inchSampleDiv' style='height:1in;width:1in'></div>");
    var ccImage = pixQuery('#rspCalibrateCC img').attr('src', pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + "cc.png");
    var handicap = 5;
    pixQuery('#rspCalibrateSlider').slider({
        range: "min",
        value: 204 - handicap,
        min: 0,
        max: 576,
        slide: function (e, ui) {
            ccImage.css('width', ui.value + handicap);
        },
        stop: function (event, ui) {
            var factor = (ui.value + handicap) / 204;
            itemHeight = (pLoader.pLogic.shop.selectedItem.productH * screenDPI * factor).toFixed(0);
            itemWidth = (pLoader.pLogic.shop.selectedItem.productW * screenDPI * factor).toFixed(0);
            dragHelper.css({
                'height': itemHeight + "px",
                'width': itemWidth + "px"
            });

            dragHelper.css({top: ((rspCanvasHeight - itemHeight) / 2) + "px"})
            if (itemWidth > rspCanvasWidth) {
                dragHelper.css({left: ((rspCanvasWidth - itemWidth) / 2) + "px"})
            }
            calcDrag(true);
        }
    });

    //Handle click on quesiton mark
    pixQuery('#rspHelp').on('click', function (e) {
        e.preventDefault();
        pLoader.pLogic.createPopup('order_error', {
            errorCode: 101,
            errorText: "You may adjust the size of the credit card image to an actual credit card size. That will ensure a more correct sizing of the presented product.".translate(),
            popupHeader: "Preview Calibration".translate()
        })
    });

    //var screenDPI = pixQuery('#p_Store #inchSampleDiv').height();
    var screenDPI = 96;


    // Calculate the absolute pixels needed to display a real size preview of the item]
    var itemHeight = (pLoader.pLogic.shop.selectedItem.productH * screenDPI).toFixed(0);
    var itemWidth = (pLoader.pLogic.shop.selectedItem.productW * screenDPI).toFixed(0);

    // Get the rendering canvas for the RSP and its height/width
    var rspCanvas = pixQuery('#rspContainer');
    var rspCanvasHeight = rspCanvas.height();
    var rspCanvasWidth = rspCanvas.width();

    // Populate the elements
    pixQuery('#rspWindow_previewPlaceholder').html(pLoader.pLogic.shop.selectedItem.marketingName);
    var dragHelper = pixQuery('#rspDragHelper').css({
        'height': itemHeight + "px",
        'width': itemWidth + "px"
    });

    var zoomFactor = 1;
    var isCanvas = false;
    if ((typeof pLoader.pLogic.shop.selectedItemParent != "undefined" && pLoader.pLogic.shop.selectedItemParent != null && pLoader.pLogic.shop.selectedItemParent.type == "canvas") || pLoader.pLogic.shop.selectedItem.type == "flatcard") {
        isCanvas = true;
    }


    // Set the template
    if (typeof pLoader.pLogic.shop.selectedItem.previewParams.template != "undefined" && pLoader.pLogic.shop.selectedItem.previewParams.template != true) {
        // No preview template needed.
        pixQuery('#rspTemplate').remove();
    } else {
        var imgUrl;
        if (typeof pLoader.pLogic.shop.selectedItem.previewImage == "undefined") {
            imgUrl = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + "rspTemplates/" + pLoader.pLogic.shop.selectedItem.type + 'PreviewTemplate.png';
        } else {
            imgUrl = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + pLoader.pLogic.shop.selectedItem.previewImage;
        }
        pixQuery('#rspTemplate').attr('src', imgUrl);
    }


    // Set the image itself
    pixQuery('#rspImage').attr('src', pLoader.pLogic.shop.imageDataURL[pLoader.pLogic.shop.selectedItem.type]);

    if ((typeof pLoader.pLogic.shop.selectedItem.previewParams.offset != "undefined" && pLoader.pLogic.shop.selectedItem.previewParams.offset != "center" && !isCanvas)) {
        if (typeof pLoader.pLogic.shop.selectedItem.previewParams.offset.top != "undefined" && pLoader.pLogic.shop.selectedItem.previewParams.offset.top != 0) {
            dragHelper.css({
                top: pLoader.pLogic.shop.selectedItem.previewParams.offset.top
            })
        }
        if (typeof pLoader.pLogic.shop.selectedItem.previewParams.offset.left != "undefined" && pLoader.pLogic.shop.selectedItem.previewParams.offset.left != 0) {
            dragHelper.css({
                left: pLoader.pLogic.shop.selectedItem.previewParams.offset.left
            })
        }
    } else {
        // Center the element
        var offset = {
            "top": 0,
            "left": 0
        };
        if ((typeof pLoader.pLogic.shop.selectedItem.previewParams.offset != "undefined" && pLoader.pLogic.shop.selectedItem.previewParams.offset != "center")) {
            offset = pLoader.pLogic.shop.selectedItem.previewParams.offset;
        }
        if (itemHeight > rspCanvasHeight) {
            dragHelper.css({top: ((rspCanvasHeight - dragHelper.height()) / 2) + offset.top + "px"})
        }
        if (itemWidth > rspCanvasWidth) {
            dragHelper.css({left: ((rspCanvasWidth - dragHelper.width()) / 2) + offset.left + "px"})
        }
        if (isCanvas) {
            if (parseInt(itemWidth) > parseInt(itemHeight)) {
                zoomFactor = (rspCanvasWidth * 0.7) / parseInt(itemWidth);
            } else {
                zoomFactor = (rspCanvasHeight * 0.7) / parseInt(itemHeight);
            }
            if (pLoader.pLogic.shop.selectedItem.type == "flatcard") {
                zoomFactor = 0.4;
            }
            pixQuery('#rspImage,#rspTemplate').css({
                'transform': 'scale(' + zoomFactor + ')'
            });
            var enlargeNotification = pixQuery('<span id="enlargeNotification">##Calculating Real Size...##</span>'.translate());
            enlargeNotification.appendTo('#rspWindow');
            setTimeout(function () {
                enlargeNotification.fadeOut(500, function () {
                    enlargeNotification.html('Enlarging your image to real product size...'.translate()).fadeIn(500, function () {
                        enlargeNotification.delay(2000).fadeOut(500, function () {
                            pixQuery('#rspImage,#rspTemplate').css({
                                'transform': 'scale(1)'
                            })
                        });
                    })
                });
            }, 2000)
        }
    }

    // Handle dragging

    function calcDrag(simulate) {
        //pLoader.pLogic.shop.turnAbsolute();

        var instance = dragHelper.draggable("instance");

        if (instance != undefined) {
            dragHelper.draggable('destroy');
        }
        var canvasOffest = rspCanvas.offset();
        var top, right, left, bottom;

        if (itemHeight < rspCanvasHeight) {
            top = canvasOffest.top + (rspCanvasHeight - itemHeight) / 2;
            bottom = top;
        } else {
            bottom = canvasOffest.top;
            top = canvasOffest.top + rspCanvasHeight - dragHelper.height();
        }
        if (itemWidth < rspCanvasWidth) {
            right = canvasOffest.left;
            left = canvasOffest.left;
        } else {
            right = canvasOffest.left;
            left = canvasOffest.left + rspCanvasWidth - dragHelper.width();
        }

        dragHelper.draggable({
            containment: [left, top, right, bottom],
            scroll: true,
            refreshPositions: true
        });


        pixQuery('#rspTemplate').on('mousedown', function (e) {
            dragHelper.trigger(e)
        });
        if (simulate) dragHelper.simulate('drag');
    }

    if (itemHeight < rspCanvasHeight && itemWidth < rspCanvasWidth) {
        pixQuery('#p_ShopCanvas').fadeIn(300);
    } else {
        pixQuery('#p_ShopCanvas').fadeIn(300, function () {
            calcDrag(true)
        });
        pixQuery(window).off('scroll');
        pixQuery(window).on('scroll', function () {
            calcDrag(true);
        })
    }

    // ga_$pex('send', 'event',pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum),pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum)+' impression','flow');


    // Bind button events

    pixQuery('#approveRSP').on('click', function (e) {
        e.preventDefault();
        var productData = pixQuery.grep(pLoader.pLogic.productsJson, function (e) {
            return e.pid == pLoader.pLogic.shop.selectedItem.pid
        })[0];
        var productCategory = pLoader.pLogic.findProductCategory(productData.pid);
        if (typeof productCategory.expressCheckout != "undefined" && productCategory.expressCheckout) {
            pLoader.pLogic.initExternalCheckout(productData, "paypal");
        } else {
            pLoader.pLogic.shop.stepNum = 4;
            // Mark the DPI flag on the selected item as true in the original productJson
            pLoader.pLogic.sendDataURL(pLoader.pLogic.shop.imageDataURL[pLoader.pLogic.shop.selectedItem.type], function (imageLocation) {
                pLoader.pLogic.orderDetails.imageUpload = imageLocation;
                pixQuery(pLoader.pLogic).trigger('imageUploadComplete');
            });
            pixQuery.grep(pLoader.pLogic.productsJson, function (e) {
                return e.pid == pLoader.pLogic.shop.selectedItem.pid
            })[0].dpiFlag = true;
            ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'RSP approved', 'important action');
            pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
        }
    });
    pixQuery('#backRSP').on('click', function (e) {
        e.preventDefault();
        pLoader.pLogic.shop.stepNum = 2;
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'RSP declined', 'important action');
        pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
    });

    // File upload

    pixQuery('#fileUploadButton').on('click', function (e) {
        e.preventDefault();
        pixQuery('#fileUploadInput').click();
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'Upload from disk started', 'important action');

    });

    pixQuery('#fileUploadInput').on('change', loadImage)

    function loadImage() {
        var input, file, fr, fileName;
        input = document.getElementById('fileUploadInput');
        file = input.files[0];
        fileName = file.name;
        var fileExtension = "";
        var validFileExt = false;
        if (fileName.lastIndexOf(".") > 0) {
            fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
        }
        if (fileExtension == "jpg" || fileExtension == "jpeg") {
            validFileExt = true;
        }
        if (file.size < 10 * 1000 * 1000 && validFileExt) {
            pixQuery('#p_ShopCanvas').fadeOut(500, function () {
                pLoader.pLogic.showPageLoader();
                fr = new FileReader();
                fr.onload = createImage;
                fr.readAsDataURL(file);
            });
        } else {
            var errorMsg = "";
            if (validFileExt) {
                errorMsg = "We currently only allow uploads of up to 10 megabytes.".translate();
                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'Upload from disk failed - large image', 'important action');
            } else {
                errorMsg = "We currently only support files in the format of JPG".translate();
                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'Upload from disk failed - wrong format', 'important action');
            }
            pLoader.pLogic.createPopup('order_error', {
                errorCode: 101,
                errorText: errorMsg,
                popupHeader: "We're sorry...".translate()
            })
        }

        function createImage() {
            // If the image has been created, bind the back button to restore selectedImage to the original

            var tempImg = new Image();
            tempImg.onload = function () {
                pLoader.pLogic.shop.imageDataURL = {};
                pLoader.pLogic.selectedImage = fr.result;
                pLoader.pLogic.shop.stepNum = 2;
                pLoader.pLogic.selectedImageDimensions = {
                    width: tempImg.width,
                    height: tempImg.height
                };
                pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'Upload from disk successful', 'important action');
            };
            tempImg.src = fr.result;
        }
    }
};
;

pLoader.pLogic.shop.renderPersonalDetails = function () {

    pLoader.pLogic.userDetails = {};

    if (typeof pLoader.pLogic.orderDetails.couponPrices != "undefined") {
        delete pLoader.pLogic.orderDetails.couponPrices;
        //pLoader.pLogic.disableUserMessaging();
        var productId = pLoader.pLogic.shop.selectedItem.pid;
        if (pLoader.pLogic.specialOfferEnabled) {
            if (typeof pLoader.data.brandingDetails.specialOffer['product_' + productId] != "undefined" && pLoader.data.brandingDetails.specialOffer['product_' + productId] != "") {
                pLoader.pLogic.enableUserMessaging(pLoader.data.brandingDetails.specialOffer['product_' + productId], 200);
            }
        } else {
            pLoader.pLogic.disableUserMessaging();
        }
    }


    function insertOldDetails(userDetails) {
        pixQuery('#p_OrderSummaryWrapper input').each(function (i, el) {
            var $el = pixQuery(el);
            var elName = $el.attr('name');
            if ($el.attr('id') == "p_TOC" && userDetails["TOC"] == "on") {
                $el.attr('checked', true);
            } else {
                //TODO : Check if translate is needed here
                if (userDetails[elName] != "N/A".translate())
                    $el.val(userDetails[elName]);
            }
        });
        if (typeof userDetails.locale != "undefined" && userDetails.locale != "")
            markUserLocale(userDetails.locale);
    }

    var cookieName = pLoader.data.brandingDetails.c_prefix + "ud"
    var userDetails = pixQuery.cookie(cookieName);
    if (userDetails) {
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'userDetailsRestored', 'event');
        userDetails = JSON.parse(userDetails);
    }


    pixQuery('#p_OrderSummaryWrapper input').on('blur', function (e) {
        var $input = pixQuery(e.target);
        if ($input.val() == $input.attr('placeholder')) {
            $input.val('');
        }
    });

    function markUserLocale(locale) {
        pixQuery('#p_UserLocale option').each(function (i, el) {
            if (pixQuery(el).attr('value') == locale) {
                pixQuery(this).attr('selected', true);
            }
        })
    }

    pixQuery('#userFullName').on('blur', function (e) {
        if (pixQuery('#inputRecipentName').val() == "")
            pixQuery('#inputRecipentName').val(pixQuery(e.target).val());
    });

    function finalizeUserDetails(e) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof t != "undefined") {
            clearTimeout(t);
        }
        function isEmailAddress(str) {
            var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return pattern.test(str);
        }

        var validForm = true;
        var emailValid = true;
        var TOCchecked = true;
        // collect all data from the input fields and validate
        pLoader.pLogic.userDetails.locale = pixQuery('#p_UserLocale').find(':selected').val();
        pixQuery('#p_OrderSummaryWrapper input').each(function (i, el) {
            var $el = pixQuery(el);
            var optionVal = $el.val();
            var inputName = $el.attr('name');
            if (inputName == "TOC" && !document.getElementById('p_TOC').checked) {
                pixQuery('#TOCLI').addClass('TOCerror');
                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'TOC not checked', 'important action');
                TOCchecked = false;
            }
            if (inputName == "user_email" && !isEmailAddress(optionVal)) {
                /*
                 Remove email validation

                 */
                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'invalid email format', 'important action');
                $el.addClass('invalidFormField');
                emailValid = false;
            }
            if (optionVal == "" && (inputName != "state" && inputName != "address2" && inputName != "TOC")) {
                // Remove validation for all but name field:
                if (inputName == "user_name") {
                    validForm = false;
                    $el.addClass('invalidFormField');
                }
                pLoader.pLogic.userDetails[inputName] = "N/A";
            } else {
                if (inputName == "TOC") {
                    pLoader.pLogic.userDetails[inputName] = "on";
                } else {
                    pLoader.pLogic.userDetails[inputName] = optionVal.translate();
                }

            }
        });
        if (validForm && emailValid && TOCchecked) {
            var cookieName = pLoader.data.brandingDetails.c_prefix + "ud";
            pixQuery.cookie(cookieName, '', {expires: -1});
            pixQuery.cookie(cookieName, JSON.stringify(pLoader.pLogic.userDetails), {expires: 364, path: '/'});
            pLoader.pLogic.shop.stepNum = 5;
            pLoader.pLogic.sendInternalEvent('user_details_sent', '4', pLoader.pLogic.userDetails, false);
            pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
        } else {
            if (!TOCchecked) {
                pixQuery('#TOCLI').tooltipster({
                    content: pixQuery('<span>##Please click on the checkbox below<br/> to accept the terms and continue##</span>'.translate()),
                    trigger: "custom",
                    position: "top-left",
                    theme: 'tooltipster-pstore'
                });
                pixQuery('#TOCLI').tooltipster('show');
            }
            if (validForm && !emailValid) {
                pixQuery('#p_FormErrorContainer').html('Please use a valid email address'.translate());
            }
            if (!validForm) {
                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'missing fields', 'important action');
                pixQuery('#p_FormErrorContainer').html('Please fill in the highlighted fields'.translate());
            }
            pixQuery('#p_FormErrorContainer').stop().animate({
                opacity: 1
            }, 500);
            window.t = setTimeout(function () {
                pixQuery('#p_FormErrorContainer').stop().animate({
                    opacity: 0
                }, 500);
                pixQuery('#TOCLI').removeClass('TOCerror');
                pixQuery('.invalidFormField').each(function (i, el) {
                    pixQuery(el).removeClass('invalidFormField');
                });
                pixQuery('#TOCLI').tooltipster('hide');
            }, 5000)
        }

    }

    function renderDetailsPage() {
        var dataJson = pLoader.pLogic.shop.selectedItem;
        var thumbnail = pLoader.pLogic.generateSmallThumbnail(dataJson, pLoader.pLogic.shop.imageDataURL[dataJson.type], 'dataURL');

        pLoader.pLogic.checkUserMessageInInternalPages();

        var brandTOC;

        if (typeof pLoader.data.brandingDetails.brandTOC != "undefined" && pLoader.data.brandingDetails.brandTOC != "") {
            brandTOC = pLoader.data.brandingDetails.brandTOC;
        } else {
            brandTOC = pLoader.data.brandingDetails.brandSite;
        }

        pixQuery('#TOCLI a').attr('href', brandTOC);

        // Change TOC text is there's a var telling us to do so.


        if (typeof pLoader.data.brandingDetails.TOCText != "undefined") {
            pixQuery('#p_TOCText').html(pLoader.data.brandingDetails.TOCText.translate());
            pixQuery('#TOCLI a').attr('href', brandTOC);
        }


        pixQuery(pLoader.pLogic).on('imageUploadComplete', function () {
            pixQuery(pLoader.pLogic).trigger('readyToSendOrder');
        });

        // Remove TOC on express checkout
        var productCategory = pLoader.pLogic.findProductCategory(pLoader.pLogic.shop.selectedItem.pid);
        if ((typeof productCategory.expressCheckout != "undefined" && productCategory.expressCheckout) || (typeof pLoader.pLogic.ossEnabled != "undefined" && pLoader.pLogic.ossEnabled.checkoutStyle == "express")) {
            pixQuery('#TOCLI').css('visibility', 'hidden');
        }

        pixQuery('#personalDetailsThumbnail').append(thumbnail);
        if (userDetails) {
            insertOldDetails(userDetails);
        } else {
            markUserLocale(pLoader.pLogic.userDetails.locale);
        }
        pixQuery(pLoader.pLogic.shop.canvas).fadeIn();
        pixQuery('.p_Checkout').on('click', finalizeUserDetails);

        // If special offer exists, and it has a coupon string that's not empty, and the current product ID is eligible for discount
        var productId = pLoader.pLogic.shop.selectedItem.pid;

        var startDate = new Date(pLoader.data.brandingDetails.specialOffer.startDate).getTime();
        var endDate = new Date(pLoader.data.brandingDetails.specialOffer.endDate).getTime();
        var currentDate = new Date().getTime();

        // Check special offer validity for this product
        if (typeof pLoader.data.brandingDetails.specialOffer != "undefined" && typeof pLoader.data.brandingDetails.specialOffer.selfInitiate != "undefined" && startDate < currentDate && currentDate < endDate) {
            // Special offer object exists and it requires self initiation
            var couponString;
            // Check if we should apply a special code for this specific productID
            if (typeof pLoader.data.brandingDetails.specialOffer.selfInitiate["product_" + productId] != "undefined") {
                couponString = pLoader.data.brandingDetails.specialOffer.selfInitiate["product_" + productId].couponString;
            } else {
                couponString = pLoader.data.brandingDetails.specialOffer.selfInitiate.couponString;

            }
            pixQuery.ajax({
                url: pLoader.pLogic.baseServerURL + 'campaign/validateCoupon',
                data: {
                    coupon_string: couponString,
                    session_id: pLoader.pLogic.statistics.session_id,
                    user_id: pLoader.pLogic.statistics.user_id,
                    product_id: productId,
                    lang: pLoader.data.language,
                    quantity: 1,
                    metadata: pLoader.appendedAjaxData
                },
                success: function (result) {
                    pLoader.pLogic.automaticCoupon = result;
                    pLoader.pLogic.automaticCoupon.coupon_string = couponString;
                }
            })


        }
    }

    if (userDetails && typeof userDetails.locale != "undefined" && userDetails.locale != "") {
        renderDetailsPage();
    } else {
        /*try {
         pixQuery.get('http://freegeoip.net/json/').done(function (d) {
         pLoader.pLogic.userDetails.locale = d.country_code;
         renderDetailsPage();
         }).error(function(){
         pLoader.pLogic.userDetails.locale = "US";
         renderDetailsPage();
         });
         }
         catch (ex) {
         pLoader.pLogic.userDetails.locale = "US";
         renderDetailsPage();
         }*/
        pLoader.pLogic.userDetails.locale = "US";
        renderDetailsPage();
    }
};

pLoader.pLogic.shop.renderOrderConfirmation = function () {

    function applyCouponOnShipping() {
        var shippingPrice = pLoader.pLogic.orderDetails.shippingMethod.price;
        var shippingPriceDiscount = shippingPrice * pLoader.pLogic.orderDetails.couponData.shipping_discount / 100;
        var newShippingPrice = (Math.round((shippingPrice - shippingPriceDiscount) * 100) / 100).toFixed(2);
        pLoader.pLogic.orderDetails.couponPrices.shipping_price = parseFloat(newShippingPrice);
        pixQuery('#shippingMethodPriceCoupon').html(pLoader.pLogic.currency + newShippingPrice);
        pixQuery('#shippingMethodPrice').addClass('couponValid');
    }

    function applyCouponOnProduct() {
        if (typeof dataJson.full_price == "undefined") {
            var productPrice = dataJson.price;
            var actualProductDiscount = productPrice * pLoader.pLogic.orderDetails.couponData.product_discount / 100;
            var newProductPrice = (Math.round((productPrice - actualProductDiscount) * 100) / 100).toFixed(2);
        } else {
            var productPrice = dataJson.full_price;
            var actualProductDiscount = productPrice * pLoader.pLogic.orderDetails.couponData.product_discount / 100;
            var newProductPrice = (Math.round((productPrice - actualProductDiscount) * 100) / 100).toFixed(2);
        }

        /*
         var newProductPriceDisplay;
         if(newProductPrice == 0){
         newProductPriceDisplay = "Free!"
         }else{
         newProductPriceDisplay = pLoader.pLogic.currency + newProductPrice;
         }
         */
        pLoader.pLogic.orderDetails.couponPrices.price = parseFloat(newProductPrice);
        pixQuery('#confirmationTotalRawPriceCoupon').html(pLoader.pLogic.currency + newProductPrice);
        pixQuery('#singularPriceCoupon').html(pLoader.pLogic.currency + newProductPrice);
        pixQuery('#confirmationTotalRawPrice,#confirmationTitleWrapper').addClass('couponValid');

    }

    function applyCouponOnTotal() {
        var oldProductPrice, newProductPrice, newTotalPrice, newShippingPrice;
        if (typeof dataJson.full_price != "undefined") {
            newProductPrice = dataJson.price;
            oldProductPrice = dataJson.full_price;

        } else {
            if (typeof pLoader.pLogic.orderDetails.couponPrices.price == "undefined" || pLoader.pLogic.orderDetails.couponPrices.price == dataJson.price) {
                newProductPrice = dataJson.price;
            } else {
                newProductPrice = pLoader.pLogic.orderDetails.couponPrices.price;
            }
            oldProductPrice = dataJson.price;
        }


        if (typeof pLoader.pLogic.orderDetails.couponPrices.shipping_price == "undefined" || pLoader.pLogic.orderDetails.couponPrices.shipping_price == pLoader.pLogic.orderDetails.shippingMethod.price) {
            newShippingPrice = pLoader.pLogic.orderDetails.shippingMethod.price;
        } else {
            newShippingPrice = pLoader.pLogic.orderDetails.couponPrices.shipping_price;
        }

        newTotalPrice = (parseFloat(newProductPrice) + parseFloat(newShippingPrice)).toFixed(2);

        var youSavedNumericValue = (parseFloat(oldProductPrice) + parseFloat(pLoader.pLogic.orderDetails.shippingMethod.price) - newTotalPrice).toFixed(2);
        pLoader.pLogic.orderDetails.couponPrices.coupon_string = pLoader.pLogic.orderDetails.couponData.couponString;
        pixQuery('#youSavedPrice').html(pLoader.pLogic.currency + youSavedNumericValue);
        pixQuery('#totalPrice').html(pLoader.pLogic.currency + newTotalPrice);
        pixQuery('#youSavedContainer,#confirmationButtons').addClass('couponValid');
        if (newTotalPrice == 0) {
            pixQuery('#confirmationButtons').addClass('freeCoupon');
        }
    }

    function populateProductPrice() {
        if (typeof pLoader.pLogic.orderDetails.couponPrices != "undefined" && typeof pLoader.pLogic.orderDetails.couponPrices.price != "undefined") {
            applyCouponOnProduct();
        }
        if (typeof dataJson.full_price != "undefined") {
            pixQuery('#singularPrice').html(pLoader.pLogic.currency + dataJson.full_price);
            pixQuery('#confirmationTotalRawPrice').html(pLoader.pLogic.currency + dataJson.full_price);
        } else {
            pixQuery('#singularPrice').html(pLoader.pLogic.currency + dataJson.price);
            pixQuery('#confirmationTotalRawPrice').html(pLoader.pLogic.currency + dataJson.price);
        }
    }

    function populateTotal() {
        if (typeof pLoader.pLogic.orderDetails.couponPrices != "undefined" && typeof pLoader.pLogic.orderDetails.couponPrices.price != "undefined") {
            applyCouponOnTotal();
        } else {
            pixQuery('#totalPrice').html(pLoader.pLogic.currency + (parseFloat(dataJson.price) + parseFloat(pLoader.pLogic.orderDetails.shippingMethod.price)).toFixed(2));
        }
    }

    function populateShippingData(data) {
        var shippingToDisplay = data;
        pixQuery('#shippingMethodName').html(shippingToDisplay.name.translate());
        if (typeof pLoader.pLogic.orderDetails.couponPrices != "undefined" && typeof pLoader.pLogic.orderDetails.couponPrices.shipping_price != "undefined") {
            applyCouponOnShipping();
        } else {
            pixQuery('#shippingMethodPrice').html(pLoader.pLogic.currency + shippingToDisplay.price);
        }
        pixQuery('#shippingMethodPrice').html(pLoader.pLogic.currency + shippingToDisplay.price);
        pixQuery('#shippingMethodText').html(shippingToDisplay.text.translate().replaceKeys(shippingToDisplay.textVariables));
    }

    function populateShippingMethods() {
        var radioTemplate = '<li><input type="radio" name="shippingMethodSelection" value="{0}" {1} index="{2}"><span>{0}</span></li>';
        var shippingMethods = dataJson.shipping[pLoader.pLogic.convertGEOToZone(pLoader.pLogic.userDetails.locale)];
        if (shippingMethods.length > 1) {
            if (pixQuery('#shippingSelection ul li').length > 0) {
                pixQuery('#shippingSelection ul').html('');
            }
            pixQuery.each(shippingMethods, function (i, el) {
                var checked = "";
                if (i == 0) checked = "checked";
                pixQuery(radioTemplate.pFormat(el.name.translate(), checked, i)).appendTo("#shippingSelection ul");
            });
            pixQuery('#shippingSelection input').on('change', function (e) {

                pixQuery('#shippingMethod').fadeOut(200, function () {
                    var index = pixQuery(e.target).attr('index');
                    pLoader.pLogic.orderDetails.shippingMethod = shippingMethods[index];
                    ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'shipping changed to ' + pLoader.pLogic.orderDetails.shippingMethod.name, 'event');
                    populateShippingData(pLoader.pLogic.orderDetails.shippingMethod, index);
                    pixQuery('#shippingMethod').fadeIn(200, function () {
                        var totalSpanElement = pixQuery('#totalPrice');
                        populateTotal(totalSpanElement);
                    });
                });
            });
        }
    }

    function populateQuantityTable() {
        var itemTemplate = '<option value="{0}">{1}</option>';
        var dropDown = pixQuery('#p_quantityTable');
        for (var i = 0; i <= dataJson.quantity.length - 1; i++) {
            var itemToAppend = itemTemplate.pFormat(dataJson.quantity[i].qty, dataJson.quantity[i].text);
            dropDown.append(itemToAppend);
        }
        dropDown.on('change', function () {
            pLoader.pLogic.orderDetails.quantity = dropDown.val();
            fetchPriceForQuantity(pLoader.pLogic.orderDetails.quantity, changeQuantity);
        }).show();
    }

    function fetchPriceForQuantity(quantity, readyCB) {
        // Change dataJSON shipping and pricing based on the response
        /*
         dataJson.shipping = pLoader.data.pricing.products[dataJson.pid].shipping;
         dataJson.price = pLoader.data.pricing.products[dataJson.pid].price;
         pLoader.pLogic.orderDetails.shippingMethod = dataJson.shipping[pLoader.pLogic.convertGEOToZone( pLoader.pLogic.userDetails.locale)][0];
         */
        var endPoint = "http://nodejs-lb-1528612705.us-east-1.elb.amazonaws.com/price";

        var data = {
            "product_id": pLoader.pLogic.orderDetails.productData.pid,
            "quantity": quantity,
            "user_id": pLoader.pLogic.statistics.user_id,
            "session_id": pLoader.pLogic.statistics.session_id,
            "api_key": pLoader.appendedAjaxData.api_key,
            "sub_brand": pLoader.appendedAjaxData.brand,
            "script_version": pLoader.appendedAjaxData.s_version,
            "loader_version": pLoader.appendedAjaxData.l_version,
            "coupon_string": "",
            "country": pLoader.pLogic.userDetails.locale
        };

        //data = pixQuery.extend(data,pLoader.pLogic.orderDetails.userDetails,pLoader.pLogic.statistics);
        if (typeof pLoader.pLogic.automaticCoupon != "undefined") {
            data.coupon_string = pLoader.pLogic.automaticCoupon.coupon_string;
        }

        pixQuery.get(endPoint, data, function (resp) {
            dataJson.shipping = resp.data[0].shipping;
            dataJson.price = resp.data[0].price;
            if (typeof resp.data[0].full_price != "undefined" && resp.data[0].full_price > resp.data[0].price) {
                dataJson.full_price = resp.data[0].full_price;
            }
            pLoader.pLogic.orderDetails.shippingMethod = dataJson.shipping[pLoader.pLogic.convertGEOToZone(pLoader.pLogic.userDetails.locale)][0];

            readyCB();
        })
    }

    function changeQuantity() {
        populateConfirmationPageHeader();
        populateProductPrice();
        populateShippingData(pLoader.pLogic.orderDetails.shippingMethod);
        populateTotal();
        populateShippingMethods();
    }

    function populateConfirmationPageHeader() {
        if (typeof dataJson.quantity != "undefined") {
            pixQuery('#confirmationTitle').html(pLoader.pLogic.orderDetails.quantity + " " + dataJson.marketingName.translate() + 'adsadasdsa');
        } else {
            pixQuery('#confirmationTitle').html(dataJson.marketingName.translate());
        }

    }

    function populateConfirmationPage() {
        bindOrderProcess();
        function readyCB() {
            populateConfirmationPageHeader();
            populateProductPrice();
            populateShippingData(pLoader.pLogic.orderDetails.shippingMethod);
            populateTotal();
            populateShippingMethods();
            pixQuery(pLoader.pLogic.shop.canvas).fadeIn();
        }

        if (typeof dataJson.quantity == "undefined") {
            readyCB();
        } else {
            populateQuantityTable();
            pLoader.pLogic.orderDetails.quantity = dataJson.quantity[0].qty;
            fetchPriceForQuantity(pLoader.pLogic.orderDetails.quantity, readyCB);
        }


    }

    function bindOrderProcess() {
        pixQuery('#confirmationButtonCreditCard,#confirmationButtonPayPal,#noChargeButton').on('click', function (e) {
            e.preventDefault();

            function completeOrder() {
                if (typeof pLoader.eventListener != "undefined" && typeof pLoader.eventListener.onOrderComplete != "undefined") {
                    var completedOrderId;
                    if (typeof pLoader.pLogic.completedOrderId == "undefined") {
                        completedOrderId = pLoader.pLogic.completedOrderId;
                    } else {
                        completedOrderId = "";
                    }
                    pLoader.eventListener.onOrderComplete(completedOrderId);
                }
                pLoader.pLogic.shop.stepNum = 6;
                pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
                pLoader.pLogic.disableUserMessaging();
            }

            var product = pLoader.pLogic.orderDetails.productData;
            var paymentType;
            var buttonId = pixQuery(e.target).attr("id");
            switch (buttonId) {
                case "confirmationButtonPayPal":
                {
                    paymentType = "paypal";
                    ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), "PayPal button clicked", 'important action');
                    break;
                }
                case "confirmationButtonCreditCard":
                {
                    paymentType = "cc";
                    ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), "credit card button clicked", 'important action');
                    break;
                }
                case "noChargeButton":
                {
                    ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), "submit free coupon button clicked", 'important action');
                    paymentType = "free";
                    break;
                }
            }


            var data = {
                price: product.price,
                curr: pLoader.pLogic.currencyName,
                product_id: product.pid,
                lang: pLoader.data.language,
                quantity: 1,
                shipping_method: pLoader.pLogic.orderDetails.shippingMethod.id,
                shipping_price: pLoader.pLogic.orderDetails.shippingMethod.price,
                payment_type: paymentType,
                client_data: JSON.stringify(pLoader.pLogic.immediateStats),
                metadata: pLoader.appendedAjaxData
            };

            data = pixQuery.extend(data, pLoader.pLogic.orderDetails.userDetails, pLoader.pLogic.statistics);
            if (typeof pLoader.pLogic.automaticCoupon != "undefined") {
                data.coupon_string = pLoader.pLogic.automaticCoupon.coupon_string;
            }
            if (pLoader.pLogic.orderDetails.couponPrices) {
                pixQuery.extend(data, pLoader.pLogic.orderDetails.couponPrices)
            }

            // Fix to support server side implementation
            data.country = data.locale;
            delete data.locale;

            function fireOrderRequest() {
                pLoader.pLogic.configSupportWindow('Processing your order...'.translate());
                pixQuery.ajax({
                    url: pLoader.pLogic.baseServerURL + 'order/validate',
                    data: data,
                    success: function (result) {
                        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'order validated by server', 'event');
                        if (data.coupon_string == pLoader.pLogic.immediateStats.shareCouponCode) {
                            pixQuery.cookie('p_sdic', 'true', {expires: 7, path: "/"});
                        }
                        if (result.success) {
                            if (typeof result.order_id != "undefined") {
                                pLoader.pLogic.completedOrderId = result.order_id;
                            }
                            if (result.free) {
                                pLoader.closeSupportWindow();
                                completeOrder();
                            } else {
                                pLoader.pLogic.configSupportWindow('Redirecting you to the payment provider...'.translate(), null, null, result.url);

                                if (typeof pLoader.data.orderCompleteCallbackFired == "undefined") {
                                    pLoader.data.orderCompleteCallbackFired = true;
                                    window.addEventListener("message", receiveMessage, false);
                                }
                                function receiveMessage(event) {
                                    if (event.data == "p_order_complete") {
                                        delete pLoader.data.orderCompleteCallbackFired;
                                        pLoader.closeSupportWindow();
                                        completeOrder();
                                    }
                                    if ((event.data) == "p_order_canceled") {
                                        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'user cancellation in Paypal', 'important action');
                                    }


                                }
                            }
                        } else {
                            if (typeof result.error != "undefined" && typeof result.error.description != "undefined") {
                                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'order invalid ' + result.error.description, 'warning');
                                pLoader.pLogic.createPopup('order_error', {
                                    errorCode: result.error.code,
                                    errorText: result.error.description,
                                    popupHeader: "We're sorry...".translate()
                                })
                            } else {
                                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'order invalid - unknown error', 'warning');
                                pLoader.pLogic.createPopup('order_error', {
                                    errorCode: 999,
                                    errorText: 'Please try again later.'.translate(),
                                    popupHeader: "We're sorry...".translate()
                                })
                            }
                            pLoader.closeSupportWindow();
                        }
                    }
                });
            }

            if (typeof pLoader.pLogic.orderDetails.imageUpload != "undefined" && pLoader.pLogic.orderDetails.imageUpload != "") {
                // Image was uploaded before click
                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'upload ready before validate order', 'event');
                pixQuery.extend(data, {"key": pLoader.pLogic.orderDetails.imageUpload});
                fireOrderRequest();
            } else {
                // Else, open the window and wait for the event indicating the upload is complete
                pLoader.pLogic.configSupportWindow('Uploading your image...'.translate());
                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'upload not ready before validate order', 'event');
                pixQuery(pLoader.pLogic).one('readyToSendOrder', function () {
                    pixQuery.extend(data, {"key": pLoader.pLogic.orderDetails.imageUpload});
                    fireOrderRequest();
                })
            }
        })
    }

    var dataJson = pLoader.pLogic.shop.selectedItem;

    dataJson.shipping = pLoader.data.pricing.products[dataJson.pid].shipping;
    dataJson.price = pLoader.data.pricing.products[dataJson.pid].price;
    if (typeof dataJson.shipping == "undefined") {
        dataJson = pixQuery.grep(pLoader.pLogic.productsJson, function (e) {
            return e.pid == dataJson.children[0]
        })[0];
    }
    pLoader.pLogic.orderDetails.shippingMethod = dataJson.shipping[pLoader.pLogic.convertGEOToZone(pLoader.pLogic.userDetails.locale)][0];
    pLoader.pLogic.orderDetails.productData = dataJson;
    pLoader.pLogic.orderDetails.quantity = 1;
    pLoader.pLogic.orderDetails.userDetails = pLoader.pLogic.userDetails;

    var thumbnail = pLoader.pLogic.generateSmallThumbnail(dataJson, pLoader.pLogic.shop.imageDataURL[dataJson.type], 'dataURL');
    pixQuery('#orderConfirmationThumbnail').append(thumbnail);

    // Remove smaller spans from user messaging
    pixQuery('#userMessaging .smallerSpan').css('display', 'none');

    /* automatically apply special offer */

    if (typeof pLoader.pLogic.automaticCoupon != "undefined") {
        updateCouponFields(null, pLoader.pLogic.automaticCoupon);
    }

    /* special offer end */


    pixQuery('#couponTrigger').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'couponButton clicked', 'event');
        pLoader.pLogic.createPopup("coupon");
    });


    populateConfirmationPage();


    function updateCouponFields(e, couponData) {
        if (couponData.success || typeof couponData.couponString != "undefined") {
            pLoader.pLogic.shop.undoCouponUpdate(false);

            pLoader.pLogic.orderDetails.couponData = couponData;
            pLoader.pLogic.orderDetails.couponPrices = {};
            if (couponData.product_discount > 0) {
                applyCouponOnProduct();
            }
            if (couponData.shipping_discount > 0) {
                applyCouponOnShipping();
            }
            if (couponData.shipping_discount > 0 || couponData.product_discount > 0) {
                applyCouponOnTotal();
            }
        }
    }

    pixQuery(pLoader.pLogic).on('couponValid', updateCouponFields);


};

pLoader.pLogic.shop.undoCouponUpdate = function (disableUM) {
    pLoader.pLogic.orderDetails.couponPrices = null;
    pixQuery('#p_Store .couponValid').removeClass('couponValid');
    if (disableUM) {
        pLoader.pLogic.disableUserMessaging();
    }
    pixQuery('#confirmationTotalRawPriceCoupon').html(null)
    pixQuery('#shippingMethodPriceCoupon').html(null);
    var price = pLoader.pLogic.shop.selectedItem.price;
    pixQuery('#totalPrice').html(pLoader.pLogic.currency + (parseFloat(price) + parseFloat(pLoader.pLogic.orderDetails.shippingMethod.price)).toFixed(2));
    if (pixQuery('#confirmationButtons').hasClass('freeCoupon')) {
        pixQuery('#confirmationButtons').removeClass('freeCoupon');
    }
};

pLoader.pLogic.shop.handleThankYouPage = function () {
    pixQuery(pLoader.pLogic.shop.canvas).fadeIn();
    if (typeof pLoader.pLogic.orderDetails.userDetails == "undefined" || typeof pLoader.pLogic.orderDetails.userDetails.user_name == "undefined") {
        pixQuery('#thankYouWindow h2').html('Thank you for your order!'.translate());
    } else {
        pixQuery('#orderUserName').html(pLoader.pLogic.orderDetails.userDetails.user_name);
    }
    pixQuery('#thankYouClose').on('click', function (e) {
        e.preventDefault();
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'clickOnClose', 'event');
        pLoader.pLogic.orderDetails = {};
        pLoader.pLogic.shop.closeShop(null, null, 'on thank you');
        pLoader.pLogic.shop.resetShop(false);
    });
    pixQuery('#thankYouContinue').on('click', function (e) {
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'clickOnContinueShopping', 'event');
        e.preventDefault();
        pLoader.pLogic.orderDetails = {};
        if (typeof pLoader.pLogic.ossEnabled == "undefined") {
            pLoader.pLogic.shop.stepNum = 1;
            pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
        } else {
            var params = {
                "type": "ossPreview",
                "item": pLoader.pLogic.findProduct(pLoader.pLogic.ossEnabled.PID)
            };
            pLoader.pLogic.shop.stepNum = 2;
            pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, event, false, params);
        }
    });

};


pLoader.pLogic.closePopup = function (cb) {
    if (pixQuery('#p_StorePopup').length > 0) {
        pixQuery('#p_ShopCanvas').animate({'opacity': 1}, 400, function () {
            var popupName = pixQuery('#p_StorePopupWrapper').children()[0].className.replace('popupType_', '');
            ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'close popup -' + popupName, 'event');
            pixQuery('#p_StorePopupWrapper').remove();
            if (typeof cb === 'function') {
                cb();
            }
        });
    } else {
        if (typeof cb === 'function') {
            cb();
        }
    }

};
/**
 * create a popup
 * @param type {string} the type of the popup to open
 * @param addedParams {object} an object that contain all the extra parameters
 */
pLoader.pLogic.createPopup = function (type, addedParams) {
    if (!addedParams) addedParams = {};
    var closeSelf = function (cb) {
        pLoader.pLogic.popup = false;
        if (typeof cb === 'function') {
            pLoader.pLogic.closePopup(cb)
        } else {
            pLoader.pLogic.closePopup();
        }
    };
    var popupHtml = 'popup/';

    function createPopupWrapper(el, ehandlersCB) {
        pixQuery('#p_ShopCanvas').css('opacity', 0.4);
        pixQuery('#p_Store').append('<div id="p_StorePopupWrapper" class="' + type + '"></div>');
        pixQuery('<div id="p_StorePopup"></div>').appendTo('#p_StorePopupWrapper');
        pixQuery('#p_StorePopup').append(el).addClass('popupType_' + type).append('<a href="#" id="closePopup">X</a>');
        pixQuery('#p_StorePopupWrapper').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
        // Center the popup on the store
        var storeH = pixQuery('#p_Store').height();
        var storeW = pixQuery('#p_Store').width();
        var popupH = pixQuery('#p_StorePopup').height();
        var popupW = pixQuery('#p_StorePopup').width();
        pixQuery('#p_StorePopup').css({
            "top": (storeH - popupH) / 3 + "px",
            "left": (storeW - popupW) / 3 + "px"
        }).fadeIn(500);
        pixQuery('#closePopup').on('click', function (e) {
            e.preventDefault();
            closeSelf();
        });
        ehandlersCB();
        var popupName = pixQuery('#p_StorePopupWrapper').children()[0].className.replace('popupType_', '');


        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'open popup - ' + popupName, 'important action');
    }

    function validateCoupon() {
        var couponInput = pixQuery('#p_StorePopup input').val();
        pixQuery.ajax({
            url: pLoader.pLogic.baseServerURL + 'campaign/validateCoupon',
            data: {
                coupon_string: couponInput,
                session_id: pLoader.pLogic.statistics.session_id,
                user_id: pLoader.pLogic.statistics.user_id,
                lang: pLoader.data.language,
                product_id: pLoader.pLogic.orderDetails.productData.pid,
                quantity: parseInt(pixQuery('#confirmationQuantity').val()),
                metadata: pLoader.appendedAjaxData
            },
            success: function (result) {
                if (result.success) {
                    result.couponString = couponInput;


                    ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'coupon success', 'event');
                    if (typeof result.marketing_string != "undefined" && result.marketing_string != "") {
                        pixQuery('#couponMessage').html('Congratulations, the coupon has been verified!'.translate()).css({'color': '#00B22D'});
                        pixQuery('.popupType_coupon .p_Button').unbind('click').on('click', function () {
                            closeSelf(function () {
                                pLoader.pLogic.enableUserMessaging(result.marketing_string, 600);
                                pixQuery(pLoader.pLogic).trigger('couponValid', result);
                            })
                        });
                    }
                    setTimeout(function () {
                        if (pixQuery('.popupType_coupon').length > 0) {
                            pLoader.pLogic.enableUserMessaging(result.marketing_string, 600);
                            pixQuery(pLoader.pLogic).trigger('couponValid', result);
                            closeSelf();
                        }
                    }, 3000)

                } else {
                    ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'coupon failure -' + result.error.description, 'warning');
                    pixQuery('#couponMessage').html(result.error.description.translate());
                    setTimeout(function () {

                    })

                }

            }
        });
    }

    var htmlTemplate = "";
    var eventHandlers;
    var isAsyncPopup = false;

    switch (type) {
        case "exit_survey":
        {
            htmlTemplate = ("<h2>##Help us improve our service##</h2><h3>##Can you share with us why you didn't complete your order?##</h3>" +
            "<div style='text-align:left;'>" +
            "<div class='survey_input_container'><input type='radio' index='1' name='surveyAnswer' ><span class='survey_answer_text'>##I liked the idea but it was not the right time for me##</span></div>" +
            "<div class='survey_input_container'><input type='radio' index='2' name='surveyAnswer' ><span class='survey_answer_text'>##I did not like shopping this way##</span></div>" +
            "<div class='survey_input_container'><input type='radio' index='3' name='surveyAnswer' ><span class='survey_answer_text'>##Couldn't find the products I like##</span></div>" +
            "<div class='survey_input_container'><input type='radio' index='4' name='surveyAnswer' ><span class='survey_answer_text'>##I could not figure out what are you offering me##</span></div>" +
            "<div class='survey_input_container'><input type='radio' index='5' name='surveyAnswer' ><span class='survey_answer_text'>##I was unable to complete the order##</span></div>" +
            "<textarea id='surveyComment' type='text' placeholder='##Any other comments are welcome...##'/></textarea>" +
            "</div>" +
            "<a href='#' class='p_ButtonHollow' id='closeSurvey'>##No Thanks##</a>" +
            "<a href='#' class='p_Button pub-brand-buttons' id='surveySuccess'>##Submit & Close##</a>");
            eventHandlers = function () {
                pLoader.pLogic.surveyAnswer = {};
                pixQuery('#surveySuccess').on('click', function (e) {
                    if (pixQuery('#p_StorePopup textarea').val() != "") {
                        pLoader.pLogic.surveyAnswer.comment = pixQuery('#p_StorePopup textarea').val();
                    }
                    addedParams.userAnswered(pLoader.pLogic.surveyAnswer);
                    addedParams.closeStoreCB();
                });
                pixQuery('.survey_input_container input').on('change', function (e) {
                    e.preventDefault();
                    var thisButton = pixQuery(this);
                    pLoader.pLogic.surveyAnswer.selectedAnswer = thisButton.val();
                    setTimeout(function () {
                        thisButton[0].checked = true;
                    }, 50)
                });
                pixQuery('#closeSurvey,#closePopup').on('click', function (e) {
                    e.preventDefault();
                    addedParams.closeStoreCB();
                });
            };
            break;
        }
        case "lean_preview":
        {
            htmlTemplate = "<h2>" + addedParams.popupHeader + "</h2><p>" + addedParams.errorText + "</p><a href='#' id='orderErrorBack' class='p_Button pub-brand-buttons'>##Upload an image##</a>";
            eventHandlers = function () {
                pixQuery('#orderErrorBack').on('click', function (e) {
                    e.preventDefault();
                    pixQuery('#fileUploadInput').click();
                    ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'Upload from disk started', 'important action');

                });


                function loadImage() {
                    var input, file, fr, fileName;
                    input = document.getElementById('fileUploadInput');
                    file = input.files[0];
                    fileName = file.name;
                    var fileExtension = "";
                    var validFileExt = false;
                    if (fileName.lastIndexOf(".") > 0) {
                        fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
                    }
                    if (fileExtension == "jpg" || fileExtension == "jpeg") {
                        validFileExt = true;
                    }
                    if (file.size < 10 * 1000 * 1000 && validFileExt) {
                        pixQuery('#p_ShopCanvas').fadeOut(500, function () {
                            pLoader.pLogic.showPageLoader();
                            fr = new FileReader();
                            fr.onload = createImage;
                            fr.readAsDataURL(file);
                        });
                    } else {
                        var errorMsg = "";
                        if (validFileExt) {
                            errorMsg = "We currently only allow uploads of up to 10 megabytes.";
                            ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'Upload from disk failed - large image', 'important action');
                        } else {
                            errorMsg = "We currently only support files in the format of JPG";
                            ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'Upload from disk failed - wrong format', 'important action');
                        }
                        pLoader.pLogic.createPopup('order_error', {
                            errorCode: 101,
                            errorText: errorMsg.translate(),
                            popupHeader: "We're sorry...".translate()
                        })
                    }

                    function createImage() {
                        // If the image has been created, bind the back button to restore selectedImage to the original

                        var tempImg = new Image();
                        tempImg.onload = function () {
                            pLoader.pLogic.shop.imageDataURL = {};
                            pLoader.pLogic.selectedImage = fr.result;
                            pLoader.pLogic.shop.stepNum = 2;
                            pLoader.pLogic.selectedImageDimensions = {
                                width: tempImg.width,
                                height: tempImg.height
                            };
                            pLoader.pLogic.shop.insecureImg = false;
                            closeSelf(function () {
                                pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
                                ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'Upload from disk successful after preview error', 'important action');
                            })

                        };
                        tempImg.src = fr.result;
                    }
                }

                pixQuery('#fileUploadInput').on('change', loadImage);
            };

            break;
        }
        case "coupon":
        {
            htmlTemplate = ("<h2>##Have a coupon?##</h2>" +
            "<h3 class='pub-brand-store-text'>##Paste in your coupon code##</h3>" +
            "<input type='text'/><br/><p id='couponMessage' class='pub-brand-store-text'></p>" +
            "<a href='#' class='p_ButtonHollow'>##Cancel##</a>" +
            "<a href='#' class='p_Button pub-brand-buttons'>##Submit##</a>");
            eventHandlers = function () {
                pixQuery('.popupType_coupon a.p_Button').on('click', validateCoupon);
                pixQuery('.popupType_coupon a.p_ButtonHollow').on('click', function () {
                    closeSelf(function () {
                    })
                });
            };

            break;
        }
        case "disableShop":
        {
            htmlTemplate = ("<p>##Are you sure you want to disable the store?##</p>" +
            "<span style='color:#00944b'>##Disable for:##</span>" +
            "<ul id='p_DisableTimeList'><li><a data-cookietime='1' href='#'>24 Hours</a></li><li><a data-cookietime='3' href='#'>72 hours</a></li><li><a data-cookietime='7' href='#'>Week</a></li><li><a data-cookietime='364' href='#'>##Forever##</a></li></ul>");
            eventHandlers = function () {
                pixQuery('#p_DisableTimeList li a').on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var timeToExpire = parseInt(pixQuery(e.target).attr('data-cookietime'));
                    ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'disableStore for ' + timeToExpire, 'event');
                    var cookieName = pLoader.data.brandingDetails.c_prefix + "hs_s8" + pLoader.data.brandingDetails.sub_brand;
                    pixQuery.cookie(cookieName, 'true', {expires: timeToExpire, path: "/"});
                    pixQuery('.p_Button,#p_Store,.p_IntroButtonContainer').fadeOut(500, function () {
                        pixQuery(this).remove()
                    });
                    delete pLoader;
                });
            };

            break;
        }
        case "dpiWarning_crop":
        {
            htmlTemplate = ("<h2>##Please note:##</h2>" +
            "<p>##Your image is in low resolution.##<br/>##Your photo product might not be sharp enough.##</p>" +
            "<ul><li><a id='reenterCrop' class='p_ButtonHollow' href='#'>##Pick Another##</a></li><li><a class='p_Button' id='cropAnyway' href='#'>##Continue##</a></li></ul>");
            eventHandlers = function () {
                pixQuery('#reenterCrop').on('click', function (e) {
                    e.preventDefault();
                    closeSelf(function () {
                        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'return to crop after DPI warning', 'event');
                        pLoader.pLogic.shop.stepNum = 1;

                        pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
                    });
                });
                pixQuery('#cropAnyway').on('click', function (e) {
                    e.preventDefault();
                    ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'continue cropping after DPI warning', 'event');
                    pLoader.pLogic.cropTool.startCrop(addedParams[0], addedParams[1], addedParams[2], addedParams[3]);
                    pLoader.pLogic.immediateStats.dpiWarning = true;
                    closeSelf();
                })
            };

            break;
        }
        case "dpiWarning_preview":
        {
            htmlTemplate = ("<h2>##Please note:##</h2>" +
            "<p id='lowResImageP'>##The selected image is not at very high resolution and thus the sharpness of the created photo product might not be the highest.##</p>" +
            "<ul id='lowResImageUL'><li><a id='preview_learnMore' class='p_ButtonHollow' href='#'>##Learn More##</a></li><li><a class='p_Button pub-brand-buttons' id='continuePastPreview' href='#'>##Continue##</a></li></ul>" +
            "<div style='display:none' id='learnMoreContainer'>##Low resolution is a common case and we print many such products to the great satisfaction of our customers.##<br><br>##A printed low resolution image may look less sharp than a high resolution one.##<br/><br/>##The real size preview will help you get a better sense of how the printed product would look in real size.##<br/><br/>##From the real size preview screen you will also be able to select a different image by uploading it from your computer.##<br/><br/>" +
            "<a class='preview_learnMore_RSP' href='#'>##View the product in real size##</a></div>");
            eventHandlers = function () {
                pixQuery('.preview_learnMore_RSP').on('click', function (e) {
                    e.preventDefault();
                    ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'preview DPI warning - click on RSP', 'event');
                    closeSelf(function () {
                        pLoader.pLogic.shop.stepNum = 3.5;
                        pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
                    })
                });

                pixQuery('#preview_learnMore').one('click', function (e) {
                    var animTimer = 500;
                    e.preventDefault();
                    pixQuery('.popupType_dpiWarning_preview').animate({
                        'height': '340px',
                        'top': '45px'
                    }, animTimer);
                    pixQuery('#lowResImageP').animate({
                        'opacity': 0
                    }, animTimer);
                    pixQuery('#lowResImageUL').animate({
                        'top': '-75px'
                    }, animTimer, function () {
                        pixQuery('#learnMoreContainer').fadeIn(animTimer);
                    });
                    ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'preview DPI warning - learn more', 'event');
                });
                pixQuery('#continuePastPreview').on('click', function (e) {
                    e.preventDefault();
                    var productData = pixQuery.grep(pLoader.pLogic.productsJson, function (e) {
                        return e.pid == pLoader.pLogic.shop.selectedItem.pid
                    })[0];
                    var productCategory = pLoader.pLogic.findProductCategory(productData.pid);
                    productData.dpiFlag = true;

                    if (typeof addedParams != "undefined" && typeof addedParams.checkoutType != "undefined" && addedParams.checkoutType == "express") {
                        closeSelf(function () {
                            pLoader.pLogic.initExternalCheckout(productData, "paypal");
                        })
                    } else {
                        closeSelf(function () {
                            ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'preview DPI warning - continue', 'event');
                            pLoader.pLogic.shop.stepNum = 4;

                            pLoader.pLogic.sendDataURL(pLoader.pLogic.shop.imageDataURL[pLoader.pLogic.shop.selectedItem.type], function (imageLocation) {
                                pLoader.pLogic.orderDetails.imageUpload = imageLocation;
                                pixQuery(pLoader.pLogic).trigger('imageUploadComplete');
                            });
                            pLoader.pLogic.immediateStats.dpiWarning = true;
                            pixQuery(pLoader.pLogic.shop.canvas).fadeOut(500, function () {
                                pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
                            })


                        });
                    }
                })
            };

            break;
        }
        case "order_error":
        {
            htmlTemplate = "<h2>" + addedParams.popupHeader + "</h2>" +
                "<p>" + addedParams.errorText + "</p><a href='#' id='orderErrorBack' class='p_Button pub-brand-buttons'>##OK##</a>";
            eventHandlers = function () {
                pixQuery('#orderErrorBack').on('click', function () {
                    closeSelf(function () {

                    })
                })
            };
            break;

        }
        case "share_successful":
        {
            htmlTemplate = "<h2>" + addedParams.popupHeader + "</h2><p>" + addedParams.desc + "" +
                "</p><a href='#' id='orderErrorBack' class='p_Button pub-brand-buttons'>##Continue Shopping##</a>";
            eventHandlers = function () {
                pixQuery('#orderErrorBack').on('click', function () {
                    closeSelf(function () {
                        if (typeof addedParams.cb == "function") {
                            addedParams.cb();
                        }
                    })
                })
            };
            break;
        }
        case "what_is_pixter":
        {
            isAsyncPopup = true;
            eventHandlers = function () {
                var languageSelect = pixQuery('#languageSelect');
                /**
                 * Toggle the Language select if there is a flag for it in the branding file
                 * flag name - multiLangSelectEnabled
                 */
                if (pLoader.data.brandingDetails.multiLangSelectEnabled) {
                    languageSelect.addClass('multi-lang-enabled');

                    pixQuery('#languageSelect option[value="' + pLoader.data.language + '"]').attr("selected", true);

                    languageSelect.on('change', function () {
                        /**
                         * change language will load the store with the selected language
                         * @param selectedLanguage {string} language_regtion for example "en_US"
                         */
                        var selectedLanguage = pixQuery(this).val();
                        if (pLoader.data.language !== selectedLanguage) {
                            pLoader.setTranslateTable(selectedLanguage, true,
                                function () {
                                    closeSelf(
                                        function () {
                                            setTimeout(function () {
                                                pixQuery.cookie('p_lang', pLoader.data.language, {expires: 30});
                                                /**
                                                 * translate the close button
                                                 */
                                                if (!!pixQuery('#closep_Store').data('text-to-translate')) {
                                                    pixQuery('#closep_Store').html(pixQuery('#closep_Store').data('text-to-translate').translate());
                                                }

                                                createPopupWrapper(htmlTemplate.translate(), eventHandlers);
                                                /**
                                                 * ReInitiate the store
                                                 */
                                                if (pLoader.pLogic.shop.isInOss) {
                                                    pLoader.pLogic.initOSS();
                                                } else {
                                                    pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
                                                }
                                            }, 200);
                                        });
                                });
                        }
                    });
                } else {
                    if (languageSelect.hasClass('multi-lang-enabled')) {
                        languageSelect.removeClass('multi-lang-enabled');
                    }
                }

                /**
                 * Handle the creation of the options for the currency select
                 */

                if(!!pLoader.data.brandingDetails.currencies){ // check if the currencies array is set in the branding json
                    var currencySelect = pixQuery('#currencySelect');
                    var currencies = pLoader.data.brandingDetails.currencies ;

                    (function createCurrenciesOptions(){

                        currencies.forEach(function(currency,index){
                            var currencySelectOptionTemplate = '<option id="currencyOption_{0}" class="currency-select-option-template" value="{1}">{2}</option>';
                            currencySelectOptionTemplate = currencySelectOptionTemplate.pFormat(index,currency.code,currency.displayText);
                            currencySelect.append(currencySelectOptionTemplate);
                        });
                    })();

                    /**
                     * Toggle the Currency select if there is a flag for it in the branding file
                     * flag name - multiCurrencySelectEnabled
                     */
                    if (pLoader.data.brandingDetails.multiCurrencySelectEnabled) {


                        currencySelect.addClass('multi-currency-enabled');

                        pixQuery('#currencySelect option[value="' + pLoader.data.currencyName + '"]').attr("selected", true);

                        currencySelect.on('change', function () {
                            /**
                             * change currency will load the store with the selected currency
                             * @param selectedCurrency {string} currency code for example "USD"
                             */
                            var selectedCurrency = pixQuery(this).val();
                            if (pLoader.data.currencyName !== selectedCurrency) {
                                pLoader.setPricingPerCurrency(selectedCurrency, true,
                                    function () {
                                        pixQuery.cookie('p_currency', pLoader.data.currencyName, {expires: 30});
                                        /**
                                         * ReInitiate the store
                                         */
                                        if (pLoader.pLogic.shop.isInOss) {
                                            pLoader.pLogic.initOSS();
                                        } else {
                                            pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, null);
                                        }
                                    });
                            }
                        });
                    } else {
                        if (currencySelect.hasClass('multi-currency-enabled')) {
                            currencySelect.removeClass('multi-currency-enabled');
                        }
                    }

                }



                pixQuery('#WhatIsPixterBackBtn').on('click', function () {
                    closeSelf(
                        function () {
                            if (typeof addedParams.cb == "function") {
                                addedParams.cb();
                            }
                        });
                });
                /**
                 * Fixed the click event for the footer links
                 */
                pixQuery('.copyright a').on('click', function () {
                    var link = pixQuery(this).attr('href');
                    var target = pixQuery(this).attr('target');
                    if (target === '_blank') {
                        window.open(link);
                    } else {
                        window.location.href = link;
                    }
                })
            };
            pLoader.crossDomainAjax(pLoader.assetsServer + pLoader.data.assetsList.partialBaseURL + popupHtml + 'whatIsPixter.html', function (html) {
                htmlTemplate = html;
                createPopupWrapper(htmlTemplate.translate(), eventHandlers);
            });

            break;
        }

    }

    if (!isAsyncPopup) {
        createPopupWrapper(htmlTemplate.translate(), eventHandlers);
    }
};


pLoader.pLogic.cropTool = {};
pLoader.pLogic.cropTool.rotateDegree = 0;


pLoader.pLogic.cropTool.startCrop = function (e, originImage, cropContainer, cb) {
    var imageToExport = new Image();
    imageToExport.onload = function () {

        var canvas = document.getElementById('cropCanvas');
        var context = canvas.getContext('2d');
        var imageH = imageToExport.height;
        var imageW = imageToExport.width;
        var TO_RADIANS = Math.PI / 180;

        var rotateAngle = pLoader.pLogic.cropTool.rotateAngle;
        var rotateX, rotateY;

        switch (rotateAngle) {
            case 0:
            {
                rotateX = rotateY = 0;
                canvas.height = imageH;
                canvas.width = imageW;
                break;
            }
            case 90:
            {
                rotateX = 0;
                rotateY = -(imageH);
                canvas.height = imageW;
                canvas.width = imageH;
                break;
            }
            case 180:
            {
                rotateX = -(imageW);
                rotateY = -(imageH);
                canvas.height = imageH;
                canvas.width = imageW;
                break;
            }
            case 270:
            {
                rotateX = -(imageW);
                rotateY = 0;
                canvas.height = imageW;
                canvas.width = imageH;
                break;
            }
        }


        context.save();
        context.rotate(rotateAngle * TO_RADIANS);
        context.drawImage(imageToExport, rotateX, rotateY);
        context.restore();

        var croppedCanvasExport = new Image();


        croppedCanvasExport.onload = function () {
            // Cleanup the old canvas and residue
            try {
                canvas.remove();
            } catch (ex) {
            }

            // Create a new Canvas
            var croppedTempCanvas = document.createElement('canvas');
            croppedTempCanvas.setAttribute('id', 'croppedTempCanvas');
            croppedTempCanvas.style.display = "none";
            document.getElementsByTagName('body')[0].appendChild(croppedTempCanvas);

            // size up the canvas to our cropped image to be
            var croppedImg = pixQuery('#cropBackgroundImage');
            var cropRect = pixQuery('#cropRect');
            var zoom = pLoader.pLogic.cropTool.zoomLevel;

            var cropX = (((cropRect.offset().left).toFixed(2) - (croppedImg.offset().left).toFixed(2)) / zoom) * (imageW / croppedImg.width());
            var cropY = (((cropRect.offset().top).toFixed(2) - (croppedImg.offset().top).toFixed(2)) / zoom) * (imageH / croppedImg.height());

            var finalW = cropRect.width() * (imageW / croppedImg.width());
            var finalH = cropRect.height() * (imageH / croppedImg.height());


            pixQuery(croppedTempCanvas).attr({
                'height': finalH / zoom,
                'width': finalW / zoom
            });

            var context = croppedTempCanvas.getContext('2d');
            //IE 11/EDGE Bug dictates that the original image be 1 pixel smaller :(
            context.drawImage(croppedCanvasExport, cropX, cropY, (finalW / zoom) - 1, (finalH / zoom) - 1, 0, 0, finalW / zoom, finalH / zoom);

            cb(croppedTempCanvas.toDataURL('image/jpeg', 0.99));

            try {
                croppedTempCanvas.remove();
            } catch (ex) {
            }

        };
        var croppedSRC = canvas.toDataURL('image/jpeg', 1);
        //if(pLoader.onDemandURL) croppedCanvasExport.setAttribute('crossOrigin','anonymous');
        croppedCanvasExport.src = croppedSRC;
    };

    if (typeof pLoader.pLogic.shop.corsURL == "undefined" || pLoader.pLogic.shop.corsURL == null) {
        if (!pLoader.isDataURL(pLoader.pLogic.selectedImage))  imageToExport.setAttribute('crossOrigin', 'anonymous');
        imageToExport.src = pLoader.pLogic.selectedImage;
    } else {
        imageToExport.setAttribute('crossOrigin', 'anonymous');
        imageToExport.src = pLoader.pLogic.shop.corsURL;
    }
};
pLoader.pLogic.cropTool.bindDrag = function (bgImage, cropRect, centerDiff, e) {
    var $bgImage = pixQuery(bgImage);
    var $dragHelper = pixQuery('#dragHelper');
    var instance = $dragHelper.draggable("instance");

    if (instance != undefined) {
        var oldContainment = pLoader.pLogic.cropTool.containment;
        $dragHelper.draggable('destroy');
        cropRect.unbind('mousedown');
    }

    var cropOffset = cropRect.offset();
    var cropHeight = pLoader.pLogic.cropTool.cropStats.cropHeight;
    var cropWidth = pLoader.pLogic.cropTool.cropStats.cropWidth;

    var imageHeight = $bgImage.height();
    var imageWidth = $bgImage.width();

    //console.log([cropHeight,cropWidth,imageHeight,imageWidth]);

    // Handle rotated images
    if (pLoader.pLogic.cropTool.rotateAngle == 90 || pLoader.pLogic.cropTool.rotateAngle == 270) {
        e = true;
        var right = cropOffset.left;
        var bottom = cropOffset.top;
        var left = cropOffset.left + cropWidth - imageHeight;
        var top = cropOffset.top + cropHeight - imageWidth;

        if (pLoader.pLogic.cropTool.cropType == "hCrop") {
            left = left - centerDiff.y - centerDiff.x;
            right = right - centerDiff.y - centerDiff.x;
        } else {
            top = top - centerDiff.x - centerDiff.y;
            bottom = bottom - centerDiff.x - centerDiff.y;
        }

        // Compensate for cropType change
        if (pLoader.pLogic.cropTool.oldCropType != pLoader.pLogic.cropTool.cropType && pLoader.pLogic.cropTool.zoomLevel == 1) {
            if (pLoader.pLogic.cropTool.cropType == "hCrop") {
                pLoader.pLogic.cropTool.rotationDiff = (oldContainment[3] - oldContainment[1]) / 2;
                left += pLoader.pLogic.cropTool.rotationDiff;
                right += pLoader.pLogic.cropTool.rotationDiff;
                top -= pLoader.pLogic.cropTool.rotationDiff;
                bottom -= pLoader.pLogic.cropTool.rotationDiff;
            } else {
                pLoader.pLogic.cropTool.rotationDiff = (oldContainment[2] - oldContainment[0]) / 2;
                left -= pLoader.pLogic.cropTool.rotationDiff;
                right -= pLoader.pLogic.cropTool.rotationDiff;
                top += pLoader.pLogic.cropTool.rotationDiff;
                bottom += pLoader.pLogic.cropTool.rotationDiff;
            }

        }
    } else {
        var right = cropOffset.left;
        var bottom = cropOffset.top;
        var left = cropOffset.left + cropWidth - imageWidth;
        var top = cropOffset.top + cropHeight - imageHeight;
    }

    // Handle zoomed images
    if (pLoader.pLogic.cropTool.zoomLevel != 1) {
        var leftDiff = (imageWidth - imageWidth * pLoader.pLogic.cropTool.zoomLevel) / 2;
        var topDiff = (imageHeight - imageHeight * pLoader.pLogic.cropTool.zoomLevel) / 2;

        if (pLoader.pLogic.cropTool.rotateAngle == 0 || pLoader.pLogic.cropTool.rotateAngle == 180) {
            left += leftDiff;
            right -= leftDiff;
            top += topDiff;
            bottom -= topDiff;
        } else {
            left += topDiff;
            right -= topDiff;
            top += leftDiff;
            bottom -= leftDiff;

            // Compensate for cropType change
            if (pLoader.pLogic.cropTool.oldCropType != pLoader.pLogic.cropTool.cropType) {
                if (pLoader.pLogic.cropTool.cropType == "hCrop") {
                    left += pLoader.pLogic.cropTool.rotationDiff;
                    right += pLoader.pLogic.cropTool.rotationDiff;
                    top -= pLoader.pLogic.cropTool.rotationDiff;
                    bottom -= pLoader.pLogic.cropTool.rotationDiff;
                } else {
                    left -= pLoader.pLogic.cropTool.rotationDiff;
                    right -= pLoader.pLogic.cropTool.rotationDiff;
                    top += pLoader.pLogic.cropTool.rotationDiff;
                    bottom += pLoader.pLogic.cropTool.rotationDiff;
                }
            }

        }

    }

    if (pLoader.pLogic.cropTool.zoomLevel == 1 && pLoader.pLogic.cropTool.rotateAngle == 0) {
        pLoader.pLogic.cropTool.containment = [left, top, right, bottom];
    }

    $dragHelper.draggable({
        containment: [left, top, right, bottom],
        scroll: false
    });


    $dragHelper.simulate('drag');


    cropRect.on('mousedown', function (e) {
        pixQuery('#dragHelper').trigger(e)
    });
};
pLoader.pLogic.cropTool.placeImageOnContainer = function (originImage, cropContainer, cropRatio) {
    var displayedImage = document.getElementById('cropBackgroundImage');
    var imageHeight, imageWidth, cropHeight, cropWidth;

    function processImage() {
        if (pLoader.pLogic.cropTool.rotateAngle == 0 || pLoader.pLogic.cropTool.rotateAngle == 180) {
            imageHeight = originImage.height;
            imageWidth = originImage.width;
        } else {
            imageHeight = originImage.width;
            imageWidth = originImage.height;
        }
        var placedImageX, placedImageY;

        cropHeight = pLoader.pLogic.cropTool.cropStats.cropHeight;
        cropWidth = pLoader.pLogic.cropTool.cropStats.cropWidth;


        if (typeof pLoader.pLogic.cropTool.cropType != "undefined" && (typeof pLoader.pLogic.cropTool.oldRotateAngle == "undefined" || pLoader.pLogic.cropTool.oldRotateAngle != pLoader.pLogic.cropTool.rotateAngle)) {
            pLoader.pLogic.cropTool.oldCropType = pLoader.pLogic.cropTool.cropType;
            pLoader.pLogic.cropTool.oldRotateAngle = pLoader.pLogic.cropTool.rotateAngle;
        }
        pLoader.pLogic.cropTool.cropType = (imageHeight / imageWidth >= cropRatio ? "vCrop" : "hCrop");
        if (pLoader.pLogic.cropTool.cropType == "vCrop") {
            pLoader.pLogic.cropTool.cropStats.placedImageW = pLoader.pLogic.cropTool.cropStats.cropWidth;
            pLoader.pLogic.cropTool.cropStats.placedImageH = parseInt(((pLoader.pLogic.cropTool.cropStats.cropWidth / imageWidth) * imageHeight).toFixed(0));
            placedImageX = pLoader.pLogic.cropTool.cropStats.cropLeft;
            placedImageY = parseInt((pLoader.pLogic.cropTool.cropStats.containerPadding + (pLoader.pLogic.cropTool.cropStats.paddedContainerH - pLoader.pLogic.cropTool.cropStats.placedImageH) / 2).toFixed(0));

        } else {
            pLoader.pLogic.cropTool.cropStats.placedImageH = pLoader.pLogic.cropTool.cropStats.cropHeight;
            pLoader.pLogic.cropTool.cropStats.placedImageW = parseInt(((pLoader.pLogic.cropTool.cropStats.cropHeight / imageHeight) * imageWidth).toFixed(0));
            placedImageY = pLoader.pLogic.cropTool.cropStats.cropTop;
            placedImageX = parseInt((pLoader.pLogic.cropTool.cropStats.containerPadding + (pLoader.pLogic.cropTool.cropStats.paddedContainerW - pLoader.pLogic.cropTool.cropStats.placedImageW) / 2).toFixed(0));
        }

        if (typeof pLoader.pLogic.cropTool.permX == "undefined" && typeof pLoader.pLogic.cropTool.permY == "undefined") {
            pLoader.pLogic.cropTool.permX = placedImageX;
            pLoader.pLogic.cropTool.permY = placedImageY;
        }


        if (pLoader.pLogic.cropTool.rotateAngle == 0 || pLoader.pLogic.cropTool.rotateAngle == 180) {
            pixQuery(displayedImage).attr({
                "height": pLoader.pLogic.cropTool.cropStats.placedImageH,
                "width": pLoader.pLogic.cropTool.cropStats.placedImageW
            }).css({
                transform: "rotateZ(" + pLoader.pLogic.cropTool.rotateAngle + "deg) scale(1)",
                "transform-origin": "center 50% 0px"
            });

            pixQuery('#dragHelper').css({
                'left': placedImageX,
                'top': placedImageY

            });
            if (typeof pLoader.pLogic.cropTool.initialDimensions == "undefined") {
                pLoader.pLogic.cropTool.initialDimensions = {
                    width: displayedImage.width,
                    height: displayedImage.height
                }
            }

        } else {
            // calculate the diffs between old center point and new center point
            var currentCenter = {
                x: pLoader.pLogic.cropTool.initialDimensions.width,
                y: pLoader.pLogic.cropTool.initialDimensions.height
            };


            var placeHolder = pLoader.pLogic.cropTool.cropStats.placedImageW;
            pLoader.pLogic.cropTool.cropStats.placedImageW = pLoader.pLogic.cropTool.cropStats.placedImageH;
            pLoader.pLogic.cropTool.cropStats.placedImageH = placeHolder;

            var newCenter = {
                x: pLoader.pLogic.cropTool.cropStats.placedImageW,
                y: pLoader.pLogic.cropTool.cropStats.placedImageH
            };

            pLoader.pLogic.cropTool.cropStats.centerDiff = {
                x: (currentCenter.x - newCenter.x) / 2,
                y: (currentCenter.y - newCenter.y) / 2
            };

            pixQuery(displayedImage).attr({
                "height": pLoader.pLogic.cropTool.cropStats.placedImageH,
                "width": pLoader.pLogic.cropTool.cropStats.placedImageW
            }).css({});

            pixQuery('#dragHelper').css({
                "left": pLoader.pLogic.cropTool.permX,
                "top": pLoader.pLogic.cropTool.permY
            });


            if (pLoader.pLogic.cropTool.rotateAngle == 90) {
                pixQuery(displayedImage).css({
                    "transform": "rotateZ(" + pLoader.pLogic.cropTool.rotateAngle + "deg) translate(" + pLoader.pLogic.cropTool.cropStats.centerDiff.y + "px," + -pLoader.pLogic.cropTool.cropStats.centerDiff.x + "px) scale(1)"
                })
            } else {
                pixQuery(displayedImage).css({
                    "transform": "rotateZ(" + pLoader.pLogic.cropTool.rotateAngle + "deg) translate(" + -pLoader.pLogic.cropTool.cropStats.centerDiff.y + "px," + pLoader.pLogic.cropTool.cropStats.centerDiff.x + "px) scale(1)"
                })
            }
        }


        var cropRect = pixQuery('#cropRect');

        pLoader.pLogic.cropTool.bindDrag(displayedImage, cropRect, pLoader.pLogic.cropTool.cropStats.centerDiff);

        pixQuery(window).off('scroll');
        pixQuery(window).on('scroll', function () {
            pLoader.pLogic.cropTool.bindDrag(displayedImage, cropRect, pLoader.pLogic.cropTool.cropStats.centerDiff);
        })

    }

    displayedImage.onload = function () {
        processImage();
        pLoader.pLogic.cropTool.imageHasLoaded = true;
    };
    if (pLoader.pLogic.cropTool.imageHasLoaded) {
        processImage();
    } else {
        displayedImage.src = originImage.src;
    }


};

pLoader.pLogic.cropTool.appendControls = function (origImage, cropContainer, cropRatio, cb) {
    cropContainer.before('<ul id="cropControls"><li id="zoomIncrease"></li><li id="zoomDecrease"></li><li id="rotateLeft"></li><li id="rotateRight"></li></ul>');
    var croppedImg = pixQuery('#cropBackgroundImage');
    var cropRect = pixQuery('#cropRect');

    function replaceInlineStyle() {
        var currentScale = 'scale(' + pLoader.pLogic.cropTool.zoomLevel + ')';
        var currentCss = croppedImg.attr('style');
        var scaleReplacement = /scale\(\d{0,2}(\.\d{0,2}){0,1}\)/gi;
        var newCss = currentCss.replace(scaleReplacement, currentScale);
        croppedImg.attr('style', newCss);
    }

    pixQuery('#cropControls #zoomIncrease').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'crop - zoomIn', 'event');
        if (pLoader.pLogic.cropTool.zoomLevel < 3) {
            pLoader.pLogic.cropTool.zoomLevel = parseFloat((pLoader.pLogic.cropTool.zoomLevel + 0.1).toFixed(1));

            replaceInlineStyle();
            pLoader.pLogic.cropTool.bindDrag(croppedImg, cropRect, pLoader.pLogic.cropTool.cropStats.centerDiff)
        }
    });

    pixQuery('#cropControls #zoomDecrease').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'crop - zoomOut', 'event');
        if (1 < pLoader.pLogic.cropTool.zoomLevel) {
            pLoader.pLogic.cropTool.zoomLevel = parseFloat((pLoader.pLogic.cropTool.zoomLevel - 0.1).toFixed(1));
            if (1 == pLoader.pLogic.cropTool.zoomLevel) {
                //pLoader.pLogic.cropTool.resetCrop(origImage,cropContainer,cropRatio,pLoader.pLogic.cropTool.rotateAngle);
                pLoader.pLogic.cropTool.placeCropRect(origImage, cropContainer, cropRatio, cb);
            } else {
                replaceInlineStyle();
                pLoader.pLogic.cropTool.bindDrag(croppedImg, cropRect, pLoader.pLogic.cropTool.cropStats.centerDiff, e);


            }
        }
    });

    pixQuery('#cropControls #rotateLeft').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'crop - rotateLeft', 'event');
        pLoader.pLogic.cropTool.oldZoomLevel = pLoader.pLogic.cropTool.zoomLevel;
        pLoader.pLogic.cropTool.oldRotateAngle = pLoader.pLogic.cropTool.rotateAngle;
        pLoader.pLogic.cropTool.rotateAngle -= 90;
        pLoader.pLogic.cropTool.zoomLevel = 1;
        if (pLoader.pLogic.cropTool.rotateAngle == -90) pLoader.pLogic.cropTool.rotateAngle = 270;
        //pLoader.pLogic.cropTool.resetCrop(origImage,cropContainer,cropRatio,pLoader.pLogic.cropTool.rotateAngle);
        pLoader.pLogic.cropTool.placeCropRect(origImage, cropContainer, cropRatio, cb);
    });

    pixQuery('#cropControls #rotateRight').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'crop - rotateRight', 'event');
        pLoader.pLogic.cropTool.oldZoomLevel = pLoader.pLogic.cropTool.zoomLevel;
        pLoader.pLogic.cropTool.oldRotateAngle = pLoader.pLogic.cropTool.rotateAngle;
        pLoader.pLogic.cropTool.rotateAngle += 90;
        pLoader.pLogic.cropTool.zoomLevel = 1;
        if (pLoader.pLogic.cropTool.rotateAngle == 360) pLoader.pLogic.cropTool.rotateAngle = 0;
        //pLoader.pLogic.cropTool.resetCrop(origImage,cropContainer,cropRatio,pLoader.pLogic.cropTool.rotateAngle);
        pLoader.pLogic.cropTool.placeCropRect(origImage, cropContainer, cropRatio, cb);
    })
};


pLoader.pLogic.cropTool.placeCropRect = function (origImage, cropContainer, cropRatio) {

    var cropRect = pixQuery('#cropRect');
    var containerW = parseInt(cropContainer.width());
    var containerH = parseInt(cropContainer.height());
    pLoader.pLogic.cropTool.cropStats.containerPadding = 15;
    pLoader.pLogic.cropTool.cropStats.paddedContainerH = containerH - (pLoader.pLogic.cropTool.cropStats.containerPadding * 2);
    pLoader.pLogic.cropTool.cropStats.paddedContainerW = containerW - (pLoader.pLogic.cropTool.cropStats.containerPadding * 2);
    var paddedContainerRatio = pLoader.pLogic.cropTool.cropStats.paddedContainerH / pLoader.pLogic.cropTool.cropStats.paddedContainerW;

    if (cropRatio >= paddedContainerRatio) {
        pLoader.pLogic.cropTool.cropStats.cropHeight = parseInt(pLoader.pLogic.cropTool.cropStats.paddedContainerH);
        pLoader.pLogic.cropTool.cropStats.cropWidth = parseInt(pLoader.pLogic.cropTool.cropStats.paddedContainerH / cropRatio);
        pLoader.pLogic.cropTool.cropStats.cropTop = parseInt(pLoader.pLogic.cropTool.cropStats.containerPadding);
        pLoader.pLogic.cropTool.cropStats.cropLeft = parseInt(pLoader.pLogic.cropTool.cropStats.containerPadding + (pLoader.pLogic.cropTool.cropStats.paddedContainerW - pLoader.pLogic.cropTool.cropStats.cropWidth) / 2)
    } else {
        pLoader.pLogic.cropTool.cropStats.cropHeight = parseInt(pLoader.pLogic.cropTool.cropStats.paddedContainerW * cropRatio);
        pLoader.pLogic.cropTool.cropStats.cropWidth = parseInt(pLoader.pLogic.cropTool.cropStats.paddedContainerW);
        pLoader.pLogic.cropTool.cropStats.cropTop = parseInt(pLoader.pLogic.cropTool.cropStats.containerPadding + (pLoader.pLogic.cropTool.cropStats.paddedContainerH - pLoader.pLogic.cropTool.cropStats.cropHeight) / 2);
        pLoader.pLogic.cropTool.cropStats.cropLeft = parseInt(pLoader.pLogic.cropTool.cropStats.containerPadding);
    }
    cropRect.css({
        'height': pLoader.pLogic.cropTool.cropStats.cropHeight,
        'width': pLoader.pLogic.cropTool.cropStats.cropWidth,
        'top': pLoader.pLogic.cropTool.cropStats.cropTop,
        'left': pLoader.pLogic.cropTool.cropStats.cropLeft
    });

    pLoader.pLogic.cropTool.placeImageOnContainer(origImage, cropContainer, cropRatio);
};

pLoader.pLogic.cropTool.resetCrop = function (origImage, cropContainer, cropRatio, rAngle) {
    pLoader.pLogic.cropTool.cropStats = {};
    pLoader.pLogic.cropTool.rotateAngle = rAngle;
    pLoader.pLogic.cropTool.zoomLevel = 1;

    pLoader.pLogic.cropTool.placeCropRect(origImage, cropContainer, cropRatio);
};

pLoader.pLogic.cropTool.init = function (origImage, cropContainer, productData, cb, params) {
    var cropRatio = productData.cropRatio;
    delete pLoader.pLogic.cropTool.permX;
    delete pLoader.pLogic.cropTool.permY;
    delete  pLoader.pLogic.cropTool.initialDimensions;
    pLoader.pLogic.cropTool.cropStats = {};

    cropContainer.addClass(pLoader.pLogic.shop.selectedItem.type).append('<div id="dragHelper"><img id="cropBackgroundImage" style="transform:scale(1)" src=""></div><div id="cropRect"></div><canvas id="cropCanvas"></canvas>');


    pLoader.pLogic.cropTool.rotateAngle = 0;
    pLoader.pLogic.cropTool.zoomLevel = 1;
    pLoader.pLogic.cropTool.imageHasLoaded = false;
    pLoader.pLogic.cropTool.appendControls(origImage, cropContainer, cropRatio, cb);
    pLoader.pLogic.cropTool.placeCropRect(origImage, cropContainer, cropRatio);
    pixQuery('#applyCrop').on('click', function (e) {
        e.preventDefault();
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'Apply crop', 'event');
        pLoader.pLogic.shop.resetDPIFlag();
        pLoader.pLogic.cropTool.startCrop(e, origImage, cropContainer, cb);
        /*var dpiTest;
         if(pLoader.pLogic.cropTool.rotateAngle == 0 || pLoader.pLogic.cropTool.rotateAngle == 180){
         dpiTest = pLoader.pLogic.calculateDPI(pLoader.pLogic.selectedImageDimensions.height/pLoader.pLogic.cropTool.zoomLevel,pLoader.pLogic.selectedImageDimensions.width/pLoader.pLogic.cropTool.zoomLevel,productData)
         }else{
         dpiTest = pLoader.pLogic.calculateDPI(pLoader.pLogic.selectedImageDimensions.width/pLoader.pLogic.cropTool.zoomLevel,pLoader.pLogic.selectedImageDimensions.height/pLoader.pLogic.cropTool.zoomLevel,productData)
         }
         if(dpiTest){
         ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum),'Apply crop','event');
         pLoader.pLogic.cropTool.startCrop(e,origImage,cropContainer,cb);
         }else{
         pLoader.pLogic.dpiFlag = true;
         pLoader.pLogic.createPopup('dpiWarning_crop',[e,origImage,cropContainer,cb])
         }*/
    });
    pixQuery('#cancelCrop').on('click', function (e) {
        e.preventDefault();
        pLoader.pLogic.shop.stepNum = 2;
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'Cancel crop', 'event');
        pLoader.pLogic.shop.initStep(pLoader.pLogic.shop.stepNum, e, false, params);
    });


    pixQuery('#revertCrop').on('click', function (e) {
        e.preventDefault();
        ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'Restore crop', 'event');
        pLoader.pLogic.cropTool.resetCrop(origImage, cropContainer, cropRatio, 0)
    });
};

pLoader.pLogic.firstTimeLogic = function (showStore) {

    if (pixQuery('.p_IntroButton').length <= 1) {
        var cSuffix = "";
        if (typeof pLoader.data.brandingDetails.c_suffix != "undefined" && typeof pLoader.data.brandingDetails.c_suffix.fte != "undefined") {
            cSuffix = pLoader.data.brandingDetails.c_suffix.fte;
        }
        var cookieName = pLoader.data.brandingDetails.c_prefix + "fte_x4" + pLoader.data.brandingDetails.sub_brand + "_" + cSuffix;
        if (typeof pixQuery.cookie(cookieName) == "undefined") {
            if (showStore) {
                pixQuery('.p_IntroButton').trigger('click', [true]);
                pLoader.pLogic.showExitSurvey = false;
            }
            setTimeout(function () {
                //var cbButton = pixQuery('.p_IntroButton');
                //var currentImageURL = pixQuery('.p_IntroButton').parents('.p_IntroButtonContainer').attr('current-image-url');
                pLoader.pLogic.showFirstTimeExperience();
                var timeToExpire = 30;
                var cSuffix = "";
                if (typeof pLoader.data.brandingDetails.c_suffix != "undefined" && typeof pLoader.data.brandingDetails.c_suffix.fte != "undefined") {
                    cSuffix = pLoader.data.brandingDetails.c_suffix.fte;
                }
                var cookieName = pLoader.data.brandingDetails.c_prefix + "fte_x4" + pLoader.data.brandingDetails.sub_brand + "_" + cSuffix;
                pixQuery.cookie(cookieName, 'true', {expires: timeToExpire, path: "/"});
            }, 1000)
        }
    }
};

pLoader.pLogic.showFirstTimeExperience = function () {
    function cb(data) {

        pixQuery('#p_StoreHeader').append(data);
        ga_$pex('send', 'event', 'Meta', 'First time experience impression', 'important action');
        pixQuery('.p_learnMoreP a').on('click', function (e) {
            e.preventDefault();
            window.open(pLoader.data.brandingDetails.brandSite + '?origin=c', 'p_WhoWeAre', 'titlebar=no,width=610, height=350');
        });
        pixQuery('#p_fte').fadeIn();

        pixQuery('#closePFTE').on('click', function (e) {
            e.preventDefault();
            pLoader.pLogic.hideFirstTimeExperience();
        });
    }

    if ((typeof pLoader.overlayMode == "undefined" || pLoader.overlayMode == false) && (typeof pLoader.data.brandingDetails.marketingData == "undefined" || typeof pLoader.data.brandingDetails.marketingData.ossEnabled == "undefined" || pLoader.data.brandingDetails.marketingData.ossEnabled == false)) {
        pLoader.crossDomainAjax(pLoader.assetsServer + pLoader.data.assetsList.partialBaseURL + 'fte.html', function (data) {
            cb(data)
        });
    }

};
pLoader.pLogic.hideFirstTimeExperience = function () {
    pixQuery('#p_fte').fadeOut(function () {
        pixQuery(this).remove()
    });
};

pLoader.pLogic.hideMegaTeaser = function () {
    clearInterval(pLoader.bannerTimer);
    pLoader.bannerTimer = 0;
    pixQuery('#pMegaTeaserContainer').fadeOut(function () {
        pixQuery(this).remove()
    });
};

pLoader.pLogic.showFeedFirstTimeExperience = function (cbButton, imageSRC, type) {

    function cb(data) {
        //append banner2 to body
        var $pmt = !!pixQuery("#pMegaTeaserContainer").length ? pixQuery("#pMegaTeaserContainer") : pixQuery(data).appendTo('body').addClass("os_" + pLoader.pLogic.getOS());
        //GA event
        ga_$pex('send', 'event', 'button', 'banner on ' + type, 'important action');
        pLoader.pLogic.sendInternalEvent('mega_teaser_impression', '0', {"source": type}, false);

        //Starting slide index
        // and other initializations that are done only once
        if (typeof pLoader.teaserIndex == "undefined") {
            pLoader.teaserIndex = 0;
            pLoader.teaserCurrentSlide = 0;
        }
        //Get the product data by slide index
        var productData = pLoader.data.brandingDetails.marketingData['ossData'][pLoader.teaserIndex];
        var bannersPath = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + 'banners/';
        pLoader.bannerImageSrc = imageSRC;

        //var banner
        $pmt.find('.pmt_slide .pmt_slide_banner')
            .eq(pLoader.teaserCurrentSlide)
            .css({'background-image': 'url(' + bannersPath + productData['productImage'] + ')'});
        $pmt.find('.pmt_slide .pmt_slide_product_image')
            .eq(pLoader.teaserCurrentSlide)
            .attr('style', productData['portholeStyle'])
            .css({
                'width': productData['tmbWidth'] * 1.05,
                'height': productData['tmbHeight'] * 1.05,
                'background-image': 'url(' + pLoader.bannerImageSrc + ')',
                'left': function (index, value) {
                    //return (parseInt(value) / 1.025).toString() + 'px';
                    return value;
                },
                'top': function (index, value) {
                    //return (parseInt(value) / 1.025).toString() + 'px';
                    return value;
                }
            });
        $pmt.find('.pmt_slide .pmt_slide_product_text .pmt_slide_product_line1')
            .eq(pLoader.teaserCurrentSlide).attr('style', productData['titleStyle']).html(productData['h2'].translate());
        $pmt.find('.pmt_slide .pmt_slide_product_text .pmt_slide_product_line2')
            .eq(pLoader.teaserCurrentSlide).attr('style', productData['pStyle']).html(productData['p'].translate());


        //Call to action click handler
        $pmt.find('.pmt_action').one('click', function (e) {
            e.preventDefault();
            ga_$pex('send', 'event', 'button', 'Click on try it now - banner - on ' + productData.type, 'event');
            try {
                cbButton.click();
            } catch (ex) {
                cbButton[0].click();
            }
            pLoader.pLogic.hideMegaTeaser();
        });
        //Close Banner event
        $pmt.find('.pmt_close_btn').on('click', function (e) {
            e.preventDefault();
            pLoader.pLogic.hideMegaTeaser();
        });
        //Learn more link click handling
        pixQuery('.pmt_learn_more').on('click', function (e) {
            e.stopPropagation();
            window.open(pLoader.data.brandingDetails.brandSite + '?origin=c', 'p_WhoWeAre', 'titlebar=no,width=610, height=350');
        });
        //Add brand "powered by" wording
        $pmt.find('.pmt_powered_by_brand').html(pLoader.data.brandingDetails.brandName);
        //Show the banner only after the initial background has loaded
        pixQuery('<img>').load(function () {
            $pmt.show();
        }).attr('src', bannersPath + productData['productImage']);
        var switch_timer = 4000;
        if (!pLoader.bannerTimer) {
            pLoader.bannerTimer = setInterval(function () {
                if (!pLoader.bannerTimer) {
                    return false;
                }
                //make the next slide
                var next_teaser_index = (pLoader.teaserIndex + 1) % pLoader.data.brandingDetails.marketingData['ossData'].length;
                var next_teaser_slide = 1; //(pLoader.teaserCurrentSlide + 1) % 2;
                var nextProductData = pLoader.data.brandingDetails.marketingData['ossData'][next_teaser_index];
                $pmt.find('.pmt_slide .pmt_slide_banner')
                    .eq(next_teaser_slide)
                    .css({'background-image': 'url(' + bannersPath + nextProductData['productImage'] + ')'});
                $pmt.find('.pmt_slide .pmt_slide_product_image')
                    .eq(next_teaser_slide)
                    .attr('style', nextProductData['portholeStyle'])
                    .css({
                        'width': nextProductData['tmbWidth'] * 1.05,
                        'height': nextProductData['tmbHeight'] * 1.05,
                        'background-image': 'url(' + pLoader.bannerImageSrc + ')',
                        'left': function (index, value) {
                            //return (parseInt(value) / 1.025).toString() + 'px';
                            return value;
                        },
                        'top': function (index, value) {
                            //return (parseInt(value) / 1.025).toString() + 'px';
                            return value;
                        }
                    });
                $pmt.find('.pmt_slide .pmt_slide_product_text .pmt_slide_product_line1')
                    .eq(next_teaser_slide)
                    .attr('style', nextProductData['titleStyle'])
                    .html(nextProductData['h2'].translate());
                $pmt.find('.pmt_slide .pmt_slide_product_text .pmt_slide_product_line2')
                    .eq(next_teaser_slide)
                    .attr('style', nextProductData['pStyle'])
                    .html(nextProductData['p'].translate());

                //Wait for background image to load before animating
                pixQuery('<img>').load(function () {
                        $pmt.find('.pmt_slide')
                            .eq(pLoader.teaserCurrentSlide)
                            .css({'margin-left': '0px'})
                            .animate({'margin-left': -620}, 2000, function () {
                                    var $curSlide = $pmt.find('.pmt_slide').eq(pLoader.teaserCurrentSlide);
                                    $curSlide.detach().css({'margin-left': ''});
                                    $pmt.find('.pmt_slides_container').append($curSlide);
                                    pLoader.teaserIndex = next_teaser_index;
                                }
                            );
                    }
                ).attr('src', bannersPath + nextProductData['productImage']);
                return true;
            }, switch_timer);
        }
    }

    // Register the cookie
    function handleCookie(type, product) {
        var cookieName, cookieValue, expiry;
        if (type == "large image") {
            var cSuffix = "";
            if (typeof pLoader.data.brandingDetails.c_suffix != "undefined" && typeof pLoader.data.brandingDetails.c_suffix.fte != "undefined") {
                cSuffix = pLoader.data.brandingDetails.c_suffix.fte;
            }
            cookieName = pLoader.data.brandingDetails.c_prefix + "fte_x4" + pLoader.data.brandingDetails.sub_brand + "_" + cSuffix;
            expiry = 30;
            cookieValue = "true";
        } else {
            cookieName = pLoader.data.brandingDetails.c_prefix + 'fefte_' + pLoader.data.brandingDetails.c_suffix.feedFTE + "_" + type;
            expiry = parseInt(pLoader.data.brandingDetails.feedFTE.interval);
            cookieValue = pixQuery.cookie(cookieName);
            if (typeof cookieValue == "undefined") {
                cookieValue = [];
            } else {
                cookieValue = cookieValue.split(',');
            }
            cookieValue.push(product);
            cookieValue = cookieValue.toString();

        }
        pixQuery.cookie(cookieName, cookieValue, {expires: expiry, path: "/"});
    }

    // Decide if to show the banner or not on grid/feed
    if (type == "grid" || type == "feed") {
        if (!cbButton.hasClass('b_shown') && pixQuery('#p_fte').length == 0 && typeof imageSRC != "undefined") {
            var typeCookie = pLoader.data.brandingDetails.c_prefix + 'fefte_' + pLoader.data.brandingDetails.c_suffix.feedFTE + "_" + type;
            var typesDisplayed = pixQuery.cookie(typeCookie);
            var showBanner = false;
            if (typeof typesDisplayed == "undefined") {
                showBanner = true;
            } else {
                typesDisplayed = typesDisplayed.split(',');
                /* Hardcoded to only show two occurrences per type
                 if(typesDisplayed.length < thumbnailsData.length){
                 showBanner = true;
                 }
                 */
                if (typesDisplayed.length < 1) {
                    showBanner = true;
                }
            }
            /*//TODO: Remove the below line before pushing
             showBanner = true;*/
            if (showBanner) {
                //cbButton.addClass('b_shown');
                handleCookie(type, "iphone");
                pLoader.crossDomainAjax(pLoader.assetsServer + pLoader.data.assetsList.partialBaseURL + 'banner2.html', function (data) {
                    cb(data)
                });
            }
        }
    } else {
        pLoader.crossDomainAjax(pLoader.assetsServer + pLoader.data.assetsList.partialBaseURL + 'banner2.html', function (data) {
            cb(data)
        });
    }


};


pLoader.listenToDisable = function () {
    window.addEventListener("message", function (event) {
        if (event.data.type == "disable_store") {
            var timeToExpire = parseInt(event.data.disable_duration);
            ga_$pex('send', 'event', pLoader.pLogic.convertStepsToNames(pLoader.pLogic.shop.stepNum), 'disableStore for ' + timeToExpire, 'event');
            var cookieName = pLoader.data.brandingDetails.c_prefix + "hs_s8" + pLoader.data.brandingDetails.sub_brand;
            pixQuery.cookie(cookieName, 'true', {expires: timeToExpire, path: "/"});
            pixQuery('#p_fte,.p_Button,#p_Store,.p_IntroButtonContainer').fadeOut(500, function () {
                pixQuery(this).remove()
            });
            delete pLoader;
        }

    }, false);
};


// Don't init the shop and buttons if the user has activated the disable feature
pLoader.initExtension = function () {
    pLoader.pLogic.initStatistics();
    pLoader.preloadFont();
    var currentDate = new Date().getTime();
    var cookieName = pLoader.data.brandingDetails.c_prefix + "hs_s8" + pLoader.data.brandingDetails.sub_brand;
    if ((pixQuery.cookie(cookieName) != "true") && currentDate < pLoader.pLogic.expD) {
        pLoader.listenToDisable();
        pLoader.pLogic.productsJson = pLoader.data.products;
        pLoader.crossDomainAjax(pLoader.assetsServer + pLoader.data.assetsList.partialBaseURL + 'button.html', function (data) {
            pLoader.pLogic.initialCB(data)
        });
    }

};

pLoader.registerExternalEvents = function (eventsObj) {
    pLoader.eventListener = eventsObj;
};

pLoader.preloadFont = function () {
    var preloadSpan = pixQuery('<span id="preloadFontSpan"></span>').appendTo('body');
    setTimeout(function () {
        preloadSpan.remove();
    }, 5000)
};

pLoader.initOnDemand = function (onDemandArgs) {

    if (typeof onDemandArgs == "object") {
        var defaults = {
            "selectors": "img",
            "minHeight": 150,
            "minWidth": 150,
            "position": "top-left",
            "text": "Get Prints >>".translate(),
            "textColor": "#ffffff",
            "buttonColor": "#00B22D",
            "tbMinHeight": 100,
            "tbMinWidth": 100
        };

        pLoader.preloadFont();

        var onDemandObj = {};

        // If any of the keys is missing in the original object, use the defaults.
        pixQuery.extend(onDemandObj, defaults, onDemandArgs);

        var elements = pixQuery(onDemandObj.selectors);


        // Check the dimensions of the passed pixQuery object, and return true if it passes the dimensions defined in the onDemandObj fields
        function checkDimensions(object, h, w) {
            var imageHeight = object.height;
            var imageWidth = object.width;

            if (imageHeight > h && imageWidth > w) {
                return true;
            } else {
                return false;
            }
        }

        function checkURL(url) {
            var arr = ["jpeg", "jpg"];
            var ext = url.substring(url.lastIndexOf(".") + 1);
            var result = false;
            for (var strCheck = 0; strCheck <= arr.length - 1; strCheck++) {
                if (ext.indexOf(arr[strCheck]) > -1) {
                    result = true;
                }
            }
            return result;
        }


        function addButtonToImage(object, url) {

            object = pixQuery(object);

            if (pixQuery('.pixter_wrapper').length == 0) {
                pixQuery('body').append('<div class="pixter_wrapper" style="position:initial;height:0;width:0;"></div>');
            }

            var style = "color:{0};background-color:{1};";
            style = style.pFormat(onDemandObj.textColor, onDemandObj.buttonColor);
            switch (onDemandObj.position) {
                case "top-left":
                {

                }
                case "top-right":
                {
                    style += "top:5px;right:5px;bottom:auto;left:auto;";
                    break;
                }
                case "bottom-left":
                {
                    style += "bottom:5px;left:5px;right:auto;top:auto;";
                    break;
                }
                case "bottom-right":
                {
                    style += "bottom:5px;right:5px;left:auto;top:auto;";
                    break;
                }
                default:
                {
                    style += "top:5px;left:5px;bottom:auto;right:auto;";
                }
            }

            var button = "<a href='#' class='p_WP_button' style='{0}' data-imageurl='{1}'>{2}</a>";
            button = pixQuery(button.pFormat(style, url, onDemandObj.text));
            var offsets = object.offset();
            button.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var initURL = pixQuery(this).attr('data-imageurl');
                pLoader.initSDK(initURL);
            }).appendTo('.pixter_wrapper');

            object.parent().on('mouseenter', function () {
                var offsets = object.offset();
                button.css({
                    "position": "absolute",
                    "top": offsets.top + 10,
                    "left": offsets.left + 10,
                    "right": "auto",
                    "bottom": "auto"
                }).addClass('visible');
            }).on('mouseout', function () {
                button.removeClass('visible');
            })
        }

        function checkParent(currentEl, failCB) {
            // Check if the item's direct parent is a link, check its href and see if its an image...
            var elLinkParent = currentEl.parentNode;


            // If this is a link...
            if (elLinkParent.tagName == "A") {
                // Get it's HREF...
                var elLinkParentHref = elLinkParent.getAttribute('href');

                // And see if it's an image...
                if (checkURL(elLinkParentHref)) {
                    // If it is, see if the image is big enough
                    var tempImg = new Image();
                    tempImg.onload = function () {
                        if (checkDimensions(tempImg, onDemandObj.minHeight, onDemandObj.minWidth)) {
                            chosenURL = tempImg.src;
                            addButtonToImage(currentEl, chosenURL);
                        } else {
                            failCB();
                        }
                    };
                    tempImg.src = elLinkParentHref;
                } else {
                    failCB();

                }
            } else {
                failCB();
            }
        }

        // Iterate over all selectors
        for (var i = 0; i <= elements.length - 1; i++) {
            var chosenURL = false;

            var currentEl = elements[i];

            // If the base image object is big enough, pass a success callback to checkParent
            if (currentEl.height >= onDemandObj.tbMinHeight && currentEl.width >= onDemandObj.tbMinWidth) {
                chosenURL = currentEl.src;
                function originalImageButton() {
                    addButtonToImage(currentEl, chosenURL);
                }

                checkParent(currentEl, originalImageButton)
            }
        }
    }
};

pLoader.initSDK = function (dataURL, eventsObj, fitToRatio, skipStepObject, targetContainer) {
    fitToRatio = !!fitToRatio;
    //console.log('initSDK',pLoader.data.isInited);
    function continueInitSdk(dataURL, eventsObj, fitToRatio, skipStepObject, targetContainer) {
        pLoader.pLogic.productsJson = pLoader.data.products;
        pLoader.pLogic.shop.isInited = null;
        if (!!targetContainer && pixQuery('#p_Store').length >= 1) {
            pLoader.pLogic.shop.closeShop(null, null, 'new instance opened instead of this one');
        } else {
            pLoader.listenToDisable();
        }
        pLoader.pLogic.targetContainer = targetContainer;


        pLoader.pLogic.initStatistics();

        if (typeof pLoader.overlayMode != "undefined" && pLoader.overlayMode == true) {
            if (pixQuery('#p_overlay').length == 0) {
                var ui_id = "";
                if (typeof pLoader.data.brandingDetails.ui_id != "undefined") {
                    ui_id = pLoader.data.brandingDetails.ui_id;
                }

                pixQuery('body').append('<div id="p_overlay" class="' + ui_id + '"></div>');
                pixQuery('#p_overlay').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
            }
        }
        if (!!skipStepObject) {
            pLoader.skipStepObject = skipStepObject;
        }

        if (typeof eventsObj != "undefined" && eventsObj != null) {
            pLoader.registerExternalEvents(eventsObj);
        }


        var virtualImage = new Image();

        virtualImage.onload = function () {
            var realDimensions = {
                height: virtualImage.height,
                width: virtualImage.width
            };
            var executeInit = function () {
                pLoader.crossDomainAjax(pLoader.assetsServer + pLoader.data.assetsList.partialBaseURL + 'button.html', function (data) {
                    pLoader.pLogic.buttonHTML = data;
                    pLoader.preloadFont();
                    pLoader.pLogic.initImageOverlay(virtualImage, realDimensions, 'largeImage');
                    if (!pLoader.data.ratioJsonKey) {
                        pLoader.preLoadStatics(pLoader.data.currentJSONKey);
                    } else {
                        pLoader.preLoadStatics(pLoader.data.ratioJsonKey);
                    }
                });
            };

            pLoader.fitToRatio = fitToRatio;

            //console.log('fit to ratio',fitToRatio);
            // check if fitToRatio rules array exists
            if (typeof pLoader.data.brandingDetails.fitToRatio != "undefined"
                && typeof pLoader.data.brandingDetails.fitToRatio.rules != "undefined") {
                var ratio = (virtualImage.width / virtualImage.height).toFixed(1);
                var defaultValue, winner = false;
                for (var i = 0; i <= pLoader.data.brandingDetails.fitToRatio.rules.length - 1; i++) {
                    if (pLoader.data.brandingDetails.fitToRatio.rules[i].isDefault) {
                        defaultValue = pLoader.data.brandingDetails.fitToRatio.rules[i].id;
                    }
                    if (pLoader.data.brandingDetails.fitToRatio.rules[i].ratio === ratio.toString()) {
                        winner = pLoader.data.brandingDetails.fitToRatio.rules[i].id;
                    }
                }
                if (!pLoader.fitToRatio || !winner) {
                    winner = defaultValue;
                }
                if (winner != pLoader.data.currentJSONKey) {
                    pLoader.reInit(winner, function () {
                        pLoader.pLogic.productsJson = pLoader.data.products;
                        ga_$pex('set', 'dimension2', winner);
                        ga_$pex('send', 'event', 'store switch', 'store switched to ' + winner, 'event');
                        executeInit();
                    })
                } else {
                    executeInit();
                }
            } else {
                executeInit();
            }

        };
        virtualImage.src = dataURL;
    }

    if (!pLoader.data.isInited) {
        clearTimeout(pLoader.data.initSdkTimeoutCounter);
        pLoader.data.initSdkTimeoutCounter = setTimeout(function () {
            continueInitSdk(dataURL, eventsObj, fitToRatio, skipStepObject, targetContainer);
        }, 20);
    } else {
        continueInitSdk(dataURL, eventsObj, fitToRatio, skipStepObject, targetContainer);
    }
};


pLoader.sideBarImpression = false;
pLoader.showSideBar = function (parentElement, imageUrl, clickAction, variant) {
    if (typeof pLoader.pLogic.statistics == "undefined") {
        pLoader.pLogic.initStatistics();
    }

    var sideBarData = {
        "p_side_banner_top_title": "Photo Gifts".translate(),
        "p_side_banner_top_sub_title": "Of your designed image".translate(),
        "p_side_banner_bottom_title": "From $6.99".translate(),
        "p_side_banner_bottom_sub_title": "FREE SHIPPING!".translate(),
        "p_button_text": "Shop Now".translate(),
        "p_items": [{'type': 'phoneCase'}]
    };
    if (pLoader.data.brandingDetails && pLoader.data.brandingDetails.marketingData && pLoader.data.brandingDetails.marketingData.sideBarData) {
        pixQuery.extend(sideBarData, pLoader.data.brandingDetails.marketingData.sideBarData);
    }

    if (typeof sideBarData.p_custom_css != "undefined") {
        pixQuery('body').append('<style>' + sideBarData.p_custom_css + '</style>');
    }

    var itemList = sideBarData.p_items;

    if (typeof variant == "undefined") {
        variant = "flexi"
    }

    function moveToNextItem() {
        middleImage.fadeOut(300, function () {
            sideBarIndex++;
            if (sideBarIndex > itemList.length - 1) {
                sideBarIndex = 0;
            }
            middleImage.attr('class', sideBarIndex);
            middleImage.fadeIn(300);
        })
    }

    function fireSideBarStat(eventName) {
        if (pixQuery('#pBannerOutlier').is(':visible')) {
            if (eventName == 'sidebar_impression') {
                pLoader.sideBarImpression = true;
            } else {
                if (!pLoader.sideBarImpression) {
                    ga_$pex('send', 'event', 'sidebar', 'sidebar_imrpression', 'important action');
                    pLoader.pLogic.sendInternalEvent('sidebar_imrpression', '0', {}, false);
                    pLoader.sideBarImpression = true;
                }
            }
            ga_$pex('send', 'event', 'sidebar', eventName, 'important action');
            pLoader.pLogic.sendInternalEvent(eventName, '0', {}, false);
        }
    }

    if (!pixQuery('#pBannerOutlier').length) {

        parentElement = pixQuery(parentElement);
        var outlier = pixQuery('<div></div>').attr('id', 'pBannerOutlier').addClass(variant);
        var container = pixQuery('<div></div>').addClass('p_side_banner_container');
        var topSide = pixQuery('<div></div>').addClass('p_side_banner_top');
        var topSideTitle = pixQuery('<div></div>').addClass('p_side_banner_top_title').text(sideBarData.p_side_banner_top_title);
        var topSideSubTitle = pixQuery('<div></div>').addClass('p_side_banner_top_sub_title').text(sideBarData.p_side_banner_top_sub_title);
        var sideBarIndex = 0;
        var middleImage = pixQuery('<div></div>').attr('id', 'p_side_banner_middle_image').addClass(itemList[sideBarIndex].type);
        var templateImage = pixQuery('<div></div>').addClass('p_side_banner_middle_template_image');
        var productImage = pixQuery('<div></div>').addClass('p_side_banner_middle_product_image');
        var bottomSide = pixQuery('<div></div>').addClass('p_side_banner_bottom');
        var bottomSideTitle = pixQuery('<div></div>').addClass('p_side_banner_bottom_title').text(sideBarData.p_side_banner_bottom_title);
        var bottomSideSubTitle = pixQuery('<div></div>').addClass('p_side_banner_bottom_sub_title').text(sideBarData.p_side_banner_bottom_sub_title);
        var actionArea = pixQuery('<div></div>').addClass('p_side_banner_action_area');
        var actionButton = pixQuery('<div>' + sideBarData.p_button_text + '</div>').addClass('p_side_banner_action_button');
        var actionText = pixQuery('<div>or choose <span>another product</span></div>'.translate()).addClass('p_side_banner_action_text');

        parentElement.append(
            outlier.append(
                container.append(
                    topSide.append(
                        topSideTitle,
                        topSideSubTitle
                    ),
                    middleImage.append(
                        productImage,
                        templateImage
                    ),
                    bottomSide.append(
                        bottomSideTitle,
                        bottomSideSubTitle
                    ),
                    actionArea.append(
                        actionButton,
                        actionText
                    )
                )
            )
        );


        function onActionClick() {
            fireSideBarStat('sidebar_click');
            if (typeof clickAction != "function") {
                pixQuery('#editor-tools').find('.print-store').click();
            } else {
                clickAction();
            }
        }

        function onParentResize() {
            //pixQuery('#pBannerOutlier').height(parentElement.height() - 22);
            pixQuery('#pBannerOutlier').height(parentElement.height());
        }

        pixQuery(window).resize(function () {
            onParentResize()
        });
        onParentResize();
        pixQuery(actionArea).on('click', function () {
            if (actionButton.attr('disabled')) {
                return;
            }
            onActionClick();
        });
        pixQuery(middleImage).on('click', function () {
            onActionClick();
        });
        fireSideBarStat('sidebar_impression');
    } else {
        fireSideBarStat('sidebar_image_change');
    }

    var banner = pixQuery('#pBannerOutlier');
    banner.find('.p_side_banner_middle_product_image').css({'background-image': 'url("' + imageUrl + '")'});
    banner.show();
};

pLoader.hideSideBar = function () {
    pLoader.pLogic.sendInternalEvent('sidebar_hide', '0', {}, false);
    ga_$pex('send', 'event', 'sidebar', 'hide', 'important action');
    var pBannerOutliner = pixQuery('#pBannerOutlier');
    if (!!pBannerOutliner.length) {
        pBannerOutliner.hide();
    }
};


if (typeof chrome == "undefined" || typeof chrome.extension == "undefined") {
    pLoader.initExtension();
}


pLoader.closeSupportWindow = function () {
    if (typeof pLoader.pLogic.supportWindow === 'object' && !pLoader.pLogic.supportWindow.closed) {
        try {
            pLoader.pLogic.supportWindow.location = 'about:blank';
            pLoader.pLogic.supportWindow.close();
        }
        catch (e) {
            setTimeout(function () {
                pLoader.closeSupportWindow();
            }, 30);
        }
    }
};