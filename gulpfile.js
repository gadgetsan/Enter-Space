
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// create a TASK to compile CoffeeScript to JavaScript using gulp-coffee
gulp.task('js', function() {
   gulp.src(['./src/**/*.coffee'])
   .pipe($.coffee({bare: true}))
   .on('error', displayError)
   .pipe(gulp.dest('./bld/'));
});

var displayError = function(err){
    $.util.colors.enabled = true;
    $.util.log($.util.colors.red('ERROR:'), $.util.colors.yellow(err));
}
