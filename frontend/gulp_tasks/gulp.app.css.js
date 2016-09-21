var concat = require('gulp-concat');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function(gulp, settings, config) {

    gulp.task('app.css', 'Process the app scss', function() {
        return gulp.src(config.app.sass)
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('css/', {
                cwd: config.dist
            }));
    });

};
