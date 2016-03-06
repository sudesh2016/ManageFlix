'use strict';

var gulp = require('gulp');
// Include Our Plugins
var path = require('path');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
var es = require('event-stream');
var less = require('gulp-less');
var ngmin = require('gulp-ngmin');

var bower_components_js = [
  'server/client/src/bower_components/angular-dropdowns/dist/angular-dropdowns.min.js',
  'server/client/src/bower_components/ng-file-upload/ng-file-upload.min.js',
  'server/client/src/bower_components/satellizer/satellizer.min.js',
];

var bower_components_css = [
  'server/client/src/bower_components/angular-dropdowns/dist/angular-dropdowns.min.css',
];

var local_scripts_build = [
  'server/client/src/*.js',
  'server/client/src/services/*.js',
  'server/client/src/constants/*.js',
  'server/client/src/constants/*.js',
  'server/client/src/components/**/*js',
];

var bower_inject_js = [
  'server/client/build/vendor/angular.min.js',
  'server/client/build/vendor/angular-dropdowns.min.js',
  'server/client/build/vendor/angular-dropdowns.css',
  'server/client/build/vendor/angular-route.min.js',
  'server/client/build/vendor/lodash.min.js',
  'server/client/build/vendor/ng-file-upload.min.js',
  'server/client/build/vendor/satellizer.min.js',
];

var bower_inject_css = [
  'server/client/build/vendor/angular-dropdowns.min.css'
];

// Concatenate & Minify JS
gulp.task('vendor-scripts', function() {
  var scripts = bower_components_js.concat(bower_components_css);
  return gulp.src(scripts)
    .pipe(gulp.dest('server/client/build/vendor'));
});

gulp.task('local-scripts', function() {
  return gulp.src(local_scripts_build)
    .pipe(concat('local.js'))
    .pipe(rename('local.min.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('server/client/build'));
});

gulp.task('inject',['vendor-scripts'], function(){
    var scripts = bower_inject_js.concat(bower_inject_css);
     gulp.src('template.index.html' )
         .pipe(rename('index.html'))
         .pipe(inject(gulp.src(scripts, {read: false}), {ignorePath: 'server/client/build', addRootSlash: false}))
         .pipe(gulp.dest('./server/client/build'));
  });

gulp.task('less', function() {
  return gulp.src('./server/client/src/styles/styles.less')
    .pipe(less())
    .pipe(gulp.dest('./server/client/build/css'));
});

gulp.task('copy-components', function() {
  return gulp.src('./server/client/src/components/**/*.html')
    .pipe(gulp.dest('server/client/build/components'));
});

gulp.task('copy-assests', function() {
  return gulp.src('./server/client/src/assests/**/*')
    .pipe(gulp.dest('server/client/build/assests'));
});


gulp.task('loadTemplate', function() {
  var target = gulp.src('template.index.html');
  return target.pipe(rename('index.html'))
    .pipe(gulp.dest('server/client/build'));
});

// Default Task
gulp.task('build', ['less', 'vendor-scripts', 'local-scripts',
  'copy-components', 'copy-assests', 'inject'
]);
