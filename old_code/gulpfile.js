var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace-task');
var sass = require('gulp-sass');
var fs = require('fs');
var bump = require('gulp-bump');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var mergeStream = require('merge-stream');
var Q = require('q');
var clean = require('gulp-clean');
var jsonminify = require('gulp-jsonminify');


var versionId = 'not_yet_set';

/**
 * Cut the staging and dev number and replace the dots with underscore
 */

var url = '';
var currenciesUrl = '';
var configUrl = '';
var staticsUrl = '';
var languagesUrl = '';

var jsfileName = 'pixter_script_o.js';

/***********VERSION BUMP****************/
/**
 * FOR dev
 */
gulp.task('bumpDev', function () {
    return gulp.src('./package.json')
        .pipe(bump({type: 'prerelease'}))
        .pipe(gulp.dest('./'));
});

/**
 * For staging
 */

gulp.task('bumpStage', function () {
    return gulp.src('./package.json')
        .pipe(bump({type: 'patch'}))
        .pipe(gulp.dest('./'));
});

/**
 * For Production
 */
gulp.task('bumpProd', function () {
    return gulp.src('./package.json')
        .pipe(bump({type: 'minor'}))
        .pipe(gulp.dest('./'));
});


/***********SET VARIABLES****************/
gulp.task('setDev', ['bumpDev'], function () {
    url = 'dist';
    currenciesUrl = url + '/configurations/currencies/';
    configUrl = url + '/configurations/';
    staticsUrl = url ;
    languagesUrl = url +'/languages/' ;
    versionId = '';
});

gulp.task('setQa', function () {
    var baseServerUrl = 'https://pixter-loader-assets.s3.amazonaws.com/';
    url = baseServerUrl + 'v1_qa';
    currenciesUrl = baseServerUrl + 'v1_pricing_stg/';
    configUrl = baseServerUrl + 'v1_configurations_stg/';
    staticsUrl = baseServerUrl+'v1_statics_stg';
    languagesUrl = baseServerUrl + 'languages_stg/' ;
    versionId = '';
});
/*
 TODO : CRX
 gulp.task('setCRX', function () {
 url = '/PixterCRX/dev/testAssets';
 versionId = '';
 });
 */

gulp.task('setStage', ['bumpStage'], function () {
    var queue = Q.defer();
    var packageJson = JSON.parse(fs.readFileSync('./package.json'));
    url = 'https://pixter-loader-assets.s3.amazonaws.com/';
    currenciesUrl = url +'v1_pricing_stg/';
    configUrl = url + 'v1_configurations_stg/';
    staticsUrl = url +'v1_statics_stg';
    languagesUrl = url + 'languages_stg/' ;
    versionId = packageJson.version;
    versionId = versionId.replace(/(.*\..*\..*)\-.*/, '$1');
    versionId = versionId.replace(/\./g, '_').concat('_stg');
    setTimeout(function () {
        queue.resolve();
    }, 1);
    return queue.promise;
});

gulp.task('setProd', ['bumpProd'], function () {
    var queue = Q.defer();
    var packageJson = JSON.parse(fs.readFileSync('./package.json'));
    url = 'https://pixter-loader-assets.s3.amazonaws.com/';
    currenciesUrl = url +'v1_pricing/';
    configUrl = url +'v1_configurations/';
    staticsUrl = url+ 'v1_statics';
    languagesUrl = url + 'languages/' ;
    versionId = packageJson.version;
    versionId = versionId.replace(/(.*\..*)\..*/, '$1');
    versionId = versionId.replace(/\./g, '_');
    setTimeout(function () {
        queue.resolve();
    }, 1);
    return queue.promise;
});

gulp.task('setPatch', ['bumpStage'], function () {
    var queue = Q.defer();
    var packageJson = JSON.parse(fs.readFileSync('./package.json'));
    url = 'https://pixter-loader-assets.s3.amazonaws.com/';
    currenciesUrl = url +'v1_pricing/';
    configUrl = url +'v1_configurations/';
    staticsUrl = url+ 'v1_statics';
    languagesUrl = url + 'languages/' ;
    versionId = packageJson.version;
    versionId = versionId.replace(/(.*\..*\..*)/, '$1');
    versionId = versionId.replace(/\./g, '_');
    setTimeout(function () {
        queue.resolve();
    }, 1);
    return queue.promise;
});



/***********BUILD CSS FROM SASS****************/
gulp.task('sassProd', function () {
    return gulp.src('scss/style.scss')
        .pipe(replace(
            {
                patterns: [
                    {
                        match: /\$extensionID\:.*;/g,
                        replacement: '$extensionID:"' + url + versionId + '/files";'
                    }
                ]
            }
        ))
        .pipe(sass.sync())
        .pipe(gulp.dest('dist/files/css'));
});

gulp.task('sass', function () {
    return gulp.src('scss/style.scss')
        .pipe(sass.sync())
        .pipe(gulp.dest('dist/files/css'));
});

gulp.task('sassWatch', function () {
    gulp.watch('scss/**.scss', ['sass']);
});

/***********BUILD JS****************/

gulp.task('buildJsProd', function () {
    var filePath = "scripts/";
    return gulp.src([
            filePath + 'p_framework.js',
            filePath + 'script.js'
        ])
        .pipe(replace({
            patterns: [
                {
                    match: /pLoader.pLogic.baseServerURL.*=.*;/g,
                    replacement: "pLoader.pLogic.baseServerURL = 'https://api.pixter-media.com/';"
                },
                {
                    match: /pLoader.pLogic.uploadServerURL.*=.*;/g,
                    replacement: "pLoader.pLogic.uploadServerURL = 'https://upload.pixter-media.com/';"
                },
                {
                    match: /pLoader.pLogic.proxyServerURL.*=.*;/g,
                    replacement: "pLoader.pLogic.proxyServerURL = 'https://crx-proxy.pixter-media.com/';"
                }
            ]
        }))
        .pipe(concat(jsfileName))
        .pipe(replace({
            regex: 'pLogic',
            replace: '_plg'
        }))
        .pipe(replace({
            regex: 'cropTool',
            replace: '_$pixcrpt'
        }))
        .pipe(replace({
            regex: 'pixQuery',
            replace: '_pixLib'
        }))
        .pipe(uglify({mangle: true}))
        .pipe(gulp.dest('dist/files/scripts'))
});

gulp.task('buildJsStage', function () {
    var filePath = "scripts/";
    return gulp.src([
            filePath + 'p_framework.js',
            filePath + 'script.js'
        ])
        .pipe(replace({
            patterns: [
                {
                    match: /pLoader.pLogic.baseServerURL.*=.*;/g,
                    replacement: "pLoader.pLogic.baseServerURL = 'https://api-sg.pixter-media.com/';"
                },
                {
                    match: /pLoader.pLogic.uploadServerURL.*=.*;/g,
                    replacement: "pLoader.pLogic.uploadServerURL = 'https://upload-sg.pixter-media.com/';"
                },
                {
                    match: /pLoader.pLogic.proxyServerURL.*=.*;/g,
                    replacement: "pLoader.pLogic.proxyServerURL = 'https://crx-proxy.pixter-media.com/';"
                }
            ]
        }))
        .pipe(concat(jsfileName))
        .pipe(replace({
            regex: 'pLogic',
            replace: '_plg'
        }))
        .pipe(replace({
            regex: 'cropTool',
            replace: '_$pixcrpt'
        }))
        .pipe(replace({
            regex: 'pixQuery',
            replace: '_pixLib'
        }))
        .pipe(uglify({mangle: true}))
        .pipe(gulp.dest('dist/files/scripts'))
});

gulp.task('buildJsQa', function () {
    var filePath = "scripts/";
    return gulp.src([
            filePath + 'p_framework.js',
            filePath + 'script.js'
        ])
        .pipe(replace({
            patterns: [
                {
                    match: /pLoader.pLogic.baseServerURL.*=.*;/g,
                    replacement: "pLoader.pLogic.baseServerURL = 'https://api-sg.pixter-media.com/';"
                },
                {
                    match: /pLoader.pLogic.uploadServerURL.*=.*;/g,
                    replacement: "pLoader.pLogic.uploadServerURL = 'https://upload-sg.pixter-media.com/';"
                },
                {
                    match: /pLoader.pLogic.proxyServerURL.*=.*;/g,
                    replacement: "pLoader.pLogic.proxyServerURL = 'https://crx-proxy.pixter-media.com/';"
                }
            ]
        }))
        .pipe(concat(jsfileName))
        .pipe(replace({
            regex: 'pLogic',
            replace: '_plg'
        }))
        .pipe(replace({
            regex: 'cropTool',
            replace: '_$pixcrpt'
        }))
        .pipe(replace({
            regex: 'pixQuery',
            replace: '_pixLib'
        }))
        .pipe(gulp.dest('dist/files/scripts'))
});

gulp.task('buildJsDev', function () {
    return gulp.src(['./scripts/script.js', './scripts/p_framework.js'])
        .pipe(gulp.dest('dist/files/scripts/'));
});
/*******************************MINIFY IMAGES****************************************/

gulp.task('imagemin', function () {
    return gulp.src('images/**/*.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/files/images/'))
});

gulp.task('copyImages', function () {
    return gulp.src('images/**/*.*')
        .pipe(gulp.dest('dist/files/images/'))
});
/******************************COPY****************************************/

/**
 * Copy the assets_manifest and change the scripts array to the file gulp output
 * remove the pLoader.data.currentJSONKey = api_key line in loader.js
 */


gulp.task('copyAssetsProd', function () {
    var assetsManifest = gulp.src(['./configurations/assets_manifest.json'])
        .pipe(replace(
            {
                patterns: [
                    {
                        match: /("scripts.*\[)(?:[\n,\r\n].*?)+(\])/gm,
                        replacement: '$1 "files/scripts/' + jsfileName + '" $2'
                    }
                ]
            }
        ))
        .pipe(gulp.dest('dist/configurations/'));
    var loaderJs = gulp.src(['./dist/loader.js'])
        .pipe(replace(
            {
                patterns: [
                    {
                        match: /pLoader.data.currentJSONKey.*=.*;/,
                        replacement: ''
                    }
                ]
            }
        ));
    return mergeStream(assetsManifest, loaderJs);

});
//Only copy the assets_manifest and the loader
gulp.task('copyAssets', function () {
    return gulp.src(['./configurations/assets_manifest.json'])
        .pipe(gulp.dest('dist/configurations/'));

});

gulp.task('copyCurrencies',function () {
    var currencyJsons = gulp.src(['./configurations/pricing/currencies/*.json']).pipe(gulp.dest('dist/configurations/currencies/'));
    return mergeStream(currencyJsons);
});

gulp.task('copyConfigurations',function(){
    var brandingJsons = gulp.src(['./configurations/branding/*.json'])
        .pipe(replace(
            {
                patterns: [
                    {
                        match: /("ossMessage".*src=.*').*(\/files\/images.*'.*\/>.*,)/g,
                        replacement: '$1' + staticsUrl + '$2'
                    }
                ]
            }
        )).pipe(gulp.dest('dist/configurations/'));
    var productsJsons = gulp.src([ './configurations/products/*.json'])
        .pipe(gulp.dest('dist/configurations/'));
    var languages = gulp.src(['./configurations/languages/*.json'])
        .pipe(gulp.dest('dist/languages/'));
    return mergeStream(brandingJsons, productsJsons, languages);

});

gulp.task('copy', function () {
   
    var loaderJs = gulp.src(['./scripts/loader.js'])
        .pipe(replace(
            {
                patterns: [
                    {
                        match: /pLoader.assetsServer.*=.*;/,
                        replacement: 'pLoader.assetsServer = "' + url + versionId + '/";'
                    },
                    {
                        match: /pLoader.currenciesServer.*=.*;/,
                        replacement: 'pLoader.currenciesServer = "' + currenciesUrl + '";'
                    },
                    {
                        match: /pLoader.conigurationsServer.*=.*;/,
                        replacement: 'pLoader.conigurationsServer = "' + configUrl + '";'
                    },
                    {
                        match: /pLoader.languagesServer.*=.*;/,
                        replacement: 'pLoader.languagesServer = "' + languagesUrl + '";'
                    }
                ]
            }
        ))
        .pipe(gulp.dest('dist/'));
    var fonts = gulp.src(['./fonts/**/**.*'])
        .pipe(gulp.dest('dist/files/fonts/'));
    var partials = gulp.src(['./partials/**/*.html'])
        .pipe(gulp.dest('dist/files/partials/'));
    return mergeStream(loaderJs, fonts, partials);
});

gulp.task('del', function () {
    return gulp.src('./dist').pipe(clean());
});

gulp.task('copyLoaderQa', function () {
    return gulp.src('./dist/loader.js')
        .pipe(rename('./dist/loader_qa.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('copyLoaderStage', function () {
    return gulp.src('./dist/loader.js')
        .pipe(rename('./dist/loader_stg.js'))
        .pipe(gulp.dest('.'));
});


gulp.task('copyLoaderProd', function () {
    return gulp.src('./dist/loader.js')
        .pipe(rename('./dist/loader_' + versionId + '.js'))
        .pipe(gulp.dest('.'));
});


gulp.task('minifyJsons', function () {
    var configurations = gulp.src(['dist/configurations/**/*.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('dist/configurations/'));

    var languages = gulp.src(['dist/languages/*.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('dist/languages/'));

    return mergeStream(configurations, languages);
});

/******************************TASKS****************************************/

gulp.task('dev', function () {
    runSequence('del', 'setDev', 'sass', 'copyAssets', 'copy', 'copyConfigurations', 'copyCurrencies', 'buildJsDev', 'copyImages');
});

gulp.task('qa', function () {
    runSequence('del', 'setQa', 'sass', 'copyAssetsProd', 'copy', 'copyConfigurations', 'buildJsQa', 'imagemin', 'copyLoaderQa');
});

gulp.task('stage', function () {
    runSequence('del', 'setStage', 'sassProd', 'copyAssetsProd', 'copy','copyConfigurations', 'buildJsStage', 'imagemin', 'copyLoaderStage', 'minifyJsons');
});

gulp.task('patch', function () {
    runSequence('del', 'setPatch', 'sassProd', 'copyAssetsProd', 'copy','copyConfigurations', 'buildJsProd', 'imagemin', 'copyLoaderProd', 'minifyJsons');
});

gulp.task('prod', function () {
    runSequence('del', 'setProd', 'sassProd', 'copyAssetsProd', 'copy','copyConfigurations', 'buildJsProd', 'imagemin', 'copyLoaderProd', 'minifyJsons');
});

gulp.task('buildCss', ['setDev', 'sass', 'sassWatch']);



/**
 * A task to create a Ginglish file from the english file
 * Ginglish is english with 000 at the end and start of the word ( 30% of the string size)
 */
gulp.task('createGenglish', function () {
    return gulp.src('./configurations/languages/gen_US.json')
        .pipe(replace(
            {
                patterns: [
                    {
                        match: /"(.*)"( )*:( )*"(.*)"/g,
                        replacement: '"$1" : "0000$10000"'
                    }
                ]
            }
        ))
        .pipe(rename('gen_US.json'))
        .pipe(gulp.dest('dist/configurations/languages/'));
});

