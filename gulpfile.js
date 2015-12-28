
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();

gulp.task('default', plugins.taskListing);

gulp.task('js', function() {
  return gulp.src('app/**/*.js')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel({
      presets: ['es2015']
    }))
    .pipe(plugins.concat('main.js'))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function (cb) {
  var watcher = gulp.watch('app/**/*.js', ['js']);
  watcher.on('change', function (event) {
    console.log('Event type: ' + event.type); // added, changed, or deleted
    console.log('Event path: ' + event.path); // The path of the modified file
  });
});

