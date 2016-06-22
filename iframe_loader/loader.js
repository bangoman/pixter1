(function(){
	var imgDataUrl,iframe;
	window.pixter = {
		loadIframe:loadIframe,
		changeImage: changeImage,
	};

	window.addEventListener('message', function(e) {
		if( e.data === 'pixter_init' ){
			postImage();
		}
	}, false);

	function loadIframe(dataUrl){
		if( !iframe ){
			iframe = document.createElement('iframe');
			iframe.src = '../';
			iframe.style.position = 'fixed';
			iframe.style.left = '20vw';
			iframe.style.top = '20vh';
			iframe.style.width = '60vw';
			iframe.style.height = '60vh';
		}
		iframe.style.display = 'block';
		document.body.appendChild(iframe);
		changeImage(dataUrl);
	}

	function changeImage(dataUrl){
		imgDataUrl = dataUrl;
		postImage();
	}

	function postImage(){
		iframe.contentWindow.postMessage(imgDataUrl, '*');
	}
})();