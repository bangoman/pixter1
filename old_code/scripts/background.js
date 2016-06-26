var _gaq = _gaq || [];

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

chrome.runtime.onInstalled.addListener(function (details) {
    if(details.reason == "install") {
        chrome.tabs.create({url: "http://pixter.me/thankyou.html"}, function () {

        });
    }
});

chrome.runtime.setUninstallURL('http://pixter.me/uninstall.php');


chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "pexAnalytics");
    port.onMessage.addListener(function(msg) {
        if(msg.type == "event"){
            if(typeof currentURL == "undefined" || currentURL != msg.pageURL){
                window.currentURL = msg.pageURL;
                _gaq.push(['_set', 'page', msg.pageURL]);
            }
            _gaq.push(msg.gaParams);
        }
        if(msg.type == "init"){
            _gaq.push(['_setAccount', msg.GA_ID]);
            window.currentURL = msg.pageURL;
            _gaq.push(['_setCustomVar',1,'domain',msg.domain]);
            _gaq.push(['_setCustomVar',2,'api_key',msg.api_key]);
            _gaq.push(['_setCustomVar', 3, 'ui_id', msg.ui_id]);
            _gaq.push(['_set', 'page', msg.pageURL]);
            _gaq.push(['_trackPageview']);
        }
    });
});

