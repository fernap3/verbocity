var gulp = require('gulp');
//var uglify = require('gulp-uglify');
var less = require("gulp-less");
var watch = require('gulp-watch');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');


gulp.task('build-debug', ['build-typescript', 'less']);

gulp.task('build-typescript', function () {
      
   var sourceTsFiles = ["puzzle.ts", "puzzles.ts", "centerer.ts", "timer.ts", "puzzleRenderer.ts",
   "previewRenderer.ts", "timerRenderer.ts", "inputHandler.ts", "mainMenu.ts", "puzzleChooser.ts",
   "sharePrompt.ts", "engine.ts", "game.ts"];

   var tsResult = gulp.src(sourceTsFiles)
                    .pipe(concat('verbocity.ts'))
                    .pipe(typescript({
                        target: 'ES5',
                        declarationFiles: false,
                        noExternalResolve: true
                    }));

        tsResult.dts.pipe(gulp.dest("js"));
        return tsResult.js.pipe(gulp.dest("js"));
});

gulp.task('less', function () {
   gulp.src('*.less')
      .pipe(less())
      .pipe(gulp.dest('css'));
});
