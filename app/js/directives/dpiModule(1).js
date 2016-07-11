var dpiApp = angular.module('dpiApp', []);

dpiApp.factory('imgGet',['$q', function($q) {

    return function (url, printWidth, printHeight){
    			var p = $q.defer();
    			var result;
	    		var img = new Image();
	   				img.src = url;
			    img.onload = function() {
			    	if((this.width / printWidth) > 100 && (this.height /printHeight) > 100) {
			    		result = true;
			    	}
			    	else{
			    		result = false;
			    	}
			    	p.resolve(result);
				};

				return p.promise;
    }

}]);