'use strict'; 
module.exports = function(gulp, g, c) {
  const layout = () => g.layout((file) => {
      let config = file.frontMatter || {};
      config.layout = config.layout || c.layout;

      return config;
    });
  
  function markdown() {
      return gulp.src(`${c.src}/**/*.md`)
        .pipe(g.watchr('md'))
        .pipe(g.frontMatter())
        .pipe(g.markdownIt(c.markdown))
        .pipe(layout())
        .pipe(g.log())
        .pipe(gulp.dest(c.dest));
    };

  function jade() {
    return gulp.src(`${c.src}/**/[!_]*.jade`)
      .pipe(g.watchr('jade'))
      .pipe(g.frontMatter())
      .pipe(g.jade(c.jade))
      .pipe(layout())
      .pipe(g.log())
      .pipe(gulp.dest(c.dest));
  };

  return {
    markdown,
    jade
  };
};
