/**
 * Created by ori on 28/09/16.
 */
'use strict';
var copy = require('recursive-copy');
var deleteEmpty = require('delete-empty');

copy('src','dist',{
    overwrite: true,
    filter:function (fileName) {
        return fileName.substr(fileName.length - 3) !== '.js';
    },
})
    .then(res => {
        return deleteEmpty('./dist',function (err) {
            if( err ){
                throw err;
            }
        });
    });