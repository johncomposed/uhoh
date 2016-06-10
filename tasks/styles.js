'use strict'; 
module.exports = function(gulp, g, c) {
  function scss() {
      return gulp.src(`${c.src}/**/*.scss`)
        .pipe(g.watchr('scss'))
        .pipe(g.sourcemaps.init())
        .pipe(g.sass(c.scss))
        .pipe(g.sourcemaps.write())
        .pipe(g.dest());
    };

  return {
    scss
  };
};
