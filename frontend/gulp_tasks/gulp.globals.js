const gulp = require('gulp');
const template = require('gulp-template');
const rename = require("gulp-rename");


module.exports = function (gulp, settings, config) {

    gulp.task('globals', () =>
        gulp.src('src/core/globals.ts.template')
            .pipe(template(settings))
            .pipe(rename('globals.ts'))
            .pipe(gulp.dest('src/core'))
    );
};
