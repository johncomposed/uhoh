'use strict'; 
module.exports = function(gulp, g, c) {
  const browserify = require('browserify');
  const path = require('path');
  
  const clientside = function(file) {
    if (path.basename(file.path) === 'client.js') {
      let b = browserify({ entries: [file.path], debug: true })
        .transform(require('babelify'))
        .on('error', function(error) {
          console.log(error.stack);
          this.emit('end');
        });
      let stream = b.bundle();
      file.contents = stream;
    }
  };
  
  function js() {
      return gulp.src([`${c.src}/**/*.js`])
        .pipe(g.watchr('js'))
        .pipe(g.tap(clientside))
        .pipe(g.dest());
    };

  return {
    js
  };
};
