module.exports = function () {

        var config = {

                //JavaScript - all js to vet
                alljs: [
                        'app.js',
                        './source/srcscript.js', 'gulp.config.js', 'gulpfile.js'
                ],

                browserReloadDelay: 3000,

                //css file location
                css: './styles.css',

                //index.html
                index: './index.html',

                //script.js
                js: './script.js',

                //node settings
                nodeDefaultPort: 7203,
                nodeServer: './app.js',

                //root directory
                root: './',

                //source files
                srcindex: './source/srcindex.html',
                srcjs: './source/srcscript.js',
                srcstyles: './source/srcstyles.less'

        };

        return config;
};
