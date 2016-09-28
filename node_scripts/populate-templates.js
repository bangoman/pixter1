/**
 * Created by ori on 17/08/16.
 */
const fs = require('mz/fs');
const path = require('path');

const time = Date.now();
[{
    src: 'index.template.html',
    dst: 'index.html',
}, {
    src: 'iframe_loader/loader.template.js',
    dst: 'iframe_loader/loader.js',
}].forEach(file => {
    fs.readFile(path.resolve(__dirname, '../src/',file.src), 'utf8')
        .then(function (html) {
            return fs.writeFile(path.resolve(__dirname, '../dist/',file.dst), html.replace(/__RANDOM__/g, time));
        })
        .catch(function (err) {
            console.error(err);
        });
});