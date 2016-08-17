/**
 * Created by ori on 17/08/16.
 */
const fs = require('mz/fs');
const path = require('path');

const time = (new Date()).getTime();
fs.readFile(path.resolve(__dirname,'../index.template.html'),'utf8')
    .then(function (html) {
        fs.writeFile(path.resolve(__dirname,'../index.html'),html.replace(/RANDOM/g,time));
    },function (err) {
        console.error(err);
    });