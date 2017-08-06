var globalPath = {
  app: "./src/",
  bower: "./bower_components/",
  thirdparty: "./3rdparty/"
};

module.exports = {
  app: {
    base: globalPath.app,
    html: [
      globalPath.app + ".htaccess",
      globalPath.app + "**/*.html",
      globalPath.app + "**/favicon/*.*",
      globalPath.app + "**/*.svg"
    ],
    sass: [
      globalPath.app + '**/*.scss'
    ],
    img: [
      globalPath.app + "img/**/*",
    ],
    tests: [
      globalPath.app + "**/*_test.js"
    ]
  },
  libs: {
    script: [
      globalPath.bower + 'jquery/dist/jquery.min.js',
      globalPath.bower + 'angular/angular.js',
      globalPath.bower + 'angular-route/angular-route.js',
      globalPath.bower + 'angular-sanitize/angular-sanitize.min.js',
      globalPath.bower + 'angular-ui-router/release/angular-ui-router.js',
      globalPath.bower + 'angular-aria/angular-aria.js',
      globalPath.bower + 'angular-animate/angular-animate.js',
      globalPath.bower + 'raven-js/dist/raven.js',
      globalPath.bower + 'raven-js/dist/plugins/angular.js',
      globalPath.bower + 'lodash/dist/lodash.min.js',
      globalPath.bower + 'moment/min/moment-with-locales.min.js',
      globalPath.bower + 'checklist-model/checklist-model.js',
      globalPath.bower + 'angular-recaptcha/release/angular-recaptcha.js',
      globalPath.bower + 'angular-hotkeys/build/hotkeys.min.js',
      // Auth0 scripts
      globalPath.bower + 'auth0-lock/build/lock.js',
      globalPath.bower + 'angular-lock/dist/angular-lock.js',
      globalPath.bower + 'angular-jwt/dist/angular-jwt.js',
      // ---
      globalPath.bower + 'angular-autogrow/angular-autogrow.min.js',
      globalPath.bower + 'angular-bootstrap/ui-bootstrap-tpls.min.js',
      globalPath.bower + 'toastr/toastr.min.js',
      globalPath.bower + 'ng-csv/build/ng-csv.min.js'
    ],
    css: [
      globalPath.bower + 'bootstrap/dist/css/bootstrap.min.css',
      globalPath.bower + 'font-awesome/css/font-awesome.min.css',
      globalPath.bower + 'angular-bootstrap/ui-bootstrap-csp.css',
      globalPath.bower + 'angular-hotkeys/build/hotkeys.min.css',
      globalPath.bower + 'toastr/toastr.min.css'
    ],
    fonts: [
      globalPath.bower + 'font-awesome/fonts/*.*'
    ],
    sass: []
  },
  dist: "./dist/"
};