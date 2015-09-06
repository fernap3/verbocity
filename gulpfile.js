var gulp = require('gulp');
var uglify = require('gulp-uglify');
var less = require("gulp-less");
var watch = require('gulp-watch');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');
var awspublish = require('gulp-awspublish');
var rename = require('gulp-rename');

var sourceTsFiles = ["saveDataProvider.ts", "puzzle.ts", "puzzles.ts", "centerer.ts", "timer.ts", "puzzleRenderer.ts",
   "previewRenderer.ts", "timerRenderer.ts", "inputHandler.ts", "mainMenu.ts", "puzzleChooser.ts",
   "sharePrompt.ts", "visualization.ts", "stockRenderer.ts", "pausePrompt.ts", "winScreen.ts", "loseScreen.ts",
   "howToPlayPrompt.ts", "audioManager.ts", "sounds.ts", "engine.ts", "game.ts"];
    
var publishFiles = {
  "index.html": "",
  "js/verbocity.js": "js",
  "fastclick.js": "js",
  "switchery.min.js": "js",
  "images/*": "images",
  "css/*": "css",
  "sounds/*": "sounds"
};

gulp.task('build-debug', ['build-typescript', 'less']);
gulp.task('deploy', ['deploybuild-typescript', 'less']);

function copyLibraryJavascript ()
{
    gulp.src('fastclick.js').pipe(gulp.dest('js'));
    gulp.src('switchery.min.js').pipe(gulp.dest('js'));
}

gulp.task('build-typescript', function ()
{
   var tsResult = gulp.src(sourceTsFiles)
                    .pipe(typescript({
                        target: 'ES5',
                        noExternalResolve: false,
                        sortOutput: true
                    }));

        copyLibraryJavascript();

        tsResult.dts.pipe(concat('verbocity.js'))
                    .pipe(gulp.dest("js"));
        
        return tsResult.js.pipe(concat('verbocity.js')).pipe(gulp.dest("js"));
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

 
gulp.task('publish', function() {
 
  // create a new publisher using S3 options 
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property 
  var publisher = awspublish.create({
    params: {
      Bucket: 'verbo.city'
    }
  });
 
  // define custom headers 
  var headers = {
    //'Cache-Control': 'max-age=315360000, no-transform, public'
    "x-amz-acl": "public-read"
  };
  
  for (var key in publishFiles)
  {
    if (publishFiles.hasOwnProperty(key) === false)
      continue;
    
    gulp.src(key)
     // gzip, Set Content-Encoding headers and add .gz extension 
    //.pipe(awspublish.gzip({ ext: '.gz' }))
    
    .pipe(rename({ dirname: publishFiles[key] }))
 
    // publisher will add Content-Length, Content-Type and headers specified above 
    // If not specified it will set x-amz-acl to public-read by default 
    .pipe(publisher.publish(headers))
 
    // create a cache file to speed up consecutive uploads 
    //.pipe(publisher.cache())
 
     // print upload updates to console 
    .pipe(awspublish.reporter());
  }
});