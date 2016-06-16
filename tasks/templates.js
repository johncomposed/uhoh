'use strict'; 
module.exports = function(gulp, g, c) {

  function jade() {
    return gulp.src(`${c.src}/**/*.jade`)
      .pipe(g.watchr('jade'))
      .pipe(g.jade(c.jade))
      .pipe(g.dest());
  };
  
  function other() {
    return gulp.src([`${c.src}/**/*`, `!${c.src}/**/*.{sass,scss,js,jade,md}`])
      .pipe(g.watch([`${c.src}/**/*`, `!${c.src}/**/*.{sass,scss,js,jade,md}`]))
      .pipe(g.dest());
  };
  
  function markdown() {  
    return gulp.src(`${c.src}/**/*.md`)  
      .pipe(g.watchr('md'))
      .pipe(g.frontMatter())
      .pipe(g.markdownIt())
      .pipe(g.layout((file) => {
        let config = file.frontMatter || {};
        config.layout = config.layout || c.layout;
        return config;
      }))
      .pipe(g.dest());
  };

  return {
    jade,
    other,
    markdown
  };
};
