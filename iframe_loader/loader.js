(function(){
	var imgUrl,iframe;
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
			iframe = document.createElement('iframe');
			iframe.src = '../';
			iframe.style.position = 'fixed';
			iframe.style.left = '20vw';
			iframe.style.top = '20vh';
			iframe.style.width = '64vw';
			iframe.style.height = '55.7vw';
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