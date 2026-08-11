const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

require('dotenv').config();

const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    'immediate-loading': './src/assets/scripts/immediate-loading.js',
    index: './src/assets/scripts/index-app.js',
    homepage: './src/assets/scripts/homepage.js',
    construction: './src/assets/scripts/construction.js',
    news: './src/assets/scripts/news.js',
    news_single: './src/assets/scripts/news-single.js',
    not_found: './src/assets/scripts/not-found.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/assets/scripts'),
    filename: '[name].bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            babelrc: false,
            configFile: false,
          },
        },
      },
      {
        test: /\.js$/,
        include: /node_modules\/(@studio-freight\/lenis)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/images/',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src/assets/scripts'), 'node_modules'],
  },
  optimization: {
    minimizer: [new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks(chunk) {
            return chunk.name !== 'immediate-loading';
          },
        },
      },
    },
    // КРИТИЧНО: Не зупиняємось при помилках в dev режимі
    emitOnErrors: isDevelopment,
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.DefinePlugin({
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY || ''),
    }),
  ],
  // КРИТИЧНО: не зупиняємось на першій помилці в dev
  bail: !isDevelopment,

  // Watch options
  watch: false, // Gulp керує watch mode
  watchOptions: {
    poll: 1000,
    ignored: /node_modules/,
    aggregateTimeout: 300,
  },

  stats: {
    colors: true,
    errors: true,
    warnings: true,
    errorDetails: true,
    modules: false,
    chunks: false,
    children: false,
    builtAt: true,
    timings: true,
  },

  infrastructureLogging: {
    level: 'warn',
  },

  // КРИТИЧНО для dev режиму
  devtool: isDevelopment ? 'eval-source-map' : false,
};

module.exports = config;
