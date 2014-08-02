'use strict';

var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  karma = require('karma').server,
  express = require('express'),
  protractor = require('gulp-protractor'),
  path = require('path'),
  server;

gulp.task('default', ['unit', 'e2e', 'build']);

// Copy and minify project
gulp.task('build', function () {
  return gulp.src('src/*.js')
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist'));
});

// Examples server
gulp.task('server', function (done) {
  server = express();
  server.use(express.static(path.resolve(__dirname, 'examples')));
  server = server.listen(9999, function () {
    console.log('Listening on port 9999');
    done();
  });
});

// Run unit tests once and exit
gulp.task('unit', function (done) {
  var config = require('./karma.conf.js')();
  config.singleRun = true;
  karma.start(config, done);
});

// Continuously run unit tests
gulp.task('tdd', function (done) {
  var config = require('./karma.conf.js')();
  karma.start(config, done);
});

/// Run e2e tests once and exit
gulp.task('webdriverUpdate', protractor.webdriver_update);
gulp.task('e2e', ['server', 'webdriverUpdate'], function (done) {
  var close = function (err) {
    server.close(function () {
      done(err);
    });
  };

  gulp.src('test/e2e/*.spec.js')
    .pipe(protractor.protractor({
       configFile: 'protractor.conf.js'
     }))
    .on('error', close)
    .on('end', close);
});
