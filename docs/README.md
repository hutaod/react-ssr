## 异步数据如何在首屏渲染的时候呈现在 html 中

解决思路：

1. 在服务端执行数据请求方法，拿到数据后存入 `store`，服务端的 `store` 数据就会渲染在 `html 字符串`中
2. 把 `store` 中的数据取出并通过拼接一段 js 代码把数据注入到 `window.__context` 变量上
3. 客户端通过 `window.__context` 拿取初始化 state，并生成客户端 store，客户端 store 数据就与服务端数据同步了

具体实现：

一、修改 `App.js`，不直接导出一个 `React` 组件，而是导出路由配置的一个 `json 数组`

```js
// app.js
import Index from './pages/Index'
import About from './pages/About'
import User from './pages/User'

export default [
  {
    path: '/',
    component: Index,
    exact: true,
    key: 'index'
  },
  {
    path: '/about',
    component: About,
    exact: true,
    key: '/about'
  },
  {
    path: '/user',
    component: User,
    exact: true,
    key: '/user'
  }
]
```

二、修改 `store/index.js`，把 `store` 分成两份导出，其余逻辑公用

```js
import reduxModel from '../redux-model'
import global from './global'

// models
const initialModels = {
  global
}

// 服务端直接拿取store
export const getServerStore = () => {
  const { store } = reduxModel({ initialModels })
  return store
}
// 客户端判断window.__context是否存在来注入initialState
export const getClientStore = () => {
  const initialState = window.__context || {}
  const { store } = reduxModel({ initialModels, initialState })
  return store
}
```

三、修改服务端 `server/index.js`，同步第一个步骤`App.js`被修改成路由配置文件和根绝第二个步骤声明的`getClientStore`方法来获取服务端的 `store`

```js
// ...
import routes from '../src/App'
import { getServerStore } from '../src/store'

const store = getServerStore()
// ...
// 主要逻辑修改
app.get('*', (req, res) => {
  // 获取匹配路由中需要初始化请求数据的方法
  const promises = []
  routes.some((route) => {
    const loadData = route.component.loadData
    if (matchPath(req.path, route) && typeof loadData === 'function') {
      // promises.push(loadData(store))
      // 处理异步任务报错，页面不会渲染
      promises.push(
        new Promise((resolve) => {
          loadData({ ...store, axios })
            .then(resolve)
            .catch((err) => {
              console.error(chalk.redBright(err))
              resolve(err)
            })
        })
      )
    }
  })
  // 等待所有异步任务执行完毕后再进行响应客户端
  Promise.all(promises).then((data) => {
    const content = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url}>
          <Header />
          {routes.map((route) => (
            <Route {...route} />
          ))}
        </StaticRouter>
      </Provider>
    )
    // 向window.__context注入服务端store的内容
    const initialState = `
      <script>
        window.__context = ${JSON.stringify(store.getState())}
      </script>
    `
    res.send(`
      <!doctype html>
      <html>
        <head>
          <title>react ssr</title>
          <meta charset="utf-8" />
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
```

获取所有 `promise` 请求任务的地方进行了错误异常处理，不管`loadData`执行是否错误，都会 `resolve` 出去，防止任务失败导致`Promise.all(promises).then` 方法不会执行，并且也可以在 `catch` 方法中打印错误日志，以便定位错误

```js
// 处理异步任务报错，页面不会渲染
promises.push(
  new Promise((resolve) => {
    loadData({ ...store, axios })
      .then(resolve)
      .catch((err) => {
        console.error(err)
        resolve(err)
      })
  })
)
```

四、修改`client/index.js`，同步第一个步骤`App.js`被修改成路由配置文件和根绝第二个步骤声明的`getClientStore`方法来获取客户端的 `store`

```js
import routes from '../src/App'
import { getClientStore } from '../src/store'

const Root = (
  <Provider store={getClientStore()}>
    <BrowserRouter>
      <Header />
      {routes.map((route) => (
        <Route {...route} />
      ))}
    </BrowserRouter>
  </Provider>
)

export default ReactDom.hydrate(Root, document.getElementById('root'))
```

现在已经可以实现服务断异步请求接口服务器并然后渲染后的 `html 字符串`，然后前端通过`window.__context`获取服务端注入的初始 `state`

## 前后端统一数据处理

根绝是否有初始数据来判断是否应该再客户端请求数据，修改 src/pages/Index.js

```js
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

const Index = ({ name = '哈哈', courses, dispatch, history, ...restProps }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (courses.length === 0) {
      dispatch({
        type: 'global/getCourseList'
      })
    }
  }, [])
  return (
    <div>
      <h1>
        hello {name} {count}
      </h1>
      <button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        Add
      </button>
      <h3>课程列表</h3>
      <ul>
        {courses.map((item) => (
          <li
            key={item.id}
            onClick={() => {
              history.push('/about')
            }}
          >
            <a>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

Index.loadData = ({ dispatch }) => {
  return dispatch({
    type: 'global/getCourseList'
  })
}

export default connect((state) => ({
  courses: state.global.list
}))(Index)
```

## 统一处理 axios 请求

思路：

1. 封装 axios，让页面请求定位到当前域名的`/api`路由
2. 服务端代理以`/api`开头的请求到接口服务器

封装 axios：

```js
// src/utils/axios
import axios from 'axios'
import isNode from 'detect-node'

// 创建axios实例
const axiosInstance = axios.create({
  // url基础地址，解决不同数据源url变化 服务端渲染必须配置, 否则在nodejs中请求会定位到80端口
  baseURL: isNode ? 'http://localhost:8091/' : '/',
  // 请求超时时间
  timeout: 5000
})

// 3. 响应拦截
axiosInstance.interceptors.response.use(
  (response) => {
    // 仅返回数据部分
    const res = response.data
    return res
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default {
  get: (url, data, others = {}) => {
    return axiosInstance({
      ...others,
      url,
      method: 'GET',
      params: data,
      data: undefined
    })
  },
  post: (url, data, others) => {
    return axiosInstance({
      ...others,
      url,
      method: 'POST',
      data: data
    })
  }
}
```

需要先安装`http-proxy-middleware`插件，然后在`server/index.js`中代理 api 请求：

```js
app.use('/api', proxy({ target: 'http://localhost:9090/', changeOrigin: true }))
```

请求的地方都引入 `src/utils/axios.js` 替代 `axios`

## 疑问点或待解决点

- 路由切换是如何实现不重新请求后端的？
- 能否请求数据只写一遍逻辑，而不需要判断否有初始数据来判断是否应该再客户端请求数据，再写一次重复的逻辑
