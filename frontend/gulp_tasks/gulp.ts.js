var gulp = require('gulp');
var ts = require('gulp-typescript');


module.exports = function(gulp, settings, config) {

    gulp.task('ts', ['globals'], function() {

        var tsProject = ts.createProject('src/tsconfig.json');

        var tsResult = tsProject.src()
            .pipe(ts(tsProject));

        return tsResult.js.pipe(gulp.dest('.'));
    });
}
