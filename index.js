'use strict'; 

const gulp = require('gulp');
const p = require('path');
const fs = require('fs');
const g = require('gulp-load-plugins')();
const lazy = require('lazypipe');

const argv = require('yargs')
    .usage('Usage: $0 [options] <src> <dest>')
    .boolean('w')
    .alias('w', 'watch')
    .boolean('s')
    .alias('s', 'serve')
    .nargs('c', 1)
    .alias('c', 'config')
    .nargs('l', 1)
    .alias('l', 'layout')
    .help('h')
    .alias('h', 'help')
    .argv;

const src = p.resolve(process.cwd(), argv._[0]) || process.cwd();
const exists = (file) => fs.existsSync(file) ? file : undefined;
const c = exists(p.join(src, argv.config)) ? require(p.join(src, argv.config)) : {};

c.src = src;
c.dest = argv._[1] || c.dest || p.join(c.src, '..', 'dest');
c.watch = argv.watch || c.watch;
c.serve = argv.serve || c.serve;
c.layout = argv.layout || c.layout || exists(p.join(src, '_layout.jade'));

const watch = (ext) => lazy().pipe(g.watch, `${c.src}/**/*.${ext}`);
g.watchr = (ext) => g.ifElse(c.watch, watch(ext));
g.layoutr = () => g.layout((file) => {
  let config = file.frontMatter || {};
  config.layout = config.layout || c.layout;

  return config;
});
g.dest = lazy()
  .pipe(() => g.filter(['**/[^_]*.*']))
  .pipe(() => g.tap((file) => {
    let relative = p.relative(c.src, file.path);
    g.util.log('Built: ', g.util.colors.magenta(relative));
  }))
  .pipe(gulp.dest, c.dest);

const markdown = require('./tasks/markdown')(gulp, g, c);
const templates = require('./tasks/templates')(gulp, g, c);
const styles = require('./tasks/styles')(gulp, g, c);
const scripts = require('./tasks/scripts')(gulp, g, c);

gulp
  .task('clean', () => require('del')([`${c.dest}/*`]))
  .task('markdown', markdown.markdown) 
  .task('jade', templates.jade)
  .task('watch-jade', () => gulp.src(`${c.src}/**/*.jade`).pipe())
  .task('scss', styles.scss)
  .task('js', scripts.js)
  .task('compile', ['js', 'jade', 'markdown', 'scss'])
  .task('server', () => (
     gulp.src(c.dest)
      .pipe(g.ifElse(c.serve, () => g.webserver(c.webserver || { livereload: true })))
  ))
  .task('default', ['compile', 'server']);


(function run() {
  console.log('-------------');
  console.log('Source: ', g.util.colors.green(c.src));
  console.log('Destination: ', g.util.colors.green(c.dest));
  console.log('Config file: ', g.util.colors.green(argv.config));
  console.log('Watch: ', g.util.colors.green(c.watch));
  console.log('Serve: ', g.util.colors.green(c.serve));
  console.log('-------------');

  gulp.start('clean').once('task_stop', () => {
    g.util.log('Cleaned: ', g.util.colors.magenta(c.dest));
    gulp.start('default');
  });
})();
