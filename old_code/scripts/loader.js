pLoader = window.pLoader || {};
pLoader.metadata = {
    "version": "1.1.0.0"
}
if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}
/**
 * pLoader.assetsServer and pLoader.currenciesServer
 * are being set by Gulp
 * the written values are the local values (also fetched by gulp)
 *
 */

pLoader.assetsServer = "dist/";
pLoader.currenciesServer = "dist/pricing/currencies/";

//configurations url for files that are not version related
pLoader.conigurationsServer = "dist/configurations/";
pLoader.languagesServer = "dist/languages/";


//pLoader.assetsServer = "https://assets-521295.c.cdn77.org/v1005/";
//pLoader.assetsServer = "https://pixter-loader-assets.s3.amazonaws.com/v1005/";
pLoader.data = window.pLoader.data || {};

pLoader.ieVersion = (function () {
    var match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
    return match ? parseInt(match[1]) : undefined;
})();

pLoader.createCookie = function (name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

pLoader.readCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 *  translate will search a text inside ## (##txt##)
 *  and will replace it if there is an entry for it in pLoader.data.languageTable[txt]
 */

if (!String.prototype.translate) {
    String.prototype.translate = function () {
        return typeof pLoader.data.languageTable[this] != 'undefined'
            ? pLoader.data.languageTable[this]
            : this.replace(/(##([^##]+)##)/g, function (match, all, str) {
            return typeof pLoader.data.languageTable[str] != 'undefined'
                ? pLoader.data.languageTable[str]
                : str
                ;
        });
    };
}


/**
 * replaceKeys will search a key inside [] ([key]) and replace it with its value in the keysValues object
 * @param   keysValues {object} contain the keys and their values ({"key1":"value1","key2":"value2", etc..} )
 */
if (!String.prototype.replaceKeys) {
    String.prototype.replaceKeys = function (keysValues) {
        return this.replace(/\[(.*?)\]/g, function (match, keyValue, string) {
            return typeof keysValues[keyValue] != 'undefined' ?
                keysValues[keyValue] :
                '';
        })
    };
}


pLoader.crossDomainAjax = function (url, successCallback) {

    // IE8 & 9 only Cross domain JSON GET request
    if (typeof pLoader.ieVersion != "undefined" && pLoader.ieVersion < 10) {

        var xdr = new XDomainRequest(); // Use Microsoft XDR
        xdr.open('get', url);
        xdr.onload = function () {
            successCallback(xdr.responseText); // internal function
        };

        xdr.onerror = function (e) {
            console.log(e);
        };

        xdr.send();
    }
    // Do normal AJAX for everything else
    else {
        var xhrRequest = new XMLHttpRequest();

        xhrRequest.open("GET", url, true);

        xhrRequest.onreadystatechange = function () {
            if (xhrRequest.readyState == 4) {
                successCallback(xhrRequest.responseText);
            }
        }
        xhrRequest.send();
    }
}

pLoader.nativeExtendObject = function (a, b) {
    for (var key in b)
        if (b.hasOwnProperty(key))
            a[key] = b[key];
    return a;
}

pLoader.getCascadingJson = function (type, api_key, cb, isCurrencyFile) {
    isCurrencyFile = !! isCurrencyFile ;


    var basePath = pLoader.conigurationsServer;
    if(isCurrencyFile) {
        basePath = pLoader.currenciesServer;
    }
    
    var result = {};
    var firstLevelName = type + "_default";
    // Second level summary: WPP = Word Press Plugin, FBP = FaceBook Page, SDK = SDK, CRX = CRX
    var secondLevelName = type + "_" + api_key.substring(0, 3);
    var thirdLevelName = type + "_" + api_key;
    // Get first level JSON
    pLoader.crossDomainAjax(basePath + firstLevelName + ".json", function (data) {
        result = JSON.parse(data);
        function getThirdLevel() {
            pLoader.crossDomainAjax(basePath + thirdLevelName + ".json", function (data) {
                try {
                    result = pLoader.nativeExtendObject(result, JSON.parse(data))
                } catch (ex) {

                }
                cb(result);

            })
        }

        function getSecondLevel() {
            pLoader.crossDomainAjax(basePath + secondLevelName + ".json", function (data) {
                try {
                    result = pLoader.nativeExtendObject(result, JSON.parse(data))
                } catch (ex) {

                }
                getThirdLevel();

            })
        }

        getSecondLevel();
    })

}

pLoader.generateHash = function () {
    return 'yxxx-yxxx-yxxx-yxxx-yxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

pLoader.insertPriority = function (params) {
    var currentOrder = JSON.parse(pLoader.readCookie("p_prio_delim"));
    if (currentOrder == null) {
        currentOrder = [];
    }
    currentOrder.push(params);
    return currentOrder;
}

pLoader.updatePriorityField = function (originArray, objKey, keyToUpdate, value) {
    originArray.forEach(function (item) {
        if (item.key == objKey) {
            item[keyToUpdate] = value;
        }
    })
}

pLoader.reInit = function (jsonConfig, initDoneCB) {
    if (typeof initDoneCB == "function") {
        pLoader.initDoneCB = initDoneCB;
    }
    pLoader.getCascadingJson('branding', jsonConfig, function (data) {
        var ratioSwitcher = pLoader.data.brandingDetails.fitToRatio;
        pLoader.data.brandingDetails = data;
        pLoader.data.brandingDetails.fitToRatio = ratioSwitcher;
        pLoader.fetchPricingJSON(jsonConfig, false);
    });
    pLoader.data.ratioJsonKey = jsonConfig;
};

pLoader.initiate = function (api_key, appProxy, overlayMode, onDemand, initDoneCB, adittionalParams) {
    adittionalParams = adittionalParams || {};
    pLoader.data.isInited = false;
    pLoader.data.initSdkTimeoutCounter = 0;
    // Before anything, get session cookie or create it if it doesn't exist
    var psid = pLoader.readCookie('psid');
    if (psid == null) {
        psid = pLoader.generateHash();
        pLoader.createCookie('psid', psid, 0);
    }

    if (typeof initDoneCB == "function") {
        pLoader.initDoneCB = initDoneCB;
    }

    if (typeof overlayMode != "undefined" && overlayMode != null && overlayMode != false) {
        pLoader.overlayMode = true;
    }

    pLoader.onDemandURL = onDemand;

    pLoader.data.api_key = api_key;

    function executeInit() {

        if (typeof appProxy != "undefined" && appProxy != null) {
            pLoader.appProxy = appProxy;
        }

        function cb(data) {
            pLoader.data.brandingDetails = data;
            pLoader.data.brandingDetails.sub_brand = api_key;

            if (!!adittionalParams.lang) {
                pLoader.setTranslateTable(adittionalParams.lang);
            } else {
                pLoader.setTranslateTable();
            }

            pLoader.appendedAjaxData = {
                api_key: api_key,
                l_version: pLoader.metadata.version
            };

            if (typeof appProxy != "undefined" && appProxy != "") {
                pLoader.appendedAjaxData.brand = appProxy;
            } else {
                pLoader.appendedAjaxData.brand = api_key;
            }


            if (pLoader.data.brandingDetails.whiteListedOrigins.indexOf("*") != -1 || pLoader.data.brandingDetails.whiteListedOrigins.indexOf(document.location.origin) != -1) {
                console.log("Initializing async fetching of other resources...");
                pLoader.fetchPricingJSON(api_key, true,adittionalParams.currency);

            } else {
                console.log("Unauthorized domain.");
            }
        }

        pLoader.getCascadingJson('branding', api_key, cb);
    }

    if (typeof pLoader.ieVersion == "undefined" || pLoader.ieVersion >= 10) {
        executeInit();
    } else {
        console.log('incomptible browser');
    }
};

/**
 * return the cookie value for the given cookie name
 * @param cname the name of the cookie
 * @returns {string} the value of the cookie named {cname}
 */
pLoader.getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

/**
 * set the selected language and its language table
 * @param newLanguage {string} the new language to set for the client (Send from the what_is_pixter popup)
 * @param isUserSelected {boolean} set to true will force the changing of the language to newLanguage
 * @param cb {function} a cb function to activate when finish
 */
pLoader.setTranslateTable = function (newLanguage, isUserSelected, cb) {
    /**
     *  Translate
     *  set the language from the branding json
     *  get the appropriate language file
     */
    isUserSelected = !!isUserSelected;
    var branding = pLoader.data.brandingDetails;
    var langCookie = pLoader.getCookie('p_lang');
    var browserLang = navigator.language || navigator.userLanguage;

    if (!!newLanguage && isUserSelected) {
        pLoader.data.language = newLanguage;
    } else if (!!langCookie) {
        pLoader.data.language = langCookie
    } else if (!!(newLanguage && !isUserSelected)) {
        // console.log('integrationLine');
        pLoader.data.language = newLanguage;
    } else if (!!(branding.language)) {
        //TODO : Change to defaultLanguge
        pLoader.data.language = branding.language
    } else if (!!browserLang) {
        pLoader.data.language = browserLang;
    } else { // Default - english
        pLoader.data.language = 'en_US';
    }
    var language = pLoader.data.language;

    pLoader.data.direction = (language == 'he_IL' || language && language.substr(0, 2) == 'ar') ? 'rtl' : 'ltr';
    
    pLoader.crossDomainAjax(pLoader.languagesServer + pLoader.data.language + ".json", function (data) {
        try {
            pLoader.data.languageTable = JSON.parse(data);
        } catch (ex) {
            pLoader.crossDomainAjax(pLoader.languagesServer + "en_US.json", function (data) {
                pLoader.data.languageTable = JSON.parse(data);
            })
        }
        /**
         * add currentLanguage to the language table
         */
        pLoader.data.languageTable['currentLanguage'] = pLoader.data.language;

        if (typeof cb === 'function')
            cb();
    });
};
/**
 *
 * @param api_key {string} the selected store Api key
 * @param fetchAssets {boolean} indicate if need to fetch the assets
 * @param newCurrency {string/null/undefined} if given than request the prices with this currency code
 */
pLoader.fetchPricingJSON = function (api_key, fetchAssets,newCurrency) {
    // Fetch pricing JSON
    pLoader.data.currentJSONKey = api_key; //DEV
    var cbCounter = 0;

    function fetchedCB() {
        cbCounter++;
        if (cbCounter < 2) {
            return;
        }
        pLoader.data.isInited = true;
        if (fetchAssets) {
            pLoader.fetchAssets();
        } else {
            if (typeof pLoader.initDoneCB == "function") {
                pLoader.initDoneCB();
            }
        }
    }

    pLoader.getCascadingJson('products', api_key, function (data) {
        var productsConfig = data;

        pLoader.data.products = productsConfig.products;
        pLoader.data.categories = productsConfig.categories;
        fetchedCB();
    });
    if(!!newCurrency){
        pLoader.setPricingPerCurrency(newCurrency,false,fetchedCB);
    }else{
        pLoader.setPricingPerCurrency(null,false,fetchedCB);
    }

};

/**
 * set the selected currency and fetching its pricing data
 * @param newCurrency {string} the new currency to set for the client (Send from the what_is_pixter popup)
 * @param isUserSelected {boolean} set to true will force the changing of the currency to newCurrency
 * @param cb {function} a cb function to activate when finish
 */

pLoader.setPricingPerCurrency = function (newCurrency, isUserSelected, cb) {
    isUserSelected = !!isUserSelected;
    var currencyName = 'USD';
    var branding = pLoader.data.brandingDetails;
    var currencyCookie = pLoader.getCookie('p_currency');

    if (!!newCurrency && isUserSelected) {
        //console.log('selected by user drop-down')
        currencyName = newCurrency;
    } else if (!!currencyCookie) {
        currencyName = currencyCookie
    } else if (!!(newCurrency && !isUserSelected)) {
        // console.log('integrationLine');
        currencyName = newCurrency;
    } else if (!!(branding.currency)) {
        currencyName = branding.currency
    }
    pLoader.data.currencyName = currencyName;
    //TODO: After the change the following should be called to get the pricing in new currency and the UI needs to be updated.
    // Get the products JSON as well while fetching assets
    pLoader.getCascadingJson('pricing_'+pLoader.data.currencyName, pLoader.data.api_key, function (data) {
        pLoader.data.pricing = data;
        if (!!pLoader.pLogic) {
            pLoader.pLogic.currency = pLoader.data.pricing.currency.sign;
            pLoader.pLogic.currencyName = pLoader.data.pricing.currency.name;
        }
        if(typeof cb === 'function'){
            cb();
        }

    },true);
};

pLoader.fetchAssets = function () {
    // First, get the file manifest to run by:
    function cb() {
        if (typeof chrome != "undefined" && typeof chrome.extension != "undefined") {
            console.log('scanning page for images from extension');
            if (typeof pLoader.onDemandURL == "undefined") {
                pLoader.initExtension();
            }
        } else {
            console.log('scanning page for images from loader');
            pLoader.injectCoreFiles();
        }
    }

    pLoader.crossDomainAjax(pLoader.assetsServer + "configurations/assets_manifest.json", function (data) {
        var assetsManifest = JSON.parse(data);
        pLoader.data.assetsList = assetsManifest;
        // Once we have it, preload the statics first, and async-ly, fetch the core files
        cb();
        pLoader.preLoadStatics();
    });

};

/** Pre load images
 * Will load the alwaysLoad assets and the default/specificApi assets according to the entries in the statics
 * @param {string/undefined} apiKey
 * @return undefined
 */

pLoader.preLoadStatics = function (apiKey) {
    if (!pLoader.loadedAssets) {
        pLoader.loadedAssets = {};
    }
    var baseApiKey = 'default';
    var secondApiKey = '';
    /**
     * If the given api got a special assets (Is in the statics object)
     * @param {string} pLoader.appendedAjaxData.api_key - the Base store Api
     */
    if (!!pLoader.data.assetsList.statics[pLoader.appendedAjaxData.api_key]) {
        if (!!apiKey) {
            if (apiKey !== pLoader.data.assetsList.statics[pLoader.appendedAjaxData.api_key].defaultApi) {
                secondApiKey = apiKey;
                baseApiKey = pLoader.appendedAjaxData.api_key;
            } else {
                baseApiKey = 'default';
            }
        } else {
            //Load the alwaysLoad assets of this api
            if (!pLoader.loadedAssets.loadedApiAlwaysLoad) {
                pLoader.loadedAssets.loadedApiAlwaysLoad = true;
                preLoadAssets(pLoader.appendedAjaxData.api_key, 'alwaysLoad');
            }
            baseApiKey = '';
        }
    }
    /**
     * Load only if not loaded before
     */
    if (!pLoader.loadedAssets.alwaysLoad) {
        preLoadAssets('alwaysLoad');
        pLoader.loadedAssets.alwaysLoad = true;
    }
    /**
     * Pre load the assets only if there is a assets name to load and if not loaded before
     */
    if (baseApiKey !== '' && pLoader.loadedAssets.loadedApi !== baseApiKey) {
        pLoader.loadedAssets.loadedApi = baseApiKey;
        preLoadAssets(baseApiKey, secondApiKey);
    }
};

function preLoadAssets(firstApiKey, secondApiKey) {
    if (!pLoader.data.assetsList.statics[firstApiKey]) {
        return;
    }
    var staticsArray = pLoader.data.assetsList.statics[firstApiKey];
    if (!!secondApiKey) {
        staticsArray = pLoader.data.assetsList.statics[firstApiKey][secondApiKey];
    }
    var loopLength = staticsArray.length;

    var i = 0;

    for (i; i < loopLength; i++) {
        var tmpImg = new Image();
        tmpImg.src = pLoader.assetsServer + pLoader.data.assetsList.staticsBaseURL + staticsArray[i];
    }

}

pLoader.injectCoreFiles = function () {
    var body = document.getElementsByTagName('body')[0];
    var cacheBuster = "?cbr=" + new Date().getTime();

    // Inject the CSS files first:
    var CSSLoopLength = pLoader.data.assetsList.css.length;
    var i = 0;
    for (i; i < CSSLoopLength; i++) {
        var s = document.createElement('link');
        s.setAttribute('type', 'text/css');
        s.setAttribute('rel', 'stylesheet');
        s.setAttribute('href', pLoader.assetsServer + pLoader.data.assetsList.css[i] + cacheBuster);
        body.appendChild(s);
    }

    // Append the framework first:
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'text/javascript');
    scriptTag.setAttribute('async', '');
    scriptTag.setAttribute('src', pLoader.assetsServer + pLoader.data.assetsList.scripts[0] + cacheBuster);
    body.appendChild(scriptTag);

    scriptTag.onload = function () {
        // When the framework is ready, append the other scripts:
        var JSLoopLength = pLoader.data.assetsList.scripts.length;
        var x = 1;
        if (x == JSLoopLength) {
            // All scripts were appended before
            if (typeof pLoader.initDoneCB == "function") {
                pLoader.initDoneCB();
            }
            if (typeof pLoader.onDemandURL == "object") {
                pLoader.initOnDemand(pLoader.onDemandURL);
            }
        } else {
            for (x; x < JSLoopLength; x++) {
                var scriptTag = document.createElement('script');
                scriptTag.setAttribute('type', 'text/javascript');
                scriptTag.setAttribute('async', '');
                scriptTag.setAttribute('src', pLoader.assetsServer + pLoader.data.assetsList.scripts[x]);
                body.appendChild(scriptTag);
                if (x == JSLoopLength - 1) {
                    if (typeof pLoader.initDoneCB == "function") {
                        scriptTag.onload = pLoader.initDoneCB;
                    }
                    if (typeof pLoader.onDemandURL == "object") {
                        pLoader.initOnDemand(pLoader.onDemandURL);
                    }
                }
            }
        }

    }
}

