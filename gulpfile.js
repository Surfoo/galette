var gulp = require('gulp'),
  del = require('del'),
  uglify = require('gulp-uglify'),
  cleanCSS = require('gulp-clean-css'),
  merge = require('merge-stream'),
  concat = require('gulp-concat'),
  replace = require('gulp-replace'),
  build = require('./semantic/tasks/build'),
  buildJS = require('./semantic/tasks/build/javascript'),
  buildCSS = require('./semantic/tasks/build/css'),
  buildAssets = require('./semantic/tasks/build/assets')
;

gulp.task('build ui', build);
gulp.task('build-css', buildCSS);
gulp.task('build-javascript', buildJS);
gulp.task('build-assets', buildAssets);

var paths = {
  galette: {
    modules: './node_modules/',
    semantic: './semantic/',
    public: './galette/webroot/assets/'
  },
  css: {
    main: [
      './galette/webroot/themes/default/galette.css',
      './node_modules/summernote/dist/summernote-lite.min.css'
    ]
  },
  js: {
    main: [
      './node_modules/jquery/dist/jquery.js',
      './node_modules/js-cookie/dist/js.cookie.min.js',
      './node_modules/summernote/dist/summernote-lite.min.js',
      './galette/webroot/js/common.js'
    ],
    chartjs: [
      './node_modules/chart.js/dist/chart.min.js',
      './node_modules/chartjs-plugin-autocolors/dist/chartjs-plugin-autocolors.min.js',
      './node_modules/chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js'
    ],
    sortablejs: [
      './node_modules/sortablejs/Sortable.min.js'
    ]
  },
  extras: [
    {
      src: './node_modules/summernote/dist/font/*',
      dest: '/webfonts/'
    }, {
      src: './node_modules/summernote/dist/lang/*.min.js',
      dest: '/js/lang/'
    }
  ]
};

function theme() {
  var _dir = paths.galette.semantic + 'src/';
  var _themes = paths.galette.semantic + 'src/themes/galette';

  config = gulp.src([
    './theme/theme.config'
  ])
    .pipe(gulp.dest(_dir));

  theme =  gulp.src([
    './theme/themes/galette/*',
    './theme/themes/galette/**/*.*'
  ])
    .pipe(gulp.dest(_themes));

  return merge(config, theme);
}

function clean() {
  return del([paths.galette.public]);
}

function styles() {
  var _dir = paths.galette.public + '/css/';

  main = gulp.src(paths.css.main)
    .pipe(replace('url(images/', 'url(../images/'))
    .pipe(replace('url(font/', 'url(../webfonts/'))
    .pipe(cleanCSS())
    .pipe(concat('galette-main.bundle.min.css'))
    .pipe(gulp.dest(_dir));

  return merge(main);
}

function scripts() {
  var _dir = paths.galette.public + '/js/';

  main = gulp.src(paths.js.main)
    .pipe(concat('galette-main.bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(_dir));

  chartjs = gulp.src(paths.js.chartjs)
    .pipe(concat('galette-chartjs.bundle.min.js'))
    .pipe(gulp.dest(_dir));

  sortablejs = gulp.src(paths.js.sortablejs)
    .pipe(concat('galette-sortablejs.bundle.min.js'))
    .pipe(gulp.dest(_dir));

  return merge(main, chartjs, sortablejs);
}

function extras() {
  main = paths.extras.map(function (extra) {
    return gulp.src(extra.src)
      .pipe(gulp.dest(paths.galette.public + extra.dest));
    }
  );

  return merge(main);
}

exports.clean = clean;
exports.theme = theme;
exports.styles = styles;
exports.scripts = scripts;
exports.extras = extras;

var build = gulp.series(theme, clean, styles, scripts, extras, 'build ui');
exports.default = build;
