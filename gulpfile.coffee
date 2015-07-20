

# 開発ディレクトリ
SRC_DIR = './src'

# 公開ディレクトリ
PUBLISH_DIR = "./build";

gulp = require('gulp');

# gulp-系
$ = require('gulp-load-plugins')();

# browserify
browserify = require('browserify');
source = require('vinyl-source-stream');



# -------------------------------------------------------------------
# sass
# -------------------------------------------------------------------
gulp.task 'sass', ->
  $.rubySass(SRC_DIR + '/sass/', {
      compass:true
      sourcemap:false
      style:'compressed'})
    .pipe($.autoprefixer())
    .pipe(gulp.dest(PUBLISH_DIR + '/assets/css/'))



# -------------------------------------------------------------------
# coffee
# -------------------------------------------------------------------
gulp.task 'coffee', ->
  browserify({
    entries: [SRC_DIR + '/coffee/Main.coffee']
    extensions: ['.coffee', '.js']})
      .bundle()
      .pipe(source('main.js'))
#       .pipe($.streamify($.uglify()))
      .pipe(gulp.dest(PUBLISH_DIR + '/assets/js/'))



# -------------------------------------------------------------------
# connect
# -------------------------------------------------------------------
gulp.task 'connect', ->
  $.connect.server({
    root: PUBLISH_DIR
    port:50000})



# -------------------------------------------------------------------
# watch
# -------------------------------------------------------------------
gulp.task 'watch', ->
  gulp.watch([SRC_DIR + '/**/*.sass'], ['sass'])
  gulp.watch([SRC_DIR + '/**/*.coffee'], ['coffee'])


gulp.task 'default', ['sass', 'coffee', 'watch', 'connect']






























