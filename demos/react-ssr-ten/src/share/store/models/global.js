
export default {
  namespace: 'global',
  state: {
    list: [],
  },
  reducers: {
    putList(state, { payload }) {
      return {
        ...state,
        list: payload,
      }
    },
  },
  effects: {
    async getCourseList({ dispatch }, { payload }) {
      const res = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            list: [{ name: "香蕉" }]
          })
        }, 2000)
      })
      dispatch({
        type: 'putList',
        payload: res.list,
      })
    },
  },
}
