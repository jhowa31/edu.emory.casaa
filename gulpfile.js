/* Modules */
var gulp            = require('gulp'),
    path            = require('path'),
    browserSync     = require('browser-sync').create(),
    chalk           = require('chalk'),
    autoprefixer    = require('autoprefixer'),
    clean           = require('gulp-clean'),
    concat          = require('gulp-concat'),
    cssmin          = require('gulp-cssmin'),
    gulpif          = require('gulp-if'),
    less            = require('gulp-less'),
    postcss         = require('gulp-postcss'),
    rename          = require('gulp-rename'),
    sass            = require('gulp-sass'),
    uglify          = require('gulp-uglify'),
    nunjucks        = require('gulp-nunjucks-render'),
    tap             = require('gulp-tap'),
    mustache        = require('gulp-mustache')
    ts              = require('gulp-typescript');

//Load Configuration 
var config = require('./build-config.json');

//Setup variables
var buildtasks = ['build:css', 'build:js', 'build:html'];

//Create global functions
function error() {
    console.log(chalk.bold.red.apply(this, arguments));
    return null;
}

function logging() {
    console.log(chalk.bold.apply(this, arguments));
    return null; 
}

function getConfig() {
  return config;
}

function normalizePath() {
  return path
    .relative(
      process.cwd(),
      path.resolve.apply(this, arguments)
    )
    .replace(/\\/g, "/");
}

function handleError(err){
    error(err);
    try {
      this.emit('end');
    } catch(e) {
      console.log(e);
      process.exit(1);
    }
}

function logFileChange(event){
  logging('File ' + event.path + ' was ' + event.type + ', running tasks...');
}


gulp.task('build:css', ['build:clean:css'], function(){
  return gulp.src(normalizePath(getConfig().css.source))
          .on("error", handleError)
          .pipe(gulpif(getConfig().css.cssPreprocessor === 'scss', sass()))
          .on("error", handleError)
          .pipe(gulpif(getConfig().css.cssPreprocessor === 'less', less()))
          .on("error", handleError)
          .pipe(postcss([autoprefixer]))
          .pipe(gulpif(getConfig().css.minizine, cssmin()))
          .pipe(rename({suffix: getConfig().css.suffix}))
          .pipe(gulpif(getConfig().css.concat, concat('site.css')))
          .pipe(gulp.dest(normalizePath(getConfig().css.build)))
          .on("error", handleError);
});

gulp.task('build:clean:css', function(){
    return gulp.src(normalizePath(getConfig().css.build + '*'))
            .pipe(gulpif(getConfig().css.clean, clean()));
});

gulp.task('build:js', ['build:clean:js'], function(){
  return gulp.src(normalizePath(getConfig().js.source))
          .on("error", handleError)
          .pipe(gulpif(getConfig().js.jsPreprocessor === 'ts', ts()))
          .on("error", handleError)
          .pipe(gulpif(getConfig().js.minizine, uglify()))
          .pipe(rename({suffix: getConfig().js.suffix}))
          .pipe(gulpif(getConfig().js.concat, concat('site.js')))
          .pipe(gulp.dest(normalizePath(getConfig().js.build)))
          .on("error", handleError);
});

gulp.task('build:clean:js', function(){
    return gulp.src(normalizePath(getConfig().js.build + '*'))
            .pipe(gulpif(getConfig().js.clean, clean()));
})

gulp.task('build:html', ['build:clean:html'], function(){
  
  return gulp.src(normalizePath(getConfig().html.source))
          .on("error", handleError)
          .pipe(gulpif(getConfig().html.templateEngine === 'njk', nunjucks({
            "path": [getConfig().html.templates]
          })))
          .on("error", handleError)
          .pipe(gulpif(getConfig().html.templateEngine === 'mustache', tap(
            function(file, t) {
              var dataFileName = path.basename(file.path, path.extname(file.path)) + '.json';
              var dataFilePath =  path.join(path.dirname(file.path), dataFileName);
              return t.through(mustache, [require(dataFilePath)])
            }
          )))
          .on("error", handleError)
          .pipe(rename({suffix: getConfig().html.suffix}))
          .pipe(rename({extname: getConfig().html.extension}))
          .pipe(gulp.dest(normalizePath(getConfig().html.build)))
          .on("error", handleError);
});

gulp.task('build:clean:html', function(){
    return gulp.src(normalizePath(getConfig().html.build + '*'))
            .pipe(gulpif(getConfig().html.clean, clean()));
});

getConfig().static.forEach(function(staticResource){
  
  gulp.task('build:clean:' + staticResource.task, function(){
    return gulp.src(normalizePath(staticResource.build + '*'))
            .pipe(clean());
  });


  gulp.task('build:' + staticResource.task, ['build:clean:' + staticResource.task], function(){
    return gulp.src(normalizePath(staticResource.source))
            .on("error", handleError)
            .pipe(gulp.dest(normalizePath(staticResource.build)))
            .on("error", handleError);
  });
  buildtasks.push('build:' + staticResource.task);
});

gulp.task('build', buildtasks , function(){
    logging("Build done: " + new Date());
    return gulp.src(normalizePath(getConfig().browserSync.directory));
});

gulp.task('serve', ['build'], function(){
  if(getConfig().browserSync.enabled){
    browserSync.init({
      server: {
        baseDir: normalizePath(getConfig().browserSync.directory),
        directory: true
      } 
    });
  }
});

gulp.task('serve:reload',  function reload(done) {
    browserSync.reload();
    done();
});

buildtasks.forEach(function(taskName){
  gulp.task('serve:reload:'+ taskName, [taskName], function(done){
    browserSync.reload();
    done();
  })
});

gulp.task('watch:build', ['build'], function(){
  gulp.watch(normalizePath(getConfig().css.source), ['serve:reload:build:css']).on('change', logFileChange);
  gulp.watch(normalizePath(getConfig().js.source), ['serve:reload:build:js']).on('change', logFileChange);
  gulp.watch(normalizePath(getConfig().html.source), ['serve:reload:build:html']).on('change', logFileChange);
  if(getConfig().html.templateEngine != false && getConfig().html.templates != ''){
    gulp.watch(normalizePath(getConfig().html.templates + '/**/*.*'), ['serve:reload:build:html']).on('change', logFileChange);
  }

  getConfig().static.forEach(function(staticResource){
    gulp.watch(normalizePath(staticResource.source), ['serve:reload:build:'+ staticResource.task]).on('change', logFileChange);
  });
});

gulp.task('watch:serve', ['build', 'serve', 'watch:build']);