'use strict'; 
module.exports = function(gulp, g, c) {
  function markdown() {
      return gulp.src(`${c.src}/**/*.md`)
        .pipe(g.watchr('md'))
        .pipe(g.frontMatter())
        .pipe(g.markdownIt(c.markdown))
        .pipe(g.layoutr())
        .pipe(g.dest());
    };

  return {
    markdown
  };
};
