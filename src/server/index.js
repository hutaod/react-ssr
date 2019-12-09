import { renderToString } from 'react-dom/server'
import express from 'express'
import App from '../client/App'

const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
  const content = renderToString(App)
  console.log(content)

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
