const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const { rimraf } = require('rimraf');
const imagemin = require('gulp-imagemin');
// const imageminWebp = require('imagemin-webp');
const newer = require('gulp-newer');
const gulpIf = require('gulp-if');
const prettyHtml = require('gulp-pretty-html');
const svgSprites = require('gulp-svg-sprites');
const fs = require('fs');
const path = require('path');
const scripts = require('./gulp-webpack');
const log = require('fancy-log');
const colors = require('ansi-colors');
const PluginError = require('plugin-error');
const replaceExt = require('replace-ext');
const through = require('through2');

// Global error handlers to prevent process crashes
process.on('uncaughtException', (err) => {
  log(colors.red('Uncaught Exception:'), err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  log(colors.red('Unhandled Rejection at:'), promise, 'reason:', reason);
});

// Config
const isDevelopment = process.env.NODE_ENV !== 'production';
const paths = {
  root: './dist',
  templates: {
    pages: './src/pug/pages/*.pug',
    src: './src/pug/**/*.pug',
    dest: './dist',
  },
  styles: {
    main: './src/assets/styles/main.scss',
    importsFile: 'src/assets/styles/assets/templates.scss',
    stylesPages: 'src/assets/styles/pages',
    src: './src/**/*.scss',
    dest: './dist/assets/styles',
  },
  scripts: {
    src: './src/assets/scripts/**/*.js',
    dest: './dist/assets/scripts/',
  },
  fonts: {
    src: './src/assets/fonts/**/*',
    dest: './dist/assets/fonts',
  },
  images: {
    src: './src/assets/images/**/*',
    dest: './dist/assets/images/',
  },
  svgSprite: {
    src: './src/assets/svg-sprite/*.svg',
    dest: './src/assets/svg-sprite/sprite/',
  },
  static: {
    src: './src/static/**/*.*',
    dest: './dist/static/',
  },
};

// Error handler function
function handleError(taskName) {
  return function (err) {
    log(colors.red(`${taskName} Error:`), err.message);
    if (err.details) {
      log(colors.yellow('Details:'), err.details);
    }
    if (err.stack) {
      log(colors.gray('Stack:'), err.stack);
    }
    this.emit('end'); // Continue the stream
  };
}

// Add timestamp to files for cache busting
function addTimestamp() {
  const timestamp = Date.now();

  return through.obj(function (file, enc, cb) {
    if (file.isBuffer()) {
      const contents = file.contents.toString();
      // Додаємо timestamp до посилань на CSS/JS
      const updatedContents = contents
        .replace(/main\.min\.css/g, `main.min.css?v=${timestamp}`)
        .replace(/main\.min\.js/g, `main.min.js?v=${timestamp}`);

      file.contents = Buffer.from(updatedContents);
    }
    cb(null, file);
  });
}

// Clean dist folder
function clean() {
  return rimraf(paths.root);
}

// PUG templates with error handling and cache busting
function templates() {
  return gulp
    .src(paths.templates.pages)
    .pipe(pug({ pretty: true }))
    .on('error', handleError('PUG'))
    .pipe(
      prettyHtml({
        unformatted: ['fieldset'],
      }),
    )
    .on('error', handleError('PrettyHtml'))
    .pipe(gulpIf(isDevelopment, addTimestamp())) // Додаємо версії тільки в dev режимі
    .pipe(gulp.dest(paths.root))
    .on('end', () => {
      if (browserSync.active) {
        log(colors.cyan('🔄 HTML changed - reloading browser...'));
        browserSync.reload();
      }
    });
}

// Generate SCSS imports from pages with error handling
function scssTemplateCreater() {
  return new Promise((resolve) => {
    fs.readdir(paths.styles.stylesPages, (err, nameFiles) => {
      if (err) {
        log(colors.red('SCSS Template Creator Error:'), err.message);
        resolve();
        return;
      }

      const filesNameWithoutExt = nameFiles
        .filter((file) => file.endsWith('.scss'))
        .map((el) => el.replace(/\.scss/g, ''));

      const contentImportsFiles = filesNameWithoutExt.reduce(
        (acc, el) => (acc += `@use './pages/${el}';\n`),
        '',
      );

      fs.writeFile(paths.styles.importsFile, contentImportsFiles, (err) => {
        if (err) {
          log(colors.red('SCSS Template Creator Write Error:'), err.message);
        } else {
          log(colors.green('SCSS imports generated successfully'));
        }
        resolve();
      });
    });
  });
}

// Styles with enhanced error handling and better cache busting
function styles() {
  return gulp
    .src(paths.styles.main)
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(
      sass({
        outputStyle: isDevelopment ? 'expanded' : 'compressed',
      }).on('error', function (err) {
        log(colors.red('\n❌ SASS Error:'), err.message);
        if (err.file) log(colors.yellow('📁 File:'), err.file);
        if (err.line) log(colors.yellow('📍 Line:'), err.line);
        if (err.column) log(colors.yellow('📍 Column:'), err.column);

        // Browser notification
        if (browserSync.active) {
          browserSync.notify('SASS Error!  Check console.', 5000);
        }

        log(colors.cyan('👂 Watching for changes to retry...\n'));
        this.emit('end');
      }),
    )
    .pipe(autoprefixer())
    .on('error', handleError('Autoprefixer'))
    .pipe(gulpIf(!isDevelopment, cleanCSS()))
    .on('error', handleError('CleanCSS'))
    .pipe(rename('main.min.css'))
    .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(
      browserSync.stream({
        match: '**/*.css', // Тільки CSS файли
      }),
    );
}

// Scripts with error handling wrapper
function scriptsWithErrorHandling() {
  try {
    const stream = scripts();

    // ✅ Перевірка чи stream валідний
    if (!stream || typeof stream.on !== 'function') {
      log(colors.yellow('⚠️  Scripts returned invalid stream'));
      return gulp.src('.');
    }

    return stream.on('error', function (err) {
      // ...обробка помилок
    });
  } catch (err) {
    log(colors.red('Scripts Sync Error:'), err.message);
    return gulp.src('.');
  }
}

// SVG Sprite with error handling
function svgSprite() {
  return gulp
    .src(paths.svgSprite.src)
    .pipe(
      svgSprites({
        mode: 'symbols',
        preview: false,
        selector: 'icon-%f',
        svg: {
          symbols: 'symbol_sprite.php',
        },
      }),
    )
    .on('error', handleError('SVG Sprites'))
    .pipe(gulp.dest(paths.svgSprite.dest));
}

// Images with error handling
function images() {
  return gulp
    .src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(
      gulpIf(
        !isDevelopment,
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 80, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
          }),
        ]),
      ),
    )
    .on('error', handleError('Images'))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
}

// Custom task with proper error handling
function customTask() {
  log('Task started');
  log(colors.green('Custom task running...'));

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new PluginError('customTask', 'Streaming not supported'));
      return cb();
    }

    try {
      // Process file
      cb(null, file);
    } catch (err) {
      this.emit('error', new PluginError('customTask', err));
      cb();
    }
  });
}

// Fonts with error handling
function fonts() {
  return gulp
    .src(paths.fonts.src)
    .on('error', handleError('Fonts'))
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browserSync.stream());
}

// Static files with error handling
function staticFiles() {
  return gulp
    .src(paths.static.src)
    .on('error', handleError('Static Files'))
    .pipe(gulp.dest(paths.static.dest))
    .pipe(browserSync.stream());
}

// Task to clear browser cache during development
function clearCache() {
  if (isDevelopment) {
    log(colors.yellow('🧹 Clearing browser cache...'));
    browserSync.reload({
      stream: false,
      once: true,
    });
  }
  return Promise.resolve();
}

// Hard reload task for stubborn cache issues
function hardReload() {
  log(colors.yellow('🔄 Performing hard reload...'));

  browserSync.notify('Performing hard reload...', 3000);

  setTimeout(() => {
    browserSync.reload({
      stream: false,
      once: true,
    });
  }, 500);

  return Promise.resolve();
}

// Enhanced watch with proper error handling
function watch() {
  gulp
    .watch(paths.styles.stylesPages, gulp.series(scssTemplateCreater, styles))
    .on('error', (err) => log(colors.red('Watch Error (styles pages):'), err));

  gulp
    .watch(paths.styles.src, styles)
    .on('error', (err) => log(colors.red('Watch Error (styles):'), err));

  // Templates
  gulp
    .watch(paths.templates.src, templates)
    .on('error', (err) => log(colors.red('Watch Error (templates):'), err));

  // SVG Sprite
  gulp
    .watch(
      paths.svgSprite.src,
      gulp.series(svgSprite, (done) => {
        if (browserSync.active) {
          browserSync.reload();
        }
        done();
      }),
    )
    .on('error', (err) => log(colors.red('Watch Error (svg sprite):'), err));

  // Images
  gulp
    .watch(paths.images.src, images)
    .on('error', (err) => log(colors.red('Watch Error (images):'), err));

  // Fonts
  gulp
    .watch(paths.fonts.src, fonts)
    .on('error', (err) => log(colors.red('Watch Error (fonts):'), err));

  // Static files
  gulp
    .watch(paths.static.src, staticFiles)
    .on('error', (err) => log(colors.red('Watch Error (static):'), err));

  // ✅ Scripts - webpack watch запускається ОДИН РАЗ
  scripts.watch();

  log(colors.green('👀 Watching for file changes...'));
  log(colors.cyan('💡 CSS will be injected, HTML/JS will reload\n'));
}

function serve() {
  try {
    browserSync.init(
      {
        server: {
          baseDir: paths.root,
          serveStaticOptions: {
            extensions: ['html'],
            setHeaders: (res, filePath) => {
              const ext = path.extname(filePath).toLowerCase();

              if (isDevelopment) {
                // Development mode - minimal caching
                if (ext === '.html') {
                  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                  res.setHeader('Pragma', 'no-cache');
                  res.setHeader('Expires', '0');
                } else if (ext === '.css' || ext === '.js') {
                  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
                  res.setHeader('Pragma', 'no-cache');
                  res.setHeader('Expires', '0');
                } else if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
                  res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
                } else {
                  res.setHeader('Cache-Control', 'no-cache');
                }
              } else {
                // Production mode - normal caching
                if (ext === '.html') {
                  res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
                } else if (ext === '.css' || ext === '.js') {
                  res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
                } else if (['. jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
                  res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days
                }
              }

              // Add ETag for better version control
              res.setHeader('ETag', `"${Date.now()}"`);
            },
          },
        },
        open: true,
        notify: true, // ✅ Увімкнути для кращого фідбеку
        ghostMode: false,
        reloadOnRestart: true,
        reloadDelay: 0,
        logLevel: 'info',
        logPrefix: 'BS',
        injectChanges: true,
        socket: {
          socketIoOptions: {
            log: false,
          },
        },
        snippetOptions: {
          rule: {
            match: /<\/body>/i,
          },
        },
      },
      // ✅ ДОДАЛИ ТІЛЬКИ CALLBACK
      function (err, bs) {
        if (err) {
          log(colors.red('BrowserSync init error:'), err);
        } else {
          log(colors.green('🚀 BrowserSync started'));
          log(colors.cyan('💉 CSS injection enabled'));
          log(colors.cyan('🔄 HTML/JS reload enabled\n'));
        }
      },
    );
  } catch (err) {
    log(colors.red('BrowserSync Error:'), err.message);
  }
}

// Define base task bundles with error-handled scripts
const basicTasks = [
  styles,
  templates,
  fonts,
  images,
  svgSprite,
  staticFiles,
  scriptsWithErrorHandling,
];

// Define complex tasks with error handling
const build = gulp.series(
  clean,
  scssTemplateCreater,
  gulp.parallel(
    ...basicTasks.map((task) => {
      return function wrappedTask() {
        return task().on('error', function (err) {
          log(colors.red(`Build Error in ${task.name}:`), err.message);
          this.emit('end');
        });
      };
    }),
  ),
);

const dev = gulp.series(build, gulp.parallel(watch, serve));

// Export tasks
exports.clean = clean;
exports.templates = templates;
exports.styles = styles;
exports.fonts = fonts;
exports.images = images;
exports.svgSprite = svgSprite;
exports.staticFiles = staticFiles;
exports.scssTemplateCreater = scssTemplateCreater;
exports.scripts = scriptsWithErrorHandling;
exports.customTask = customTask;
exports.clearCache = clearCache;
exports.hardReload = hardReload;
exports.build = build;
exports.dev = dev;
exports.default = dev;

// Add a task to test error handling
exports.test = function () {
  log(colors.blue('Testing error handling...'));
  return gulp.src('non-existent-file.js').on('error', handleError('Test'));
};

log(colors.cyan('🛠️  Gulpfile loaded with enhanced error handling and optimized caching'));
