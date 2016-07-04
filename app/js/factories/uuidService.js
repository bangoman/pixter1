/**
 * Created by ori on 04/07/16.
 */
angular.module('app').factory('uuidService', function($cookies){
    var ids = {};

    return {getId:getId};

    function getId(key) {
        if( !ids[key] ){
            if( $cookies.get(key + '_id') ){
                ids[key] = $cookies.get(key + '_id');
            }else{
                ids[key] = generateHash();
                $cookies.put(key + '_id',ids[key]);
            }
        }
        return ids[key];
    }

    function generateHash() {
        return 'yxxx-yxxx-yxxx-yxxx-yxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
});