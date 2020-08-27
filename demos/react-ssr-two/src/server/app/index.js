const reactSSR  = require('../middlewares/react-ssr').default;
const Koa = require('koa')
const koaStatic = require('koa-static')
const path = require("path")

const app = new Koa()

// 设置可以访问的静态资源，我们把webpack打包后的代码放到/dist/static目录下
app.use(koaStatic(
  path.join(__dirname, '../../../dist/static')
))

// 使用react ssr中间件
app.use(reactSSR)

app.listen(8001, () => {
  console.log('react ssr run in http://localhost:8001')
})

