const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

const resolvePath = pathStr => path.resolve(__dirname, pathStr)

process.env.BABEL_ENV = 'node'; // 设置 babel 的运行环境

/**
 * @type {webpack.Configuration}
 */
const config = {
  mode: 'development',
  target: 'node',
  node: {
    __dirname: true,
    __filename: true,
  },
  entry: resolvePath('../src/server/app/index.js'),
  output: {
    filename: 'app.js',
    path: resolvePath('../dist/server')
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  }
}

module.exports = config
