var gulp = require('gulp');
//var uglify = require('gulp-uglify');
var less = require("gulp-less");
var watch = require('gulp-watch');
var typescript = require('gulp-typescript');

//gulp.task('default', ["less", "build" "watch"]);

gulp.task('build-typescript', function () {
      
   var sourceTsFiles = ["*.ts"];     //reference to app.d.ts files

   var tsResult = gulp.src(sourceTsFiles)
                    .pipe(typescript({
                        target: 'ES5',
                        declarationFiles: false,
                        noExternalResolve: true
                    }));

        tsResult.dts.pipe(gulp.dest("js"));
        return tsResult.js
               .pipe(gulp.dest("js"));
});

gulp.task('less', function () {
   gulp.src('*.less')
      .pipe(less())
      .pipe(gulp.dest('css'));
});

gulp.task('watch-less', function () {
   gulp.watch('*.less', ['less']);
});