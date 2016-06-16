'use strict'; 

const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const g = require('gulp-load-plugins')();
const lazy = require('lazypipe');

const argv = require('yargs')
    .usage('Usage: $0 [options] <src> <dest>')
    .options({
      's': {
        alias: 'server',
        describe: 'A livereload server, if a custom server is set it proxies all traffic to localhost:port + 1',
        type: 'boolean'
      },
      'c': {
        alias: 'custom',
        describe: 'Your node server file (optional)',
        type: 'string'
      },
      'w': {
        alias: "watch",
        type: "boolean",
        describe: "Watch the throne"
      },
      'p': {
        alias: "port",
        type: "number",
        describe: "Optional port"
      }
    })
    .help('h')
    .alias('h', 'help')
    .argv;

const src = path.resolve(process.cwd(), argv._[0]) || process.cwd();
const c = {
  src,
  dest: argv._[1] || path.join(src, '..', 'dest'),
  port: argv.port || 8000,
  watch: argv.watch,
  server: argv.server,
  custom: argv.custom ? argv.custom : false,
  filter: ['**/[^_]*.*'],
  layout: fs.existsSync(path.join(src, '_layout.jade')) ? path.join(src, '_layout.jade') : undefined
};

// Extra gulp plugins
const watch = (ext) => lazy().pipe(g.watch, `${c.src}/**/*.${ext}`);
g.watchr = (ext) => g.ifElse(c.watch, watch(ext));

g.dest = lazy()
  .pipe(() => g.filter(c.filter))
  .pipe(() => g.tap((file) => {
    let relative = path.relative(c.src, file.path);
    g.util.log('Built: ', g.util.colors.magenta(relative));
  }))
  .pipe(gulp.dest, c.dest);

g.lazy = lazy;

// Building tasks;
const templates = require('./tasks/templates')(gulp, g, c);
const styles = require('./tasks/styles')(gulp, g, c);
const scripts = require('./tasks/scripts')(gulp, g, c);

gulp
  .task('clean', () => require('del')([`${c.dest}/*`]))
  .task('jade', templates.jade)
  .task('scss', styles.scss)
  .task('js', scripts.js)
  .task('markdown', templates.markdown)
  .task('other', templates.other)
  .task('compile', ['js', 'markdown', 'jade', 'scss', 'other'])
  .task('server', () => {
    if (c.custom) {
      g.nodemon({ 
        script: c.custom,
        watch: [c.custom]
      });
    }
    return gulp.src(c.dest)
      .pipe(g.ifElse(c.server, () => g.webserver({ 
        livereload: true,
        port: c.port,
        proxies: c.custom ? [{source: '/', target: `http://localhost:${c.port + 1}`}] : []
      })));
  })
  .task('default', ['compile', 'server']);


(function run() {
  console.log('-------------');
  console.log('Source: ', g.util.colors.green(c.src));
  console.log('Destination: ', g.util.colors.green(c.dest));
  console.log('Watch: ', g.util.colors.green(c.watch));
  console.log('Server: ', g.util.colors.green(c.server));
  console.log('Custom: ', g.util.colors.green(c.custom));
  console.log('-------------');

  gulp.start('clean').once('task_stop', () => {
    g.util.log('Cleaned: ', g.util.colors.magenta(c.dest));
    gulp.start('default');
  });
})();
