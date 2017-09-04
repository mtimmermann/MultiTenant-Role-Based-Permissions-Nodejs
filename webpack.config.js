/**
 * Webpack development config
 */

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */

const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

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
                minimize: false,
                discardComments: {
                  removeAll: false
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
    // new BrowserSyncPlugin({
    //   server: {
    //     baseDir: ['dist']
    //   },
    //   port: 3000,
    //   host: 'localhost',
    //   open: false,

    //   // Set to true if you want this served up on external ip,
    //   // however, requires network connection and hangs when set to true
    //   online: false
    // })
  ]
});
