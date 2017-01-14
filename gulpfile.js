'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');


gulp.task('sass', function () {
  return gulp.src('./dev/sass/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./public/style/'));
});

gulp.task('js', function () {
  return gulp.src('./dev/js/*.js')
    .pipe(gulp.dest('./public/js'));
});

//
// gulp.task('sass:watch', function () {
//   gulp.watch('./dev/sass/*.scss', ['sass']);
// });

gulp.task('watch', function () {
  gulp.watch(['./dev/sass/*.scss','./dev/js/*.js'], ['sass','js']);
});
