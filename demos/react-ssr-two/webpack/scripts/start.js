const { spawn } = require("child_process") // 用于创建子进程
const constantCode = require("./constant")
const chalk = require("chalk") // 为控制台输出添加色彩
const log = console.log

log(chalk.red('servers starting....'));

// 前端代码构建 服务进程
const feCodeWatchProcess = spawn('npm', ['run', 'fe:watch'], { stdio:'inherit', shell: process.platform === 'win32' })

// 服务端代码监控和编译进程
const svrCodeWatchProcess = spawn('npm', ['run', 'svr:watch'], { shell: process.platform === 'win32' })

// node进程
let nodeServerProcess = null
// 启动node进程
const startNodeServer = () => {
  nodeServerProcess && nodeServerProcess.kill()
  nodeServerProcess = spawn("node", ['./webpack/scripts/svr-dev-server.js'])
  nodeServerProcess.stdout.on("data", print)
}

function print(data) {
  let str = data.toString();
  // 接收到服务端代码编译完成的通知
  if (str.indexOf(constantCode.SVRCODECOMPLETED) > -1) {
    // 重启 node 服务
    startNodeServer()
  } else {
    console.log(str)
  }
}

// 监听服务端代码构建服务的对外输出 stdout 事件
svrCodeWatchProcess.stdout.on('data', print)

const killChild = () => {
  svrCodeWatchProcess && svrCodeWatchProcess.kill()
  nodeServerProcess && nodeServerProcess.kill()
  feCodeWatchProcess && feCodeWatchProcess.kill()
}

// 主进程关闭退出子进程
process.on("close", code => {
  console.log('main process  close', code);
  killChild()
})

// 主进程关闭退出子进程
process.on('exit', code => {
  console.log('main process  exit', code);
  killChild();
});

// 非正常退出情况
process.on('SIGINT', function () {
  svrCodeWatchProcess.stdin.write('exit', (error) => {
      console.log('svr code watcher process exit!');
  });
  killChild();
});