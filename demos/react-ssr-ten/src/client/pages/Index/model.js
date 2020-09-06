import { model } from "../../../demacia"

export default model({
  namespace: 'Index',
  // 相当于react-redux中的connect的第一个参数，会传入state，返回的对象会返回给组件的props
  selectors: function(state) {
    return {
      todos: state.Index.todos,
      loading: state.Index.loading,
      total: state.Index.todos.reduce((acc, item) => acc + (item.count || 0), 0)
    }
  },
  state: {
    todos: [{ name: '菠萝', id: 0, count: 2 }]
  },
  reducers: {
    putTodos(state, { payload, ...other }) {
      return {
        ...state,
        todos: [...state.todos, ...payload]
      }
    },
    putAdd(state, { payload }) {
      return {
        ...state,
        todos: [...state.todos, payload]
      }
    }
  },
  effects: {
    async getTodos({ dispatch, ...other }, ...extra) {
      const { datas } = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            code: 0,
            datas: [
              { name: '🍎', id: Math.random().toString(32).slice(2), count: 11 },
              { name: '🍆', id: Math.random().toString(32).slice(2), count: 22 }
            ]
          })
        }, 1000)
      })
      dispatch({ type: 'putTodos', payload: datas })
    },
    async add({ dispatch }, { payload }) {
      const { code } = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            code: 0
          })
        }, 200)
      })
      if (code === 0) {
        dispatch({ type: 'putAdd', payload: payload })
      }
    }
  }
})
