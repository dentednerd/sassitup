module.exports = `var { src, dest, watch, series } = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglifycss = require('gulp-uglifycss');

var sassPath = './sass/*.sass';

function sassTask(){
  return src(sassPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(uglifycss({
      "uglyComments": true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('.'));
}

function watchTask(){
  watch([sassPath], sassTask);
}

exports.default = series(
  sassTask,
  watchTask
);
`;
