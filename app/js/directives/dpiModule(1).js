angular.module('app').factory('dpiCheck',['$q', function($q) {


    

    return function (imgWidth, imgHieght, printWidth, printHeight, minDpi){
    	var result;
    	if((imgWidth / printWidth) > minDpi && (imgHeight / printHeight) > minDpi) {
    		result = true;
    	}
    	else{
    		result = false;
    	}
    	return result;
	};

}]);