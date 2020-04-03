var gulp = require('gulp-help')(require('gulp'));
var gulpSequence = require('gulp-sequence');

var settings = require('./gulp_tasks/gulp.settings')();
var config = require('./gulp_tasks/gulp.config');
var browserSync = require('browser-sync').create();

require('./gulp_tasks/gulp.globals')(gulp, settings, config);
require('./gulp_tasks/gulp.copy')(gulp, settings, config);
require('./gulp_tasks/gulp.karma')(gulp, settings, config);
require('./gulp_tasks/gulp.libs.script')(gulp, settings, config);
require('./gulp_tasks/gulp.libs.css')(gulp, settings, config);
require('./gulp_tasks/gulp.app.css')(gulp, settings, config);
require('./gulp_tasks/gulp.ts')(gulp, settings, config);

require('./gulp_tasks/gulp.serve')(gulp, settings, config, browserSync);

// define tasks here
gulp.task('default', ['ts', 'libs.script', 'libs.css', 'libs.fonts', 'app.css', 'copy'], function(done) {
  done();
});

gulp.task('watch', function() {
  gulpSequence('default', 'serve', 'karma', function() {
    gulp.watch('src/**/*.ts', ['ts']);
    gulp.watch('src/**/*.html', ['copy']);
    gulp.watch(config.app.sass, ['app.css']);
  });
});
