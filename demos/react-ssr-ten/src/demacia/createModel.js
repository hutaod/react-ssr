import isNode from 'detect-node'
import merge from "lodash/merge"
import checkModel from './utils/checkModel'
import createReducers from './createReducers'
import { injectReducer, injectEffects, allModels } from './store'

/**
 * 处理model
 * @param {Object} model
 */
export default function createModel(model) {
  if (!isNode) {
    checkModel(model, allModels)
  }

  let selectors = null
  if (!model.state.loading) {
    model.state.loading = []
  }
  // 用于支持 selectors
  if (model.selectors) {
    selectors = state => {
      return model.selectors(state)
    }
  }
  if (model.reducers) {
    // 给所有model 的 reducers添加上resetStore
    model.reducers['resetStore'] = () => {
      return model.state
    }
    // 给所有model 的 reducers添加上setStore，但可以也model重置
    const customSetStore = model.reducers.setStore;
    model.reducers['setStore'] = (state, { payload }) => {
      if (customSetStore) {
        return customSetStore(state, payload)
      }
      return merge(state, payload)
    }
    // 给所有model 的 reducers添加上@@setLoading, @@这里表示私有，这个只在内部运行
    model.reducers['@@setLoading'] = (state, { payload: effectName }) => {
      return {
        ...state,
        loading: [...state.loading, effectName]
      }
    }
    // 给所有model 的 reducers添加上@@setLoading, @@这里表示私有，这个只在内部运行
    model.reducers['@@deleteLoading'] = (state, { payload: effectName }) => {
      return {
        ...state,
        loading: state.loading.filter(item => item !== effectName)
      }
    }

    const reducer = createReducers(model)
    injectReducer(model.namespace, reducer)
  }
  if (model.effects) {
    injectEffects(model.namespace, model.effects)
  }
  return { selectors }
}
