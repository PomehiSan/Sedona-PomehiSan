const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const cssmin = require("gulp-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const jsmin = require("gulp-jsmin");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(cssmin())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTMLmin

const html = () => {
  return gulp.src("source/**/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
}

exports.html = html;

// JSmin

const js = () => {
  return gulp.src("source/**/*.js")
    .pipe(jsmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest("build"))
}

exports.js = js;

// copy

const copy = (done) => {
  return gulp.src([
    "source/fonts/*{woff,woff2}",
    "source/**/*.ico",
    "source/*.webmanifest"
    ],
      { base: "source" }
    )
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

// imageCopy

const imgCopy = (done) => {
  return gulp.src([
    "source/img/**/*.{jpg,png,svg}",
    "!source/img/ico/*.*"
    ],
      { base: "source" }
    )
    .pipe(gulp.dest("build"))
  done();
}

exports.imgCopy = imgCopy;

// imageMin

const imgMin = () => {
  return gulp.src("build/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({quality: 90, progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}

exports.imgMin = imgMin;

// webp

const createWebp = () => {
  return gulp.src("build/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// svg

const sprite = () => {
  return gulp.src("source/img/ico/*.*")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

// clean

const clean = () => {
  return del("build");
}

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// build

const build = gulp.series(
  clean,
  copy,
  imgCopy,
  imgMin,
  gulp.parallel(
    styles,
    html,
    js,
    sprite,
    createWebp
  )
);

exports.build = build;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("html")).on("change", sync.reload);
}

// default

exports.default = gulp.series(
  clean,
  copy,
  imgCopy,
  gulp.parallel(
    styles,
    html,
    js,
    sprite,
    createWebp
  ),
  server,
  watcher
);
