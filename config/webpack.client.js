const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, '../client/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../public'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
