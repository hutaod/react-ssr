const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

const resolvePath = pathStr => path.resolve(__dirname, pathStr)

const isProd = process.env.NODE_ENV === 'production';

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
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: `${process.env.NODE_ENV}`},
      '__IS_PROD__': isProd
    }),
  ],
  resolve: {
    alias: {
      "@dist": path.resolve(__dirname, '../dist')
    }
  }
}

module.exports = config
