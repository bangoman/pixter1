angular.module('app').factory('formatPriceCurrency',function(){
    return{
        function formatPriceCurrency(price, currency){
            if(currency == "$"){
                return "currency" + "price"; 
            }
            else{
                return "price" + "currency";
            }
        }
       
    };

});