/**
 * Created by ori on 04/07/16.
 */
angular.module('app').factory('apiService',function ($http) {
    function request(endPoint,data) {
        $http.get(endPoint,data);
    }
});