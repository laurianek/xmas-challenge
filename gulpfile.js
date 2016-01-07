
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();

const LessPluginCleanCSS = require('less-plugin-clean-css');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const cleancss = new LessPluginCleanCSS({ advanced: true });
const autoprefix= new LessPluginAutoPrefix({ browsers: ["last 4 versions"] });
const Server = require('karma').Server;

const config = require('./config.json');

gulp.task('default', plugins.taskListing);

gulp.task('build:es6', function() {
  return gulp.src(config.paths.js.es6)
    .pipe(plugins.changed('app/js/src'))
    .pipe(plugins.ngAnnotate({
      single_quotes: true
    }))
    .pipe(plugins.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('app/js/src'))
    ;
});

gulp.task('build:js', ['build:es6'], function() {
  return gulp.src(config.paths.js.ordered)
    .pipe(plugins.concat('main.js'))
    .pipe(gulp.dest('app/js'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
    ;
});

gulp.task('dist:js', ['build:js']);

gulp.task('build:css', function() {
  return gulp.src('app/less/main.less')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less({
      plugins: [cleancss, autoprefix]
    }))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('app/css'))
    .pipe(gulp.dest('dist/css'))
    ;
});
gulp.task('dist:css', ['build:css']);

gulp.task('dist:font', function() {
  return gulp.src('app/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('dist:html', function() {
  return gulp.src('app/*.html')
    .pipe(plugins.htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
      useShortDoctype: true,
      minifyURLs: {},
      minifyJS: true
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('config:reload', function(){
  return gulp.src(config.paths.buildConfig)
    .pipe( plugins.reload())
    .end();
});

gulp.task('watch', function () {
  gulp.watch(config.paths.buildConfig, ['config:reload']);
  var jsWatcher = gulp.watch(config.paths.js.es6, ['build:js']);
  var cssWatcher = gulp.watch(config.paths.css, ['build:css']);
  gulp.run('test:watch');
  jsWatcher.on('change', watchLog);
  cssWatcher.on('change', watchLog);
  function watchLog(event) {
    console.log('Event type: ' + event.type); // added, changed, or deleted
    console.log('Event path: ' + event.path); // The path of the modified file
  }
});
gulp.task('watch:dist', function () {
  gulp.watch(config.paths.buildConfig, ['config:reload']);
  var jsWatcher = gulp.watch(config.paths.js.es6, ['dist:js']);
  var cssWatcher = gulp.watch(config.paths.css, ['dist:css']);
  var htmlWatcher = gulp.watch('app/*.html', ['dist:html']);
  gulp.run('test:watch');
  jsWatcher.on('change', watchLog);
  cssWatcher.on('change', watchLog);
  htmlWatcher.on('change', watchLog);
  function watchLog(event) {
    console.log('Event type: ' + event.type); // added, changed, or deleted
    console.log('Event path: ' + event.path); // The path of the modified file
  }
});

gulp.task('test:main', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test', ['test:main'], function() {
  return gulp.src('coverage/**/*')
    .pipe(plugins.rename(function(path) {
      path.dirname = path.dirname.replace(/PhantomJS[^\/]*/g, 'PhantomJS');
    }))
    .pipe(gulp.dest('coverage'))
    ;
});

gulp.task('test:watch', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false,
    autoWatch: true
  }, done).start();
});

gulp.task('build', ['build:js','build:css']);
gulp.task('dist', ['dist:html','dist:js','dist:css','dist:font', 'test']);

