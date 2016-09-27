angular.module('app').directive('amazingLoader', function () {

    return{
        scope: {
            loaderColor: '=',
            loaderIsActive:'='
        },
        controller: function ($scope,$rootScope){

            $scope.$watch('loaderIsActive', function () {
            });
            $scope.$watch('loaderColor', function () {
            });
            $scope.getLoaderColor = function(){
                return $scope.loaderColor;
            }

     
        },
        templateUrl:'app/js/directives/amazingLoader.html'  
    };
});
