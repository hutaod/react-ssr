## Setp-2

添加路由支持和 redux 数据流

### 用 react-router-dom 添加路由支持

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

新增首页和关于页

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

### 添加 redux

先安装相关依赖

```bash
npm i redux react-redux
```

为了使 redux 使用更方便，基于 redux 写了一个用法类似 dva 的方案，具体代码实现如下

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

添加 store 文件夹用于管理全局 store

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

其他相关代码修改

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
