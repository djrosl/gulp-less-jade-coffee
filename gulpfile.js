'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

// Load plugins
var $ = require('gulp-load-plugins')();

var coffee = require('gulp-coffee');

gulp.task('coffee', function() {
  gulp.src('src/scripts/*.coffee')
    .pipe(coffee({bare: true}).on('error', $.util.log))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('styles', function() {
  var browsers = [
    '> 1%',
    'last 2 versions',
    'Firefox ESR',
    'Opera 12.1'
  ];
  return gulp.src('src/**/main.styl')
    .pipe($.stylus({
      paths: ['bower_components']
    })
    .on('error', $.util.log))
    .pipe($.postcss([
        require('autoprefixer-core')({
          browsers: browsers
        })
      ]))
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('views', function(){
  return gulp.src([
      '!src/views/layout.jade',
      'src/views/*.jade'
    ])
    .pipe($.jade({
      pretty: true
    }))
    .on('error', $.util.log)
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe($.imagemin({
      svgoPlugins: [{
        convertPathData: false
      }]
    }))
    .pipe(gulp.dest('build/images'));
});


gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './build'
    }
  });
});


gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*.styl', ['styles']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch('src/**/*.jade', ['views']);
  gulp.watch('src/scripts/*.coffee', ['coffee']);

  gulp.start('browser-sync');
});

// JSHint grunfile.js
gulp.task('selfcheck', function() {
  return gulp.src('gulpfile.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'))
    .pipe($.jshint.reporter('fail'));
});


gulp.task('clean', function(cb) {
  var del = require('del');
  del(['build'], cb);
});


gulp.task('build', ['styles', 'views', 'images', 'coffee']);


gulp.task('default', ['clean'], function() {
  gulp.start('watch');
});
