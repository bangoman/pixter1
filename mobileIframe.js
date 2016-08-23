/**
 * Created by ori on 23/08/16.
 */
message('init');
window.addEventListener('message', function (e) {
    if (e.data.type == "pixter") {        
        var url = e.data.img;
        localStorage.setItem('.imageUrl', url);
        console.log('localStorage', localStorage , location.host);
        message('image_received');
    }
}, false);

function message(msg) {
    window.top.postMessage('pixter_' + msg, '*');
}