var Server = require('karma').Server;
var path = require('path');

module.exports = function(gulp, settings, config) {

    gulp.task('karma', function(done) {
        new Server({
            configFile: path.resolve('karma.conf.js')
        }, done()).start();
    });
};
