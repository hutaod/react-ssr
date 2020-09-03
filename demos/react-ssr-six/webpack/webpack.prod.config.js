const webpack = require("webpack")
const path = require("path")
// 提取 css 插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// 生成 manifest 方便定位对应的资源文件
const ManifestPlugin = require('webpack-manifest-plugin');
// 压缩和优化 css
// const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
// 压缩 js 插件 内置了
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

process.env.BABEL_ENV = 'development' ;//指定 babel 编译环境

//构建前清理目录
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');

// 定义一个通用的路径转换方法
const resolvePath = pathstr => path.resolve(__dirname, pathstr)

/**
 * @type {webpack.Configuration}
 */
module.exports = {
  mode: "production",
  // 入口文件
  entry: {
    main: resolvePath("../src/client/app/index.js"),
  },
  output: {
    // 设置打包后的文件名
    filename: "js/[name].[chunkhash:8].js",
    // 设置构建结果的输出目录
    path: resolvePath("../dist/static"),
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    },{
      test: /\.(sa|sc|c)ss$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader
        },
        {
          loader: "css-loader",
        },
        {
          loader: "postcss-loader",
          options: {
            plugins: [require("autoprefixer")]
          }
        },
        {
          loader: "sass-loader",
        },
      ],
    }, {
      test: /\.(png|jpe?g|gif)?$/,
      use: [{
        loader: "file-loader",
        options: {
          name: 'img/[name].[ext]' // 配置图片的输出路径和名称
        }
      }]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css' // 设置名称
    }),
    // 清理上一次构建文件
    //生成 manifest 方便定位对应的资源文件
    new ManifestPlugin({
      fileName: '../server/asset-manifest.json',
    }),
    new CleanWebpackPlugin(),
    // 会默认自定义一些值
    // new webpack.DefinePlugin({
    //   'process.env': { NODE_ENV: 'production'}, // 标识生产环境
    //   '__IS_PROD__': true // 方便在代码中使用
    // })
  ],
  optimization: {
    // minimizer: [
    //   // 压缩js
    //   new UglifyJsPlugin({
    //     uglifyOptions: {
    //       compress: {
    //         drop_console: true,
    //         drop_debugger: true
    //       },
    //       warnings: false,
    //       ie8: true,
    //       output: {
    //         comments: false,
    //       },
    //     },
    //     cache: true,
    //     sourceMap: true,
    //   }),
    //   // 压缩css
    //   new OptimizeCssAssetsPlugin()
    // ],
    splitChunks: {
      cacheGroups: {
        thirds: { // 抽离第三方库
          test: /node_modules/, // 指定node_modules下的包
          chunks: "initial",
          name: "thirds", // 打包后的文件名    
        }
      }
    }
  }
}