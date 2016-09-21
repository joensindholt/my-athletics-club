var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var cssmin = require('gulp-cssmin');

module.exports = function(gulp, settings, config){

	gulp.task('libs.css', 'Process the css from the external libs' , function() {
		return gulp.src(config.libs.css)
			.pipe(concat('libs.css'))
			.pipe(gulpif(settings.minifyCss,cssmin()))
			.pipe(gulp.dest('css/', { cwd: config.dist }));
	});
};
