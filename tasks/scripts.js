'use strict'; 
module.exports = function(gulp, g, c) {
  function js() {
      return gulp.src(`${c.src}/**/*.js`)
        .pipe(g.watchr('js'))
        .pipe(g.log())
        .pipe(gulp.dest(c.dest));
    };

  return {
    js
  };
};
