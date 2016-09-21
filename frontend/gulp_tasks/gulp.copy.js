module.exports = function(gulp, settings, config) {

    gulp.task('copy', function() {
        return gulp.src(config.app.html)
            .pipe(gulp.dest('.', {
                cwd: config.dist
            }));
    });

};
