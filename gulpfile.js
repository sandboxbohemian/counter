var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('default', function() {
    return gulp.src(['**/*.js', '!gulpfile.js', '!dist/*'])
        .pipe(zip('counter.zip'))
        .pipe(gulp.dest('dist/'));
});
