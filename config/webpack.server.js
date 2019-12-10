/**
 * 注意点：
 * 1. target: 'node' 由于输出代码的运行环境是node，源码中依赖的node原生模块没必要打包进去
 * 2. externals: [nodeExternals()] webpack-node-externals的目的是为了
 *    防止node_modules目录下的第三方模块被打包进去，
 *    因为nodejs默认会去node_modules目录下去寻找和使用第三方模块。
 * 3. { test: /\.css/, use: ['ignore-loader'] }
 *    忽略掉依赖的css文件，css会影响服务端渲染性能，又是做服务端渲染不重要的部分
 * 4. libraryTarget： 'commonjs2'以commonjs2规范导出渲染函数，
 *     以供给采用nodejs编写的http服务器代码调用。
 */
const path = require('path')
const nodeExternals = require('webpack-node-externals')
console.log(path.resolve(__dirname, '../build'))

module.exports = {
  // 为了不把nodejs内置模块打包进进输出文件，例如：fs net 模块
  target: 'node',
  mode: 'development',
  entry: path.resolve(__dirname, '../src/server/index.js'),
  // 不把node_modules目录下的第三方模块打包进输出文件中
  externals: [nodeExternals()],
  output: {
    //为了以commonjs2规范导出渲染函数，以给采用nodejs编写的HTTP服务调用
    libraryTarget: 'commonjs2',
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
      // {
      //   // css代码不能被打包进服务端的代码中去，忽略掉css文件
      //   test: /\.css/,
      //   use: ['ignore-loader']
      // }
    ]
  }
}
