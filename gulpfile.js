var gulp         = require('gulp'),
		watch        = require('gulp-watch'),
		plumber      = require('gulp-plumber'),
		uglify       = require('gulp-uglify'),
		rename       = require('gulp-rename'),
		babel        = require('gulp-babel');

gulp.task('js', function (cb) {
	'use strict';

	gulp.src('src/*.js')
		.pipe(plumber())
		.pipe(babel())
		.pipe(uglify({output: {comments: /^!|@preserve|@license|@cc_on/i}}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/'));
	cb();
});

gulp.task('watch', function () {
	'use strict';
	gulp.watch('src/*.js', ['js']);
});

gulp.task('default', ['watch', 'js']);
