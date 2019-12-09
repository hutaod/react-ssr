const path = require('path')
const nodeExternals = require('webpack-node-externals')
console.log(path.resolve(__dirname, '../build'))

module.exports = {
  target: 'node',
  mode: 'development',
  entry: path.resolve(__dirname, '../src/server/index.js'),
  externals: [nodeExternals()],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../build')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
