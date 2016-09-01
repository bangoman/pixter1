/**
 * Created by ori on 18/08/16.
 */
const fs = require('fs');
const path = require('path');

var scriptSources = [
    'app/js/localStorageCommunicator.js',
    'bower_components/ionic/release/js/ionic.bundle.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-touch/angular-touch.js',
    'bower_components/angular-carousel/dist/angular-carousel.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'bower_components/angular-cookies/angular-cookies.js',
    'bower_components/angular-local-storage/dist/angular-local-storage.js',
    'app/js/app.js',
    'app/js/config.js',
    'app/js/run/messaging.js',
    'app/js/factories/formatPriceCurrency.js',
    'app/js/factories/message.js',
    'app/js/factories/uuidService.js',
    'app/js/factories/apiService.js',
    'app/js/factories/crosstab.js',
    'app/js/directives/productImageDisplay.js',
    'app/js/directives/productParams.js',
    'app/js/directives/amazingLoader.js',
    'app/js/controllers/mainCtl.js',
    'app/js/controllers/learnMoreCtl.js',
    'app/js/controllers/shopCtl.js',
    'app/js/controllers/previewCtl.js',
    'app/js/controllers/previewCatalogCtl.js',
    'app/js/controllers/editCtl.js',
    'app/js/controllers/orderDetailsCtl.js',
    'app/js/controllers/checkoutCtl.js',
    'app/js/controllers/cuponModalCtl.js',
    'app/js/controllers/thankYouCtl.js',
    'app/js/controllers/dpiWorningModalCtl.js',
    'app/js/lib/ngDraggable.js'
];

var styles = [
    'bower_components/angular-carousel/dist/angular-carousel.css',
    'bower_components/bootstrap/dist/css/bootstrap.min.css',
    'app/css/style.css'
];

writeBundle(scriptSources,'bundle.js');
writeBundle(styles,'bundle-style.css');

function writeBundle(sources,filename) {
    var script = '';
    sources.forEach(src => {
        script += fs.readFileSync(path.resolve(__dirname, '../', src), 'utf8') + "\r\n";
    });

    fs.writeFileSync(filename,script);
}