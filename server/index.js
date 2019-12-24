import path from 'path'
import fs from 'fs'
import { renderToString } from 'react-dom/server'
import express from 'express'
import proxy from 'http-proxy-middleware'
import React from 'react'
import { Provider } from 'react-redux'
import chalk from 'chalk'
import axios from '../src/utils/axios'
import { StaticRouter, Route, matchPath, Switch } from 'react-router-dom'
import routes from '../src/App'
import Header from '../src/components/Header'
import { getServerStore } from '../src/store'

const app = express()
const store = getServerStore()

app.use(express.static('public'))

app.use('/api', proxy({ target: 'http://localhost:9090/', changeOrigin: true }))

function renderCsr(res) {
  const fileUrl = path.resolve(process.cwd(), 'public/index.csr.html')
  let csrHtml
  try {
    csrHtml = fs.readFileSync(fileUrl, 'utf-8')
  } catch (error) {
    csrHtml = '静态文件错误'
  }
  return res.send(`${csrHtml}`)
}

app.get('*', (req, res) => {
  console.log(req.query._mode)

  if (req.query._mode === 'csr') {
    // url参数开启csr降级
    console.log('url参数开启csr降级')
    return renderCsr(res)
  }

  // 配置开关开启csr

  // 服务器负载过高，自动开启csr

  // 获取匹配路由中需要初始化请求数据的方法
  const promises = []
  routes.some(route => {
    const loadData = route.component.loadData

    if (matchPath(req.path, route) && typeof loadData === 'function') {
      // promises.push(loadData(store))
      // 处理异步任务报错，页面不会渲染
      promises.push(
        new Promise(resolve => {
          loadData({ ...store, axios })
            .then(resolve)
            .catch(err => {
              console.error(chalk.redBright(err))
              resolve(err)
            })
        })
      )
    }
  })

  // 等待所有异步任务执行完毕后再进行响应客户端
  Promise.all(promises).then(data => {
    const context = {
      css: []
    }

    const content = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <Header />
          <Switch>
            {routes.map(route => (
              <Route {...route} />
            ))}
          </Switch>
        </StaticRouter>
      </Provider>
    )

    if (context.status === 404) {
      res.status(404)
    }

    if (context.action === 'REPLACE' && context.url) {
      // bu return会报错
      return res.redirect(301, context.url)
    }

    // console.log(context)

    // 向window.__context注入服务端store的内容
    const initialState = `
      <script>
        window.__context = ${JSON.stringify(store.getState())}
      </script>
    `
    const cssContent = context.css.join('\n')

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>react ssr</title>
          <meta charset="utf-8" />
          <style>
            ${cssContent}
          </style>
          ${initialState}
        </head>
        <body>
          <div id="root">${content}</div>
          <script src="bundle.js"></script>
        </body>
      </html>
    `)
  })
})

app.listen(8091, () => {
  console.log('监听完毕')
})
