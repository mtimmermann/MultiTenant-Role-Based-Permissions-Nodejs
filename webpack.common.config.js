/**
 * Webpack common/base config
 */

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: path.resolve('./src'),
  // entry: './jsx/main.jsx',
  entry: './jsx/index.jsx',
  output: {
    path: path.resolve('./dist/'),
    filename: 'js/main.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        // test: /\.js$|\.jsx$/,
        test: /\.jsx?$/, // Both .js and .jsx
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader'
        // options: {
        //   eslintPath: path.join(__dirname, '.eslintrc.js'),
        //   // emitWarning: true,
        //   // emitError: true,
        //   // failOnWarning: true,
        //   // failOnError: true
        // }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: { presets: ['es2015'] }
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: { presets: ['es2015', 'react'] }
      },

      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader']
        })
      },

      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'file-loader?name=img/[name].[ext]'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'],
      {
        verbose: true
        // exclude: ['img/**/*'] // <- exclude does not work
      }
    ),
    new CopyWebpackPlugin([
      { from: './manifest.json' },
      { from: './manifest.webapp' },
      { from: './robots.txt' },
      { from: './favicon.ico' },
      { from: './img/**/*', to: './' },
      { from: './client-html/**/*', to: './' },
      { from: '../node_modules/react-table/react-table.css', to: './css' }
    ]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new HtmlWebpackPlugin({
      template: './index.html',

      // true is default. True will automatically inject
      // the built.js script into the html
      inject: false
    }),
    new ExtractTextPlugin({
      filename: 'css/style.css',
      allChunks: true
    })
  ]
};
