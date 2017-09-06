/**
 * Webpack site-branding config
 */

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * Initialize company subdomain list for processing branding css files
 */
const subdomains = [
  'company123',
  'companyabc',
  'companyxyz'
];
const entryConfig = {};
subdomains.forEach((subdomain) => {
  entryConfig[subdomain] = `./client-branding/${subdomain}/site-branding.scss`;
});


/**
 * Setup css options, if prod minimize, discard comments
 */
const cssLoaderOptions = {
  sourceMap: true,
  minimize: false,
  discardComments: {
    removeAll: false
  }
};
if (process.env.arg === 'prod') {
  cssLoaderOptions.minimize = true;
  cssLoaderOptions.discardComments.removeAll = true;
}


module.exports = {
  context: path.resolve('./src'),
  entry: entryConfig,
  output: {
    path: path.resolve('./dist/'),
    filename: 'client-branding/js/[name].ignore.js',
    publicPath: '/'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: cssLoaderOptions,
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
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader']
        })
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist/client-branding'],
      {
        verbose: true
        // exclude: ['img/**/*'] // <- exclude does not work
      }
    ),
    new CopyWebpackPlugin([
      { from: './client-branding/**/*', to: './', ignore: '*.scss' }
    ]),
    new ExtractTextPlugin({
      filename: 'client-branding/[name]/css/site-branding.css',
      allChunks: true
    })
  ]
};
