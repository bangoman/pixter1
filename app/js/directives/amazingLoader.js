angular.module('app').directive('amazingLoader', function () {

    return{
        scope: {
            loaderColor: '=',
            loaderIsActive:'='
        },
        controller: function ($scope,$rootScope){
            console.log($scope.loaderColor,"!!!");

            $scope.$watch('loaderIsActive', function () {
            });
            $scope.$watch('loaderColor', function () {
                console.log("color:" , $scope.loaderColor);


            });
            $scope.getLoaderColor = function(){
                return $scope.loaderColor;
            }

     
        },
        templateUrl:'app/js/directives/amazingLoader.html'  
    };
});
