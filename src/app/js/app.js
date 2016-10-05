var app = angular.module('app',[
    'ui.router',
    'ngAnimate',
    'ui.bootstrap',
    'angular-carousel',
    'ngDraggable',
    'ionic',
    'ngCookies',
    'LocalStorageModule',
]);

function lunchStore(image){
    window.postMessage({img: image, type: "pixter"}, '*');
}