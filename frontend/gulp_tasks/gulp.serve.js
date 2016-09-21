module.exports = function (gulp, settings, config, browserSync) {

    // only start server on non production environments
    if (settings.browsersync) {
        gulp.task('serve', 'Run a static Node.js server for development on port ' + settings.port, ['default'], function (done) {
            browserSync.init({
                server: {
                    baseDir: config.dist,
                    https: false
                },
                port: settings.port,
                ui: {
                    port: settings.port + 1
                },
                files: ['dist/**/*']
            });

            done();
        });
    }
};
