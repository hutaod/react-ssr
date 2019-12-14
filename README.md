# React 同构应用

首先从以下几个疑问入手：

1. 渲染的概念是什么？
2. 什么是服务端渲染? (服务端渲染的运行机制)
3. 什么是客户端渲染？
4. 为什么需要使用服务端渲染？服务端渲染的解决了什么问题？

## 渲染的概念

我们可以单纯的把渲染理解为：`渲染就是将数据和模版组装成html`

## 客户端渲染（CSR）

### 1. 概念：

`解释一`：客户端渲染模式下，服务端把渲染的静态文件给到客户端，客户端拿到服务端发送过来的文件自己跑一遍 js，根据 JS 运行结果，生成相应 DOM，然后渲染给用户。

`解释二`：html 仅仅作为静态文件，客户端在请求时，服务端不做任何处理，直接以原文件的形式返回给客户端客户端，然后根据 html 上的 JavaScript，生成 DOM 插入 html。

`延伸`：前端渲染的方式起源于 JavaScript 的兴起，ajax 的大热更是让前端渲染更加成熟，前端渲染真正意义上的实现了前后端分离，前端只专注于 UI 的开发，后端只专注于逻辑的开发，前后端交互只通过约定好的 API 来交互，后端提供 json 数据，前端循环 json 生成 DOM 插入到页面中去。

### 2. 利弊：

`好处`：网络传输数据量小、减少了服务器压力、前后端分离、局部刷新，无需每次请求完整页面、交互好可实现各种效果

`坏处`: 不利于 SEO、爬虫看不到完整的程序源码、首屏渲染慢（渲染前需要下载一堆 js 和 css 等，而且很多并不是首页需要的 js 和 css(按需加载可以加快首屏加载)）

## 服务端渲染（SSR）

### 1. 概念：

`解释一`：服务端在返回 html 之前，先获取数据填充 html 模板，再给客户端，客户端只负责解析 HTML 。

`解释二`：服务端渲染的模式下，当用户第一次请求页面时，由服务器把需要的组件或页面渲染成 HTML 字符串，然后把它返回给客户端。客户端拿到手的，是可以直接渲染然后呈现给用户的 HTML 内容，不需要为了生成 DOM 内容自己再去跑一遍 JS 代码。使用服务端渲染的网站，可以说是“所见即所得”，页面上呈现的内容，我们在 html 源文件里也能找到。

### 2. 利弊：

`好处`：首屏渲染快、利于 SEO、可以生成缓存片段，生成静态化文件、节能（对比客户端渲染的耗电）

`坏处`: 传统服务端渲染的用户体验较差、不容易维护，通常前端改了部分 html 或者 css，后端也需要修改。

## 客户端渲染（CSR）VS 服务端渲染（SSR）

其实前后端的渲染本质是一样的，都是字符串的拼接，将数据渲染进一些固定格式的 html 代码中形成最终的 html 展示在用户页面上。 因为字符串的拼接必然会损耗一些性能资源。

- 服务器端渲染，消耗的是 server 端的性能
- 客户端渲染，常见的手段，比如是直接生成 DOM 插入到 html 中，或者是使用一些前端的模板引擎等。他们初次渲染的原理大多是将原 html 中的数据标记（例如{{text}}）替换。

为了更便于理解，下面几段话摘自掘金小册：

```
事实上，很多网站是出于效益的考虑才启用服务端渲染，性能倒是在其次。
假设 A 网站页面中有一个关键字叫“前端性能优化”，这个关键字是 JS 代码跑过一遍后添加到 HTML 页面中的。那么客户端渲染模式下，我们在搜索引擎搜索这个关键字，是找不到 A 网站的——搜索引擎只会查找现成的内容，不会帮你跑 JS 代码。A 网站的运营方见此情形，感到很头大：搜索引擎搜不出来，用户找不到我们，谁还会用我的网站呢？为了把“现成的内容”拿给搜索引擎看，A 网站不得不启用服务端渲染。
但性能在其次，不代表性能不重要。服务端渲染解决了一个非常关键的性能问题——首屏加载速度过慢。在客户端渲染模式下，我们除了加载 HTML，还要等渲染所需的这部分 JS 加载完，之后还得把这部分 JS 在浏览器上再跑一遍。这一切都是发生在用户点击了我们的链接之后的事情，在这个过程结束之前，用户始终见不到我们网页的庐山真面目，也就是说用户一直在等！相比之下，服务端渲染模式下，服务器给到客户端的已经是一个直接可以拿来呈现给用户的网页，中间环节早在服务端就帮我们做掉了，用户岂不“美滋滋”？
```

## 为何需要使用 ssr

首屏加载速度快、SEO 优化

## 为了合并 ssr 和 csr,当前流行的方案就是 ssr+csr 同构

### 何为同构？

同构是指写一份代码但可同时在浏览器和服务器中运行的应用。

### 认识同构

同构应用运行原理的核心在于虚拟 DOM， 虚拟 DOM 的优点在于：

1. 因为操作 DOM 树是高耗时的操作，尽量减少 DOM 树操作能优化网页性能。而 DOM Diff 算法能找出 2 个不同 Object 的最小差异，得出最小 DOM 操作;
2. 虚拟 DOM 的在渲染的时候不仅仅可以通过操作 DOM 树来表示结果，也能有其他的表示方法。例如虚拟 DOM 渲染成字符串（服务器渲染）等。

构建同构应用的最终目的是从一份项目源码中构建出 2 份 JavaScript 代码。一份用于在 node 环境中运行渲染出 HTML。其中用于在 node 环境中运行的 JavaScript 代码需要注意：

1. 不能包含浏览器环境提供的 API；
2. 不能包含 css 代码，因为服务端渲染的目的是渲染 html 内容， 渲染出 css 代码会增加额外的计算量，影响服务端渲染；
3. 不能像用于浏览器环境的输出代码那样把 node_modules 里的第三方模块和 nodejs 原生模块打包进去，而是需要通过 commonjs 规范去引入这些模块。
4. 需要通过 commonjs 规范导出一个渲染函数，以用于在 HTTP 服务器中执行这个渲染函数，渲染出 HTML 内容返回。

## 实现 react ssr+csr 同构

`react-dom`在渲染虚拟 dom 树时有 3 种方式可选:

1. 通过`render()`把 react 组件挂载到浏览器 DOM 上
2. 通过`renderToString()`把 react 组件解析成 表示虚拟 DOM 的 html 字符
3. `hydrate()` 与`render()`相同，但用于混合容器，该容器的 HTML 内容是由 `ReactDOMServer` 渲染的。React 将尝试将事件监听器附加到现有的 html 标签上。

需要注意的是 `nodejs` 本身不支持 `jsx`，需要 `babel` 的支持。下面从零开始搭建一个同构开发环境

### Step-1

环境搭建和基本配置

#### 环境搭建

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
// ./src/App.js
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

#### ssr 和 csr 入口文件配置

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

#### npm scripts 编写

```json
"scripts": {
  "dev:server": "webpack --config config/webpack.server.js --watch",
  "dev:client": "webpack --config config/webpack.client.js --watch",
  "dev:start": "nodemon --watch build exec node \"./build/bundle.js\"",
  "start": "npm run dev:server & npm run dev:client & npm run dev:start"
},
```

运行 npm start 后就可以同时启动开发环境了

#### Setp-1 总结

- 缺少热重载，修改代码后需要手动刷新浏览器

### Setp-2

添加路由支持和 redux 数据流

#### 用 react-router-dom 添加路由支持

修改客户端入口文件，使用 `react-router-dom` 中的 `BrowserRouter` 组件添加客户端路由

```js
// ./client/index.js
// ...
import { BrowserRouter } from 'react-router-dom'
import App from '../src/App'

const Root = (
  <Provider store={store}>
    <BrowserRouter>{App}</BrowserRouter>
  </Provider>
)
// ...
```

修改服务端入口文件，使用 `StaticRouter` 组件添加客户端路由

```js
// ./client/index.js
// ...
import { StaticRouter } from 'react-router-dom'
import App from '../src/App'

// ...
app.get('*', (req, res) => {
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>{App}</StaticRouter>
    </Provider>
  )
  // ...
})
// ...
```

## 参考文章

- [服务端渲染（SSR)](https://juejin.im/post/5c068fd8f265da61524d2abc)
- [不容错过的 Babel7 知识](https://juejin.im/post/5ddff3abe51d4502d56bd143)
