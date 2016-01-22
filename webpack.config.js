/* eslint-disable no-process-env */
const path = require('path')
const webpack = require('webpack')

const config = {
  target: 'web',
  entry: {
    app: path.join(__dirname, 'src', 'index.js'),
    common: ['react', 'react-dom', 'imboclient']
  },
  output: {
    path: path.join(__dirname, 'public', 'js'),
    filename: '[name].js',
    publicPath: '/js',
    pathInfo: true
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common', 'common.js')
  ]
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.DedupePlugin())
  config.plugins.push(new webpack.optimize.OccurenceOrderPlugin(true))
} else {
  config.cache = true
  config.devtool = 'cheap-module-source-map'
}

module.exports = config
