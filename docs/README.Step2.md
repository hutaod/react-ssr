# React 同构应用开发 - Step 2

1. 用 react-router-dom 添加路由支持
2. 添加 redux 支持
3. babel 配置升级
4. 添加 mock 支持

## 用 react-router-dom 添加路由支持

实现思路：

1. `react-router-dom` 提供了 `BrowserRouter` 组件可供客户端添加路由
2. `react-router-dom` 提供了 `StaticRouter` 组件，可接受`req.url`作为`location`的值传递给 React，并匹配到对应的路由
3. 新增首页和关于页用于测试
4. 修改 App.js 把页面添加进路由

具体实现
一、修改客户端入口文件，使用 `react-router-dom` 中的 `BrowserRouter` 组件添加客户端路由

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

二、修改服务端入口文件，使用 `StaticRouter` 组件添加客户端路由

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

三、新增首页和关于页

```js
// src/pages/index.js
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Index = ({ name = '哈哈' }) => {
  const [count, setCount] = useState(0)

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
      <Link to="/">关于我</Link>
    </div>
  )
}

export default Index
```

```js
// src/pages/about.js
import React from 'react'

const About = ({ history }) => {
  return (
    <div>
      <h1>About</h1>
      <button
        onClick={() => {
          history.goBack()
        }}
      >
        返回上一页
      </button>
    </div>
  )
}

export default About
```

修改 App.js

```js
// src/App.js
import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import Index from './pages/Index'
import About from './pages/About'

const App = () => {
  return (
    <div>
      <Route path="/" exact component={Index} />
      <Route path="/about" exact component={About} />
    </div>
  )
}

export default <App />
```

## 添加 redux

先安装相关依赖

```bash
npm i redux react-redux
```

实现思路：

1. 简单封装`redux`，用一个个 `model` 来处理数据
2. 创建`store`
3. 直接用`react-redux`官方用法把 `store` 接入 `React` 应用的服务端和客户端入口

具体实现：

一、为了使 redux 使用更方便，基于 redux 写了一个用法类似 dva 的方案，具体代码实现如下

```js
// src/redux-model/utils/isPlainObject.js
/**
 * @param obj The object to inspect.
 * @returns True if the argument appears to be a plain object.
 */
export default function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}
// src/redux-model/index.js
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import isNode from 'detect-node'
import isPlainObject from './utils/isPlainObject'

let store
const rootReducers = {}
const rootEffects = {}

// 动态注入reducer
export const addReducer = (key, reducer, effects) => {
  if (!key || typeof key !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('error')
    }
    return
  }
  if (!reducer || typeof reducer !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('error')
    }
    return
  }
  if (rootReducers[key]) {
    throw Error('reducer has exist')
  }
  rootReducers[key] = reducer
  rootEffects[key] = effects

  if (store) {
    store.replaceReducer(combineReducers(rootReducers))
  }
}

/**
 *
 * @param {Object} options
 * {
 *  namespace, // model 命名空间
 *  state, 初始值
 *  reducers，唯一可以修改state的地方，由action触发
 *  effects，用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，可以和服务器交互，可以获取全局 state 的数据等等。
 * }
 */
export const model = ({ namespace, state, reducers, effects }) => {
  if (typeof namespace !== 'string' || namespace.trim().length === 0) {
    console.error('namespace not exist')
    return
  }
  if (typeof state !== 'undefined') {
    const reducer = function(prevState = state, action) {
      const typeArr = action.type.split('/')
      // 判断reducers是是符合要求的对象，并且判断action.type是否符合要求
      if (isPlainObject(reducers) && typeArr[0] === namespace) {
        const callFunc = reducers[typeArr[1]]

        if (typeof callFunc === 'function') {
          const nextState = callFunc(prevState, action)
          // 如果新的state是undefined就抛出对应错误
          if (typeof nextState === 'undefined') {
            throw new Error('return state error！')
          }
          return nextState
        }
      }
      return prevState
    }
    addReducer(namespace, reducer, effects)
  }
}

const rayslog = function({ initialState, initialModels, middlewares = [] }) {
  // 初始model
  if (isPlainObject(initialModels)) {
    for (const key in initialModels) {
      const initialModel = initialModels[key]
      if (isPlainObject(initialModel)) {
        model(initialModel)
      }
    }
  }
  // 副作用处理
  const effectsMiddle = (store) => (dispatch) => (action) => {
    if (isPlainObject(action) && typeof action.type === 'string') {
      const { type, ...args } = action
      const actionType = action.type.split('/')
      const namespace = actionType[0]
      const actualtype = actionType[1]
      if (rootEffects[namespace] && rootEffects[namespace][actualtype]) {
        return rootEffects[namespace][actualtype](
          {
            dispatch: ({ type, ...rest }) => {
              return dispatch({
                type: `${namespace}/${type}`,
                ...rest
              })
            }
          },
          { ...args }
        )
      }
      return dispatch(action)
    }
    return dispatch(action)
  }

  let composeEnhancers = compose
  if (!isNode) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  }
  // 创建store
  store = createStore(
    combineReducers(rootReducers),
    initialState,
    composeEnhancers(applyMiddleware(effectsMiddle, ...middlewares))
  )

  return {
    store,
    addReducer,
    getStore() {
      return store
    }
  }
}

export default rayslog
```

二、添加 store 文件夹用于管理全局 store

```js
// src/store/index.js
import reduxModel from '../redux-model'
import global from './global'

// models
const initialModels = {
  global
}

const { store } = reduxModel({ initialModels })

export default store

// src/store/global.js
import axios from '../utils/axios'

export default {
  namespace: 'global',
  state: {
    list: []
  },
  reducers: {
    putList(state, { payload }) {
      return {
        ...state,
        list: payload
      }
    }
  },
  effects: {
    async getCourseList({ dispatch }, { payload }) {
      const res = await axios.get('/api/course/list')
      dispatch({
        type: 'putList',
        payload: res.list
      })
    }
  }
}
```

三、用`react-redux`官方用法把 `store` 接入 `React` 应用的服务端和客户端入口

```js
// ./client/index.js
// ..
import { Provider } from 'react-redux'
import store from '../src/store'
const Root = (
  <Provider store={store}>
    <BrowserRouter>{App}</BrowserRouter>
  </Provider>
)
export default ReactDom.hydrate(Root, document.getElementById('root'))

// ./server/index.js
// ..
import { Provider } from 'react-redux'
// ..
import store from '../src/store'
// ..
app.get('*', (req, res) => {
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>{App}</StaticRouter>
    </Provider>
  )
  // ..
})
// ..

// 在首页Index组件中就可以使用获取store中的数据和发起action
// src/pages/Index.js
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

const Index = ({ courses, dispatch, history }) => {
  useEffect(() => {
    dispatch({
      type: 'global/getCourseList'
    })
  }, [])
  return (
    <div>
      <h3>课程列表</h3>
      <ul>
        {courses.map((item) => (
          <li
            key={item.id}
            onClick={() => {
              history.push('/detail')
            }}
          >
            <a>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default connect((state) => ({
  courses: state.global.list
}))(Index)
```

## babel 配置升级

思路：为了支持 async/await 和一些其他 js 新语法，需要添加`corejs3`的特性

具体实现：

一、先安装相关 babel 依赖

```bash
npm i -D @babel/plugin-transform-runtime
npm i -S @babel/runtime @babel/runtime-corejs3
```

二、修改 .babelrc

```js
// .babelrc
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

## 添加 mock 支持

思路：

1. 新创建一个`express`服务，用于模拟接口
2. 用`nodemon`启动服务，可以修改后快速重启

具体实现：

一、为了更好的开发测试，新建 mock 文件,模拟接口

```js
// mock/index.js
const express = require('express')
const app = express()

app.get('/api/course/list', (req, res) => {
  // 跨域设置
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  res.header('Content-Type', 'application/json;charset=utf-8')
  res.json({
    code: 0,
    list: [
      { name: 'Web前端', id: 1 },
      { name: 'Java', id: 2 }
    ]
  })
})

app.listen(9090, () => {
  console.log('mock at 9090')
})
```

二、用 nodemon 启动后就可以 mock 接口了

```bash
npm i nodemon -g
nodemon mock/index.js
```

## 结语

仓库代码地址：[https://github.com/ht1131589588/react-ssr/tree/step-2](https://github.com/ht1131589588/react-ssr/tree/step-2)
