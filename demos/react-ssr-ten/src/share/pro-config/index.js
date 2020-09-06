// 双端公用的配置文件
module.exports = {
  wdsPort: 8002, // webpack dev server 服务的运行端口
  nodeServerPort: 8001, // node server 的监听端口
  asyncComponentKey: '__IS_ASYNC_COMP_FLAG__', // 用于标识组件是否是按需加载
}
