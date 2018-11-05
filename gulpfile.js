var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('default', function() {
    return gulp.src('**/*.js')
        .pipe(zip('barkeep.zip'))
        .pipe(gulp.dest('dist/'));
});
