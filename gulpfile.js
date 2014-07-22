'use strict';

var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  karma = require('karma').server;

gulp.task('default', ['test', 'build']);

gulp.task('build', function () {
  return gulp.src('src/*.js')
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist'));
});

// Run tests once and exit
gulp.task('test', function (done) {
  var config = require('./karma.conf.js')();
  config.singleRun = true;
  karma.start(config, done);
});

// Continuously run tests
gulp.task('tdd', function (done) {
  var config = require('./karma.conf.js')();
  karma.start(config, done);
});
