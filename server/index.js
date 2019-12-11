import { renderToString } from 'react-dom/server'
import express from 'express'
import React from 'react'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import App from '../src/App'
import store from '../src/store'

const app = express()

app.use(express.static('public'))

app.get('*', (req, res) => {
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>{App}</StaticRouter>
    </Provider>
  )

  res.send(`
    <!doctype html>
    <html>
      <head>
        <title>react ssr</title>
        <meta charset="utf-8" />
      </head>
      <body>
        <div id="root">${content}</div>
        <script src="bundle.js"></script>
      </body>
    </html>
  `)
})

app.listen(8091, () => {
  console.log('监听完毕')
})
