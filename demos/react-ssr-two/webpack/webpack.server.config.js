const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const webpack = require('webpack')

const resolvePath = pathStr => path.resolve(__dirname, pathStr)

/**
 * @type {webpack.Configuration}
 */
const config = {
  target: 'node',
  entry: '../src/server/app/index.js',
  output: {
    filename: 'app.js',
    path: resolvePath('../dist/server')
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  }
}

module.exports = config
