process.on('unhandledRejection', err => {
  console.error('Error caught in unhandledRejection event:', err);
});

process.on('uncaughtException', err => {
  console.error('Error caught in uncaughtException event:', err);
});

const reactSSR  = require('../middlewares/react-ssr').default;
const Koa = require('koa')
const koaStatic = require('koa-static')
const path = require("path")
const proConfig = require("../../share/pro-config")
const port = proConfig.nodeServerPort || process.env.PORT;
const app = new Koa()

// 跨域设置
app.use(async (ctx, next)=> {
  if(ctx.host.indexOf("localhost") > -1) {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS'); 
  }
  await next();
});

app.use((ctx, next) => {
  if(ctx.request.path === '/favicon.ico') {
    ctx.body = ""
    return 
  }
  return next()
})
// 设置可以访问的静态资源，我们把webpack打包后的代码放到/dist/static目录下
app.use(koaStatic('./dist/static'))
// 使用react ssr中间件
app.use(reactSSR)
app.listen(port, () => {
  console.log(`react ssr run in http://localhost:${port}`)
})

