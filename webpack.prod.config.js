/**
 * Webpack production config
 */

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.config.js');

module.exports = Merge(CommonConfig, {
  module: {
    loaders: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                minimize: true,
                discardComments: {
                  removeAll: true
                }
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [require('autoprefixer')]
              }
            },
            {
              // options: { sourceMap: true },
              loader: 'sass-loader'
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),

    // When using new UglifyJsPlugin and --opimize-minimize (or -p) the
    //   UglifyJsPlugin is running twice. Omit the CLI option.
    // https://github.com/webpack/webpack/issues/1385
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true, // Default is false
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        drop_console: true,
        screw_ie8: true
      },
      comments: false
    })
  ]
});
