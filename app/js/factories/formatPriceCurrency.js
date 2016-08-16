angular.module('app').factory('formatPriceCurrency',function(){

    return function (price, currency){
      
            if(currency == "$"){            
                return (currency + price); 
            }
            else{

                return (price + currency);
            }
        }

        

    

   
    

});