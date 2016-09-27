/**
 * Created by ori on 17/08/16.
 */
const fs = require('mz/fs');
const path = require('path');

const time = Date.now();
fs.readFile(path.resolve(__dirname, '../src/index.template.html'), 'utf8')
    .then(function (html) {
        return fs.writeFile(path.resolve(__dirname, '../dist/index.html'), html.replace(/__RANDOM__/g, time));
    })
    .catch(function (err) {
        console.error(err);
    });