import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import watchify from 'watchify';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import connect from 'gulp-connect';
import concat from 'gulp-concat';
import sass from 'gulp-sass';
import del from 'del';

const bundlerCfg = {
  entries: 'src/index.js',
  debug: true,
};
const bundler = watchify(browserify(bundlerCfg).transform(babelify));
const dirs = {
  tmp: 'tmp',
  dist: 'dist',
};

// Deleted
gulp.task('clean', () => (
  del(dirs.tmp)
));

gulp.task('connect', () => {
  connect.server({
    root: dirs.tmp,
    livereload: true,
  });
  connect.reload();
});

gulp.task('html', () => (
  gulp.src('./src/**/*.html')
    .pipe(gulp.dest(dirs.tmp))
    .pipe(connect.reload())
));

gulp.task('scripts', () => (
  bundler
    .bundle()
    .pipe(source('scripts.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dirs.tmp))
    .pipe(connect.reload())
));

gulp.task('worker', () => (
  gulp.src('src/scripts/util/worker.js')
    .pipe(babel())
    .pipe(gulp.dest(dirs.tmp))
    .pipe(connect.reload())
));

gulp.task('cache-polyfill', () => (
  gulp.src('src/scripts/util/cache-polyfill.js')
    .pipe(gulp.dest(dirs.tmp))
    .pipe(connect.reload())
));

gulp.task('fa-assets', () => (
  gulp.src('src/sass/fontawesome/webfonts/*.*', { base: './src/sass/fontawesome' })
    .pipe(gulp.dest(dirs.tmp))
));

gulp.task('sass', () => (
  gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(dirs.tmp))
    .pipe(connect.reload())
));

gulp.task('watch', () => {
  gulp.watch(['src/**/*.html'], ['html']);
  gulp.watch(['src/**/*.js'], ['scripts']);
  gulp.watch(['src/scripts/util/worker.js'], ['worker']);
  gulp.watch(['src/scripts/util/cache-polyfill.js'], ['cache-polyfill']);
  gulp.watch(['src/**/*.scss'], ['sass']);
});

// The good stuff
gulp.task('serve', ['clean', 'html', 'scripts', 'cache-polyfill', 'worker', 'fa-assets', 'sass', 'connect', 'watch']);
gulp.task('default', ['serve']);
