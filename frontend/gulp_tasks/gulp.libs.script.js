var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var expect = require('gulp-expect-file');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function(gulp, settings, config) {

    gulp.task('libs.script', 'Process the scripts from the external libs', function() {
        return gulp.src(config.libs.script)
            .pipe(gulpif(settings.sourcemaps, sourcemaps.init()))
            .pipe(concat('libs.js'))
            .pipe(gulpif(settings.uglifyJs, uglify({ mangle: false })))
            .pipe(gulpif(settings.sourcemaps, sourcemaps.write('../maps')))
            .pipe(gulp.dest('js/', {
                cwd: settings.dist || config.dist
            }));
    });

    gulp.task('libs.fonts', 'Copy libs fonts to output dir', function() {
        return gulp.src(config.libs.fonts)
            .pipe(gulp.dest('fonts/', {
                cwd: settings.dist || config.dist
            }));
    });
};
