
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();

const LessPluginCleanCSS = require('less-plugin-clean-css');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const cleancss = new LessPluginCleanCSS({ advanced: true });
const autoprefix= new LessPluginAutoPrefix({ browsers: ["last 4 versions"] });

const config = require('./config.json');

gulp.task('default', plugins.taskListing);

gulp.task('js', function() {
  return gulp.src(config.paths.orderedJs)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel({
      presets: ['es2015']
    }))
    .pipe(plugins.concat('main.js'))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function() {
  return gulp.src('app/less/main.less')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less({
      plugins: [cleancss, autoprefix]
    }))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function () {
  var jsWatcher = gulp.watch(config.paths.js, ['js']);
  var cssWatcher = gulp.watch(config.paths.css, ['css']);
  jsWatcher.on('change', watchLog);
  cssWatcher.on('change', watchLog);
  function watchLog(event) {
    console.log('Event type: ' + event.type); // added, changed, or deleted
    console.log('Event path: ' + event.path); // The path of the modified file
  }
});

