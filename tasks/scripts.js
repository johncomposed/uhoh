'use strict'; 
module.exports = function(gulp, g, c) {
  function js() {
      return gulp.src(`${c.src}/**/*.js`)
        .pipe(g.watchr('js'))
        .pipe(g.dest());
    };

  return {
    js
  };
};
