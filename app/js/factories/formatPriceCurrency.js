angular.module('app').factory('formatPriceCurrency',function(){

    return function (price, currency){

            if(currency == "$"){ 
                var p = price.toFixed(2);           
                return (currency + p); 
            }
            else{
                var p = price.toFixed(2);
                return (p + currency);
            }
        }

        

    

   
    

});