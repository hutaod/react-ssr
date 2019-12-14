# React 同构应用开发 - Step 1

1. 环境搭建
2. ssr 和 csr 入口文件配置
3. npm scripts 编写

## 环境搭建

初始化项目：

```bash
npm init -y
```

下载相关插件:

```bash
npm i -D webpack webpack-cli webpack-node-externals @babel/core babel-loader @babel/preset-env nodemon
npm i -S react react-dom express
```

编写 服务端 webpack 配置：

```js
// ./config/webpack.server.js
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  // 为了不把nodejs内置模块打包进进输出文件，例如：fs net 模块
  target: 'node',
  mode: 'development',
  entry: path.resolve(__dirname, '../server/index.js'),
  // 不把node_modules目录下的第三方模块打包进输出文件中
  externals: [nodeExternals()],
  output: {
    //为了以commonjs2规范导出渲染函数，以给采用nodejs编写的HTTP服务调用
    libraryTarget: 'commonjs2',
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../build')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
```

编写 客户端 webpack 配置：

```js
// ./config/webpack.client.js
const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, '../client/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
```

编写 babel 配置

```js
{
  "presets": ["@babel/preset-react", "@babel/preset-env"],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ]
  ]
}
```

新建 react 组件

```js
// src/App.js
import React, { useState } from 'react'

const App = ({ name }) => {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h3>
        hello {name} {count}
      </h3>
      <button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        Add
      </button>
    </div>
  )
}

export default <App name="哈哈" />
```

## ssr 和 csr 入口文件配置

客户端入口文件：

```js
// ./client/index.js
import ReactDom from 'react-dom'
import App from './App'

export default ReactDom.hydrate(App, document.getElementById('root'))
```

客户端入口文件配置：

```js
// ./client/index.js
import ReactDom from 'react-dom'
import App from '../src/App'

export default ReactDom.hydrate(App, document.getElementById('root'))
```

服务端入口文件配置：

```js
// ./server/index.js
import { renderToString } from 'react-dom/server'
import express from 'express'
import App from '../src/App'

const app = express()
// 设置静态文件默认位置
app.use(express.static('public'))

app.get('/', (req, res) => {
  // 把react组件转换为html字符串
  const content = renderToString(App)

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
```

## npm scripts 编写

```json
"scripts": {
  "dev:server": "webpack --config config/webpack.server.js --watch",
  "dev:client": "webpack --config config/webpack.client.js --watch",
  "dev:start": "nodemon --watch build exec node \"./build/bundle.js\"",
  "start": "npm run dev:server & npm run dev:client & npm run dev:start"
},
```

运行 npm start 后就可以同时启动开发环境了

## 结语

仓库代码地址：[https://github.com/ht1131589588/react-ssr/tree/step-1](https://github.com/ht1131589588/react-ssr/tree/step-1)
