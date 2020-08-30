import React from "react"
import Router from "../../client/router"
import routeConfig from "../../client/router/route-config"
import { StaticRouter } from "react-router-dom"
import { renderToString } from "react-dom/server"

export default (ctx, next) => {
  const path = ctx.request.path
  // 将组件转换为 html
  const html = renderToString(
    <StaticRouter location={path}>
      <Router routeList={routeConfig} />
    </StaticRouter>
  )

  ctx.body = (`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>React SSR Three</title>
    </head>
    <body>
      <div id="root">${html}</div>
      <script src="index.js"></script>
    </body>
    </html>
  `)
  return next()
}