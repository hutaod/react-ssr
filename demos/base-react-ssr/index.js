const React = require("react")
const { renderToString } = require("react-dom/server")

const http = require("http")

class Index extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <h1>Hello {this.props.name}</h1>
  }
}

http.createServer((req, res) => {
  res.writeHead(200, {
    'Context-Type': 'text/html'
  })
  // 将组件转换为 html
  const html = renderToString(<Index name="React SSR" />)

  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>React SSR First</title>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `)
}).listen(8001, () => {
  console.log('react ssr run in http://localhost:8001')
})