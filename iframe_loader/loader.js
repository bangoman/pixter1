(function(){
	var imgUrl,iframe,overlay;
	window.pixter = {
		loadIframe:loadIframe,
		changeImage: changeImage,
	};

	window.addEventListener('message', function(e) {
		if( e.data === 'pixter_init' ){
			postImage();
		}
	}, false);

	window.addEventListener('message', function(e) {
		if( e.data === 'pixter_close' ){
			document.body.removeChild(iframe);
			iframe = null;
		}
	}, false);

	function loadIframe(url){
		if( !iframe ){
			overlay = document.createElement('div'); 
			overlay.style.width = "100vw";
			overlay.style.height = "100vh";
			overlay.style.position = "fixed";
			overlay.style.background = "rgba(0,0,0,0.4)";
			document.body.appendChild(overlay);

			iframe = document.createElement('iframe');
			iframe.src = '../#/app/sliderShop';  //  add this:  #/app/sliderShop  to see the slideShop
			iframe.style.position = 'fixed';
			iframe.style.left = '18vw';
			iframe.style.top = '10vh';
			iframe.style.width = '64vw';
			iframe.style.height = '80vh';
		}
		document.body.appendChild(iframe);
		changeImage(url);
	}

	function changeImage(url){
		imgUrl = url;
		postImage();
	}

	function postImage(){
		iframe.contentWindow.postMessage(imgUrl, '*');
	}
})();