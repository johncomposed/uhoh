'use strict'; 
module.exports = function(gulp, g, c) {

  function jade() {
    return gulp.src(`${c.src}/**/*.jade`)
      .pipe(g.watchr('jade'))
      .pipe(g.frontMatter())
      .pipe(g.jade(c.jade))
      .pipe(g.layoutr())
      .pipe(g.dest());
  };

  return {
    jade
  };
};
