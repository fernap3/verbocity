var gulp = require('gulp');
var uglify = require('gulp-uglify');
var less = require("gulp-less");
var watch = require('gulp-watch');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');

var sourceTsFiles = ["saveDataProvider.ts", "puzzle.ts", "puzzles.ts", "centerer.ts", "timer.ts", "puzzleRenderer.ts",
   "previewRenderer.ts", "timerRenderer.ts", "inputHandler.ts", "mainMenu.ts", "puzzleChooser.ts",
   "sharePrompt.ts", "visualization.ts", "stockRenderer.ts", "pausePrompt.ts", "winScreen.ts", "loseScreen.ts",
    "audioManager.ts", "engine.ts", "game.ts"];

gulp.task('build-debug', ['build-typescript', 'less']);
gulp.task('deploy', ['deploybuild-typescript', 'less']);


gulp.task('build-typescript', function ()
{
   var tsResult = gulp.src(sourceTsFiles)
                    .pipe(typescript({
                        target: 'ES5',
                        noExternalResolve: false,
                        sortOutput: true
                    }));

        tsResult.dts.pipe(concat('verbocity.js'))
                    .pipe(gulp.dest("js"));
        
        return tsResult.js.pipe(gulp.dest("js"));
});

gulp.task('deploybuild-typescript', function ()
{
   var tsResult = gulp.src(sourceTsFiles)
                    .pipe(typescript({
                        target: 'ES5',
                        noExternalResolve: false,
                        sortOutput: true
                    }));

        tsResult.dts.pipe(uglify()).pipe(gulp.dest("js"));
        return tsResult.js.pipe(concat('verbocity.js'))
                          .pipe(uglify({mangle: true}))
                          .pipe(gulp.dest("js"));
});

gulp.task('less', function ()
{
   gulp.src('*.less')
      .pipe(less())
      .pipe(gulp.dest('css'));
});
