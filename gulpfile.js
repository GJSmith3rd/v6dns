var $ = require('gulp-load-plugins')({ lazy: true }),
    args = require('yargs').argv,
    browserSync = require('browser-sync'),
    config = require('./gulp.config')(),
    del = require('del'),
    gulp = require('gulp'),
    port = process.env.PORT || config.nodeDefaultPort;

/*
 * SERVE-DEV
 *
 * calls serve() with parameter true
 * for development workflow
 *
 */
gulp.task('serve-dev', ['js-prep', 'css-prep', 'index-prep'], function () {
    serve();
});

/*
* INDEX-PREP
*
* minimize index.html
*
*/
gulp.task('index-prep', ['clean-index'], function () {

    log('***minimize index.html...');
    return gulp
        .src(config.srcindex)
        .pipe($.plumber())
        .pipe($.htmlmin(
            {
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                removeComments: true
            }))
        .pipe($.rename('index.html'))
        .pipe(gulp.dest(config.root));
});

/*
 * CLEAN-INDEX
 *
 * call CLEAN with file dev blob path
 *
 */
gulp.task('clean-index', function (done) {
    log('***cleaning Index...');
    clean([config.index], done);
});

/*
* JS-PREP
*
* minimize and concat js files
* Minify and copy all JavaScript (except vendor scripts)
*
*/
gulp.task('js-prep', ['clean-js'], function () {

    log('***uglify and minimize js...');
    return gulp
        .src(config.srcjs)
        .pipe($.plumber())
        .pipe($.uglify())
        .pipe($.rename('script.js'))
        .pipe($.license('MIT', {
            tiny: true,
            organization: 'mobileCreature - GJSmith3rd - Gilbert Joseph Smith III'
        }))
        .pipe(gulp.dest(config.root));
});

/*
 * CLEAN-JS
 *
 * call CLEAN with file dev blob path
 *
 */
gulp.task('clean-js', ['vet'], function (done) {
    log('***cleaning JS...');
    clean([config.js], done);
});

/*
* CSS-PREP
*
* compile less to css with gulp-less and
* autoprefix css with gulp-autoprefixer
*
*/
gulp.task('css-prep', ['clean-css'], function () {
    log('***Compiling less to css...');
    return gulp
        .src(config.srcstyles)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
        .pipe($.cssnano())
        .pipe($.license('MIT', {
            tiny: true,
            organization: 'mobileCreature - GJSmith3rd - Gilbert Joseph Smith III'
        }))
        .pipe($.rename('styles.css'))
        .pipe(gulp.dest(config.root));
});

/*
 * CLEAN-CSS
 *
 * call CLEAN with file dev blob path
 *
 */
gulp.task('clean-css', function (done) {
    log('***cleaning CSS...');
    clean([config.css], done);
});

/*
 * VET
 *
 * test js with gulp-jscs and gulp-jshint
 *
 */
gulp.task('vet', function () {
    log('***Analyzing js with jshint and jscs...');
    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'));
});

/*
 * HELP
 *
 * gulp task enumerating tasks using gulp-tasklisting
 *
 */
gulp.task('help', $.taskListing);

/*
 * DEFAULT
 *
 * gulp task assigned to default task
 *
 */
gulp.task('default', ['serve-dev']);

//////////////////////////////////////

/*
 * CLEAN
 *
 * delete files in path and return done
 *
 */
function clean(path, done) {
    log('***Cleaning ' + $.util.colors.blue(path));
    del(path, done);
}

/*
 * SERVE
 *
 * start node sever via nodemon with nodemOptions
 *
 */
function serve() {
    log('***Start pre processes and node server...');

    var nodeOptions = {
        //debug: true,
        //nodeArgs: ['--debug-brk'],
        script: config.nodeServer,
        delayTime: 15,
        env: {
            'PORT': port,
            'NODE_ENV': 'dev'
        },
        watch: [config.alljs]
    };

    return $.nodemon(nodeOptions)
        .on('restart', ['vet'], function (ev) {
            log('*** nodemon restarted...');
            log('files changes on restart:\n' + ev);
            setTimeout(function () {
                browserSync.notify('***reloading now...');
                browserSync.reload({ stream: false });
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync();
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited normally...');
        });
}

/*
 * LOG
 *
 * log output with gulp-util
 *
 */
function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/*
 * CHANGE EVENT
 *
 * log output with gulp-util
 *
 */
function changeEvent(event) {
    log('***File ' + ' ' + event.type);
}

/*
 * START BROWSERSYNC
 *
 * start browsersync server
 *
 */
function startBrowserSync() {
    //disable browserSync with --nosync arg
    if (args.nosync || browserSync.active) {
        return;
    }

    log('***Starting browserSync on port ' + port);

    gulp.watch(config.srcstyles, ['css-prep', browserSync.stream])
        .on('change', function (event) {
            changeEvent(event);
        });

    gulp.watch(config.srcjs, ['js-prep', browserSync.reload])
        .on('change', function (event) {
            changeEvent(event);
        });

    gulp.watch(config.srcindex, ['index-prep', browserSync.reload])
        .on('change', function (event) {
            changeEvent(event);
        });

    var options = {

        files: [
            config.js,
            config.index,
            config.css
        ],
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: true
        },
        injectChanges: true,
        logConnections: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: '*** browserSync',
        notify: true,
        online: true,
        open: false,
        port: 3099,
        proxy: '10.0.0.57:' + port,
        reloadDebounce: 5000,
        reloadOnRestart: true,
        reloadDelay: 5000,
        scrollRestoreTechnique: 'cookie',
        scrollProportionally: false,
        tunnel: null,
        ui: {
            port: 4099,
            weinre: {
                port: 5099
            }
        }
    };

    browserSync(options);
}
