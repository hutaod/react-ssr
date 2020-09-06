import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import isNode from 'detect-node'
import isPlainObject from './utils/isPlainObject'
import createModel from './createModel'

let store = null
const allReducer = {}
const allEffects = {}
let inActionEffectsInfos = {}
export const allModels = {}

/**
 * 动态注入reducer
 * @param {String} namespace
 * @param {Function} reducer
 */
export function injectReducer (namespace, reducer) {
  if (!namespace || typeof namespace !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('error')
    }
    return
  }
  if (!reducer || typeof reducer !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('reducer must be a function')
    }
    return
  }
  allReducer[namespace] = reducer
  if (store) {
    store.replaceReducer(combineReducers(allReducer))
  }
}

/**
 * 动态注入effects
 * @param {String} namespace
 * @param {Function} effects
 */
export function injectEffects (namespace, effects) {
  if (!namespace || typeof namespace !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('error')
    }
    return
  }
  if (!effects || typeof effects !== 'object' || Array.isArray(effects)) {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('effects must be a object')
    }
    return
  }
  allEffects[namespace] = effects
}

function createEffectsMiddle (effectsExtraArgument) {
  return store => dispatch => action => {
    if (isPlainObject(action) && typeof action.type === 'string') {
      const { type, ...args } = action
      const actionType = action.type.split('/')
      const namespace = actionType[0]
      const actualtype = actionType[1]

      if (allEffects[namespace] && allEffects[namespace][actualtype]) {
        // 搜集所有执行中effects
        const effectName = `${namespace}/${actualtype}`
        // 浏览器端 __LOADED__ 为true时，直接返回，不进行异步操作
        if (!isNode && store.getState()[namespace].__LOADED__) {
          return dispatch({
            type: `${namespace}/setStore`,
            payload: { __LOADED__: null }
          })
        }
        if (!isNode) {
          // 开始执行 异步操作
          dispatch({ type: `${namespace}/@@setLoading`, payload: actualtype })
        }
        // 服务端渲染时，如果已经在异步操作时，直接返回已存在的异步操作
        if (isNode) {
          dispatch({
            type: `${namespace}/setStore`,
            payload: { __LOADED__: true }
          })
          if (inActionEffectsInfos[effectName]) {
            return inActionEffectsInfos[effectName]
          }
        }
        // 异步操作，添加Promise.resolve().then来保证异步执行
        const effectFunc = Promise.resolve().then(
          () =>
            new Promise((resolve, reject) => {
              const state = store.getState()
              allEffects[namespace][actualtype](
                {
                  ...effectsExtraArgument,
                  dispatch: ({ type, ...rest }) => {
                    return dispatch({
                      type: `${namespace}/${type}`,
                      ...rest
                    })
                  },
                  state: state[namespace]
                },
                { ...args }
              )
                .then(resolve)
                .catch(reject)
                .finally(() => {
                  if (!isNode) {
                    dispatch({
                      type: `${namespace}/@@deleteLoading`,
                      payload: actualtype
                    })
                  }
                  if (inActionEffectsInfos[effectName]) {
                    delete inActionEffectsInfos[effectName]
                  }
                })
            })
        )
        inActionEffectsInfos[effectName] = effectFunc
        return inActionEffectsInfos[effectName]
      }
      return dispatch(action)
    }
    return dispatch(action)
  }
}

function demacia ({
  initialState,
  initialModels,
  middlewares = [],
  effectsExtraArgument = {}
}) {
  // 初始model
  if (isPlainObject(initialModels)) {
    for (const key in initialModels) {
      const initialModel = initialModels[key]
      if (isPlainObject(initialModel)) {
        createModel(initialModel)
      }
    }
  }

  // effects处理的中间件
  const effectsMiddle = createEffectsMiddle(effectsExtraArgument)

  let composeEnhancers = compose
  if (!isNode) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  }
  // 可能初始化的时候allReducer还为空对象
  const reducer =
    Object.keys(allReducer).length > 0
      ? combineReducers(allReducer)
      : function reducer (state) {
          return state
        }
  // 创建store
  store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(effectsMiddle, ...middlewares))
  )

  // 用于手动执行所有的effetcs
  // 一般用于服务端渲染时
  store.runEffects = namespace => {
    const allPromise = []
    Object.keys(inActionEffectsInfos)
      .filter(a => !!a)
      .forEach(actionType => {
        if (!namespace || actionType.indexOf(`${namespace}/`) === 0) {
          if (inActionEffectsInfos[actionType]) {
            allPromise.push(inActionEffectsInfos[actionType])
          }
        }
      })
    inActionEffectsInfos = {}
    return allPromise
  }

  return store
}

export default demacia
