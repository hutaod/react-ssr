import React from "react"
import Index from "../../client/pages/Index"
import { renderToString } from "react-dom/server"

export default (ctx, next) => {
  // 将组件转换为 html
  const html = renderToString(<Index />)

  ctx.body = (`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>React SSR First</title>
    </head>
    <body>
      <div id="root">${html}</div>
      <script src="index.js"></script>
    </body>
    </html>
  `)
  return next()
}