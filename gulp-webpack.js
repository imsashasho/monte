const webpack = require('webpack');
const log = require('fancy-log');
const colors = require('ansi-colors');
const path = require('path');
const fs = require('fs');
const through = require('through2');

// Track compilation state
let compiler = null;
let isFirstCompilation = true;
let isWatching = false;
let browserSyncInstance = null;

// ✅ Функція для отримання BrowserSync інстансу
function getBrowserSync() {
  if (browserSyncInstance) {
    return browserSyncInstance;
  }

  try {
    const browserSync = require('browser-sync');
    browserSyncInstance = browserSync.get('bs-config'); // Отримуємо named instance
    return browserSyncInstance;
  } catch (err) {
    // Якщо named instance не знайдено, пробуємо отримати активний
    try {
      const browserSync = require('browser-sync');
      const instances = browserSync.instances;
      if (instances && instances.length > 0) {
        browserSyncInstance = instances[0];
        return browserSyncInstance;
      }
    } catch (e) {
      // Ігноруємо
    }
  }

  return null;
}

// Ensure directory exists helper
function ensureDirectoryExists(dirPath) {
  const resolvedPath = path.resolve(dirPath);
  if (!fs.existsSync(resolvedPath)) {
    fs.mkdirSync(resolvedPath, { recursive: true });
    log(colors.gray(`📁 Created directory: ${dirPath}`));
  }
}

// Create webpack compiler instance
function createCompiler() {
  if (compiler) {
    return compiler;
  }

  // Ensure output directory exists
  ensureDirectoryExists('./dist');
  ensureDirectoryExists('./dist/assets');
  ensureDirectoryExists('./dist/assets/scripts');

  // Load webpack config
  let webpackConfig;
  try {
    delete require.cache[require.resolve('./webpack.config.js')];
    webpackConfig = require('./webpack.config.js');
  } catch (err) {
    log(colors.red('❌ Failed to load webpack.config.js:'), err.message);
    throw err;
  }

  // Create compiler
  compiler = webpack(webpackConfig);

  // Add hooks for better logging
  compiler.hooks.compile.tap('GulpWebpack', () => {
    log(colors.blue('⚙️  Webpack: Starting compilation...'));
  });

  compiler.hooks.done.tap('GulpWebpack', (stats) => {
    const info = stats.toJson({
      errors: true,
      warnings: true,
      errorDetails: true,
      chunks: false,
      modules: false,
      children: false,
    });

    const hasErrors = stats.hasErrors();
    const hasWarnings = stats.hasWarnings();

    if (hasErrors) {
      log(colors.red('\n❌ Webpack: Compilation FAILED\n'));

      info.errors.forEach((error, index) => {
        log(colors.red(`Error ${index + 1}:`));

        const errorStr = typeof error === 'string' ? error : error.message || error.toString();

        // Parse file path
        const fileMatch = errorStr.match(/\.\/src\/.*? \.js/);
        if (fileMatch) {
          log(colors.yellow('  📁 File:'), fileMatch[0]);
        }

        // Parse line and column
        const locationMatch = errorStr.match(/\((\d+):(\d+)\)/);
        if (locationMatch) {
          log(
            colors.yellow('  📍 Location:'),
            `Line ${locationMatch[1]}, Column ${locationMatch[2]}`,
          );
        }

        // Parse error type
        const errorTypeMatch = errorStr.match(
          /(SyntaxError|TypeError|ReferenceError|Error): (.+?)(?:\(|\n|$)/,
        );
        if (errorTypeMatch) {
          log(colors.red('  💥 Error:'), `${errorTypeMatch[1]}: ${errorTypeMatch[2].trim()}`);
        }

        // Show code snippet if available
        const lines = errorStr.split('\n');
        const relevantLines = lines
          .filter((line) => line.includes('>') || line.match(/^\s+\d+\s+\|/))
          .slice(0, 5);

        if (relevantLines.length > 0) {
          log(colors.gray('  Code:'));
          relevantLines.forEach((line) => {
            log(colors.gray(`    ${line}`));
          });
        }

        log('');
      });

      // ✅ Browser notification
      const bs = getBrowserSync();
      if (bs && bs.active) {
        bs.notify('❌ Webpack Error!  Check console.', 5000);
      }

      log(colors.cyan('👂 Fix the error and save - watching for changes...\n'));
    } else if (hasWarnings) {
      log(colors.yellow('\n⚠️  Webpack: Compiled with warnings\n'));
      info.warnings.forEach((warning, index) => {
        const warningStr =
          typeof warning === 'string' ? warning : warning.message || warning.toString();
        log(colors.yellow(`Warning ${index + 1}:`), warningStr.split('\n')[0]);
      });
      log('');

      // ✅ RELOAD on successful compilation with warnings
      if (!isFirstCompilation) {
        log(colors.cyan('🔄 Reloading browser (with warnings)...'));
        setTimeout(() => {
          const bs = getBrowserSync();
          if (bs && bs.active) {
            bs.reload();
            log(colors.green('✅ Browser reloaded! '));
          } else {
            log(colors.yellow('⚠️  BrowserSync not active yet'));
          }
        }, 100);
      }
    } else {
      const time = stats.endTime - stats.startTime;
      log(colors.green(`✅ Webpack: Compiled successfully in ${time}ms`));

      // ✅ RELOAD BROWSER on successful compilation
      if (!isFirstCompilation) {
        log(colors.cyan('🔄 Reloading browser...'));
        setTimeout(() => {
          const bs = getBrowserSync();
          if (bs && bs.active) {
            bs.reload();
            log(colors.green('✅ Browser reloaded! '));
          } else {
            log(colors.yellow('⚠️  BrowserSync not active yet'));
          }
        }, 100);
      }
    }

    isFirstCompilation = false;
  });

  compiler.hooks.failed.tap('GulpWebpack', (error) => {
    log(colors.red('\n❌ Webpack: Fatal error\n'));
    log(colors.red(error.message));
    if (error.stack) {
      log(colors.gray(error.stack));
    }
    log('');

    const bs = getBrowserSync();
    if (bs && bs.active) {
      bs.notify('💥 Webpack Fatal Error! ', 5000);
    }
  });

  return compiler;
}

// Initial build - ПОВЕРТАЄ STREAM!
function scripts(done) {
  const compiler = createCompiler();

  log(colors.blue('📦 Running initial webpack build...'));

  // Створюємо порожній stream для gulp
  const stream = through.obj();

  compiler.run((err, stats) => {
    if (err) {
      log(colors.red('❌ Webpack build error:'), err.message);
      stream.emit('error', err);
      if (done) done(err);
      return;
    }

    // Завершуємо stream
    stream.end();
    if (done) done();
  });

  // ПОВЕРТАЄМО STREAM!
  return stream;
}

// Watch mode
function scriptsWatch(done) {
  if (isWatching) {
    log(colors.yellow('⚠️  Webpack is already watching'));
    if (done) done();
    return;
  }

  const compiler = createCompiler();

  log(colors.blue('👁️  Starting webpack watch mode...'));

  compiler.watch(
    {
      poll: 1000,
      ignored: /node_modules/,
      aggregateTimeout: 300,
    },
    (err, stats) => {
      if (err) {
        log(colors.red('❌ Webpack watch error:'), err.message);
        return;
      }
      // Stats are already logged by hooks
    },
  );

  isWatching = true;
  log(colors.green('✅ Webpack watch mode started\n'));

  if (done) done();
}

// Stop watching
function scriptsStopWatch() {
  if (compiler && isWatching) {
    return new Promise((resolve) => {
      compiler.close(() => {
        log(colors.yellow('Webpack watch stopped'));
        isWatching = false;
        compiler = null;
        resolve();
      });
    });
  }
  return Promise.resolve();
}

// Reset state
function resetState() {
  isFirstCompilation = true;
  log(colors.gray('🔄 Webpack state reset'));
}

module.exports = scripts;
module.exports.watch = scriptsWatch;
module.exports.stopWatch = scriptsStopWatch;
module.exports.resetState = resetState;
