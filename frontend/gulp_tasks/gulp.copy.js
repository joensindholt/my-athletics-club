module.exports = function(gulp, settings, config) {

    gulp.task('copy', function() {

        console.log('dist', settings.dist || config.dist);

        return gulp.src(config.app.html)
            .pipe(gulp.dest('.', {
                cwd: settings.dist || config.dist
            }));
    });

};
