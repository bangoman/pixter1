
chrome.storage.local.get('resKey',function(res){
    if(typeof res.resKey != "undefined"){
        pLoader.initiate(res.resKey);
    }else{
        // Pixtly CRX
       //pLoader.initiate('56CRLYABCD');

        // Pixter CRX
        pLoader.initiate('CRXPIXC');
    }
})

