// 获取webpack dev 环境配置
const webpack = require('webpack')
const chalk = require('chalk')
const WebpackDevServer = require('webpack-dev-server');
const clientConfig = require('../webpack.dev.config')
// wds 配置
const getWdsConfig = require('../webpack-dev-server.config');
const proConfig = require('../../src/share/pro-config');

const HOST = 'localhost'
const WDS_PORT = proConfig.wdsPort

// 获取webpack compiler
function getWebpackCompiler() {
  return webpack(clientConfig)
}

// 创建 wds 服务
function createWdsServer(port) {
  let compiler = getWebpackCompiler();
  compiler.hooks.done.tap('done', data => {
    console.log('\n wds server compile done'); // 编译完成时的提示 
  })
  return new WebpackDevServer(compiler, getWdsConfig(port, clientConfig.output.publicPath))
}

// 启动 WebpackDevServer
function runWdsServer() {
  let devServer = createWdsServer(WDS_PORT)
  devServer.listen(WDS_PORT, HOST, err => {
    if(err) {
      return console.log(err)
    }
    console.log(chalk.cyan('🚀 Starting the development node server,please wait....\n'));
  })
}

runWdsServer()