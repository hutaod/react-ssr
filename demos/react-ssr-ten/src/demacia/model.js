import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import createModel from './createModel'

/**
 *
 * @param {Object} model
 * {
 *  namespace, // model 命名空间
 *  state, 初始值
 *  reducers，唯一可以修改state的地方，由action触发
 *  effects，用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，可以和服务器交互，可以获取全局 state 的数据等等。
 * }
 */
export default function model(model) {
  const { selectors } = createModel(model)
  const actions = createActions(model)
  function Wrap(Component) {
    return connect(selectors, actions)(Component)
  }

  return Wrap
}

function createActions(model) {
  // 传递给组件直接操作redux的方法
  const reducerFuncs = {
    resetStore: () => ({
      type: `${model.namespace}/resetStore`
    }),
    setStore: data => ({
      type: `${model.namespace}/setStore`,
      payload: data
    })
  }
  let effectFuncs = {}
  if (model.effects) {
    // 把调用effects的actionCreater方法直接传递给组件
    effectFuncs = Object.keys(model.effects).reduce((result, effectKey) => {
      result[effectKey] = payload => {
        return {
          type: `${model.namespace}/${effectKey}`,
          payload
        }
      }
      return result
    }, {})
  }
  const propsFuncs = { ...reducerFuncs, ...effectFuncs }
  return dispatch => bindActionCreators(propsFuncs, dispatch)
}
